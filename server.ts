import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

// Process-level error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // In a real app, you might want to do a graceful shutdown here
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const USE_MONGODB = process.env.MONGODB_URI ? true : false;
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Database Mode:', USE_MONGODB ? 'MongoDB' : 'In-Memory');

async function startServer() {
  console.log('Starting server initialization...');
  const app = express();
  const httpServer = createServer(app);
  console.log('Express and HTTP server created.');
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
  app.use(express.json());

  // AGGRESSIVE DEBUG LOGGER - MUST BE FIRST
  app.use((req, res, next) => {
    console.log(`>>> [TRACE] ${req.method} ${req.url}`);
    next();
  });

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok',
      database: USE_MONGODB ? 'enabled' : 'in-memory',
      serverTime: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development',
      guestMode: true
    });
  });

  // Auth Routes removed for purely guest mode

  // Catch-all for unhandled API routes
  app.all('/api/*', (req, res) => {
    console.log(`[API 404] ${req.method} ${req.path}`);
    res.status(404).json({ error: 'API route not found', path: req.path });
  });

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      details: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred' 
    });
  });

  // Optional MongoDB Connection (for future persistent stats)
  if (USE_MONGODB) {
    const mongoose = await import('mongoose');
    const MONGODB_URI = process.env.MONGODB_URI!;
    console.log(`[DB] Attempting to connect to MongoDB...`);
    
    mongoose.default.connect(MONGODB_URI, { 
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    })
      .then(() => console.log('[DB] Successfully connected to MongoDB'))
      .catch(err => {
        console.error('[DB] MongoDB connection error:', err.message);
        console.error('[DB] Continuing with in-memory mode...');
      });
  }

  // Game State
  const players: any = {};
  const interactables: any[] = [];
  const MAP_WIDTH = 2000;
  const MAP_HEIGHT = 2000;

  // Initialize Interactables
  function spawnInteractables() {
    interactables.length = 0;
    // Health Packs
    for (let i = 0; i < 12; i++) {
      interactables.push({
        id: `hp-${i}`,
        type: 'health',
        x: Math.random() * MAP_WIDTH,
        y: Math.random() * MAP_HEIGHT,
        active: true,
        respawnAt: 0
      });
    }
    // Speed Boosts
    for (let i = 0; i < 6; i++) {
      interactables.push({
        id: `speed-${i}`,
        type: 'speed',
        x: Math.random() * MAP_WIDTH,
        y: Math.random() * MAP_HEIGHT,
        active: true,
        respawnAt: 0
      });
    }
    // Damage Boosts
    for (let i = 0; i < 4; i++) {
      interactables.push({
        id: `damage-${i}`,
        type: 'damage',
        x: Math.random() * MAP_WIDTH,
        y: Math.random() * MAP_HEIGHT,
        active: true,
        respawnAt: 0
      });
    }
    // Shields
    for (let i = 0; i < 4; i++) {
      interactables.push({
        id: `shield-${i}`,
        type: 'shield',
        x: Math.random() * MAP_WIDTH,
        y: Math.random() * MAP_HEIGHT,
        active: true,
        respawnAt: 0
      });
    }
  }
  spawnInteractables();

  // Game State & Modes
  const GameState = { LOBBY: 0, PLAYING: 1, GAMEOVER: 2 } as const;
  type GameState = typeof GameState[keyof typeof GameState];
  
  const GameMode = { DEATHMATCH: 0, TEAM_BATTLE: 1, SURVIVAL: 2, PRACTICE: 3 } as const;
  type GameMode = typeof GameMode[keyof typeof GameMode];

  let currentState: GameState = GameState.LOBBY;
  let currentMode: GameMode = GameMode.DEATHMATCH;
  let requestedMode: GameMode | null = null;
  let requestedBots: boolean = true;
  let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
  let gameTimer = 0;
  let teamScores = { red: 0, blue: 0 };
  let killFeed: any[] = [];
  const MODE_DURATION = 180; // 3 minutes
  const LOBBY_DURATION = 30; // 30 seconds
  const WIN_KILLS = 20;

  function broadcastGameUpdate() {
    io.emit('gameUpdate', {
      state: currentState,
      mode: currentMode,
      timer: gameTimer,
      teamScores,
      killFeed: killFeed.slice(-5)
    });
  }

  function startNewGame() {
    if (requestedMode !== null) {
      currentMode = requestedMode;
    } else {
      const modes = [GameMode.DEATHMATCH, GameMode.TEAM_BATTLE, GameMode.SURVIVAL, GameMode.PRACTICE];
      currentMode = modes[Math.floor(Math.random() * modes.length)];
    }
    
    currentState = GameState.PLAYING;
    gameTimer = MODE_DURATION;
    teamScores = { red: 0, blue: 0 };
    killFeed = [];

    // Clear old bots
    Object.keys(players).forEach(id => {
      if (id.startsWith('bot_')) delete players[id];
    });

    // Reset players
    Object.values(players).forEach((p: any) => {
      p.health = p.maxHealth;
      p.kills = 0;
      p.deaths = 0;
      p.x = Math.random() * MAP_WIDTH;
      p.y = Math.random() * MAP_HEIGHT;
      p.buffs = {
        speed: 0,
        damage: 0,
        shield: 0,
        rage: 0,
        guard: 0
      };
      p.cooldowns = {
        dash: 0,
        heavySlash: 0,
        guard: 0,
        rage: 0
      };
      if (currentMode === GameMode.TEAM_BATTLE) {
        p.team = Math.random() > 0.5 ? 'red' : 'blue';
      } else {
        delete p.team;
      }
    });

    // Spawn bots if requested or in Practice Mode
    if (requestedBots || currentMode === GameMode.PRACTICE) {
      const botCount = 5;
      for (let i = 0; i < botCount; i++) {
        spawnBot(`bot_${i}`, `Operative_${i + 1}`);
      }
    }

    io.emit('gameStart', { mode: currentMode, players });
    broadcastGameUpdate();
  }

  function spawnBot(id: string, username: string) {
    players[id] = {
      id,
      isBot: true,
      username,
      x: Math.random() * MAP_WIDTH,
      y: Math.random() * MAP_HEIGHT,
      health: 100,
      maxHealth: 100,
      level: 1,
      xp: 0,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      accessory: 'none',
      weaponType: 'sword',
      inputs: { up: false, down: false, left: false, right: false },
      lastAttack: 0,
      lastHit: 0,
      kills: 0,
      deaths: 0,
      buffs: {
        speed: 0,
        damage: 0,
        shield: 0,
        rage: 0,
        guard: 0
      },
      cooldowns: {
        dash: 0,
        heavySlash: 0,
        guard: 0,
        rage: 0
      },
      angle: 0,
      targetId: null,
      nextDecision: 0
    };
  }

  function updateBots() {
    const now = Date.now();
    const botIds = Object.keys(players).filter(id => id.startsWith('bot_'));
    
    botIds.forEach(botId => {
      const bot = players[botId];
      if (bot.health <= 0) return;

      // Decision making with improved logic
      if (now > bot.nextDecision) {
        // Find nearest enemy
        let nearestEnemy: any = null;
        let minDist = Infinity;

        Object.values(players).forEach((p: any) => {
          if (p.id === bot.id || p.health <= 0) return;
          if (currentMode === GameMode.TEAM_BATTLE && p.team === bot.team) return;
          
          const dist = Math.hypot(bot.x - p.x, bot.y - p.y);
          if (dist < minDist) {
            minDist = dist;
            nearestEnemy = p;
          }
        });

        bot.targetId = nearestEnemy ? nearestEnemy.id : null;
        
        // Difficulty adjustments - more responsive
        const reactionTime = difficulty === 'easy' ? 800 : difficulty === 'medium' ? 400 : 150;
        bot.nextDecision = now + reactionTime + Math.random() * 300;
      }

      // Movement & Combat
      const target = bot.targetId ? players[bot.targetId] : null;
      bot.inputs = { up: false, down: false, left: false, right: false };

      if (target && target.health > 0) {
        const dist = Math.hypot(bot.x - target.x, bot.y - target.y);
        const angle = Math.atan2(target.y - bot.y, target.x - bot.x);
        bot.angle = angle;

        // Improved movement logic
        const shouldRetreat = bot.health < 30 && target.health > bot.health;
        const optimalRange = 60; // Optimal attack range
        
        if (shouldRetreat) {
          // Retreat if low HP
          const retreatAngle = angle + Math.PI;
          bot.inputs.up = Math.sin(retreatAngle) < -0.3;
          bot.inputs.down = Math.sin(retreatAngle) > 0.3;
          bot.inputs.left = Math.cos(retreatAngle) < -0.3;
          bot.inputs.right = Math.cos(retreatAngle) > 0.3;
        } else if (dist > optimalRange + 20) {
          // Move toward target
          bot.inputs.up = Math.sin(angle) < -0.3;
          bot.inputs.down = Math.sin(angle) > 0.3;
          bot.inputs.left = Math.cos(angle) < -0.3;
          bot.inputs.right = Math.cos(angle) > 0.3;
        } else if (dist < optimalRange - 20) {
          // Back away slightly if too close
          const backAngle = angle + Math.PI;
          bot.inputs.up = Math.sin(backAngle) < -0.3;
          bot.inputs.down = Math.sin(backAngle) > 0.3;
          bot.inputs.left = Math.cos(backAngle) < -0.3;
          bot.inputs.right = Math.cos(backAngle) > 0.3;
        } else {
          // In optimal range - strafe
          const strafeAngle = angle + Math.PI / 2 * (Math.random() > 0.5 ? 1 : -1);
          bot.inputs.left = Math.cos(strafeAngle) < -0.3;
          bot.inputs.right = Math.cos(strafeAngle) > 0.3;
        }

        // Attack logic
        const attackCooldown = difficulty === 'easy' ? 2000 : difficulty === 'medium' ? 1500 : 1200;
        if (dist < 90 && now - bot.lastAttack > attackCooldown) {
          botAttack(bot);
        }

        // Use skills intelligently
        if (difficulty !== 'easy') {
          // Dash to close distance
          if (dist > 150 && dist < 300 && bot.cooldowns.dash < now && Math.random() > 0.7) {
            bot.cooldowns.dash = now + 3000;
            const dashDist = 150;
            bot.x += Math.cos(angle) * dashDist;
            bot.y += Math.sin(angle) * dashDist;
            io.emit('skillUsed', { id: bot.id, skill: 'dash', x: bot.x, y: bot.y });
          }

          // Use guard when low HP
          if (bot.health < 40 && bot.cooldowns.guard < now && Math.random() > 0.6) {
            bot.cooldowns.guard = now + 12000;
            bot.buffs.guard = now + 3000;
            io.emit('skillUsed', { id: bot.id, skill: 'guard' });
          }

          // Use rage when in combat
          if (difficulty === 'hard' && dist < 100 && bot.cooldowns.rage < now && Math.random() > 0.8) {
            bot.cooldowns.rage = now + 25000;
            bot.buffs.rage = now + 6000;
            io.emit('skillUsed', { id: bot.id, skill: 'rage' });
          }
        }
      } else {
        // Idle movement - patrol
        const idleAngle = (now / 2000) + (parseInt(bot.id.split('_')[1]) * 1.5);
        bot.inputs.right = Math.cos(idleAngle) > 0.5;
        bot.inputs.down = Math.sin(idleAngle) > 0.5;
      }
    });
  }

  function botAttack(bot: any) {
    const now = Date.now();
    bot.lastAttack = now;
    
    // Lunge toward target
    const lungeDist = 20;
    bot.x += Math.cos(bot.angle) * lungeDist;
    bot.y += Math.sin(bot.angle) * lungeDist;

    io.emit('playerAttack', { id: bot.id, angle: bot.angle });

    const ATTACK_RANGE = 80; // Slightly increased for better hit detection
    let baseDamage = 12 + bot.level * 2;

    // Apply damage buffs
    if (bot.buffs.damage > now) baseDamage *= 1.5;
    if (bot.buffs.rage > now) baseDamage *= 1.3;

    Object.values(players).forEach((target: any) => {
      if (target.id === bot.id || target.health <= 0) return;
      if (currentMode === GameMode.TEAM_BATTLE && bot.team === target.team) return;

      const dist = Math.hypot(bot.x - target.x, bot.y - target.y);
      
      // Improved hit detection - check if target is in front of attacker
      const angleToTarget = Math.atan2(target.y - bot.y, target.x - bot.x);
      let angleDiff = Math.abs(bot.angle - angleToTarget);
      if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
      
      const inFrontOfAttacker = angleDiff < Math.PI / 3; // 60 degree cone
      
      if (dist < ATTACK_RANGE && inFrontOfAttacker) {
        applyDamage(bot, target, baseDamage);
      }
    });
  }

  function endGame(winner: string) {
    currentState = GameState.GAMEOVER;
    gameTimer = 10; // 10s of game over screen
    io.emit('gameOver', { winner, mode: currentMode, scores: teamScores });
    broadcastGameUpdate();
  }

  // Helper functions for damage and kill handling
  function applyDamage(attacker: any, target: any, damage: number) {
    const now = Date.now();
    let finalDamage = damage;

    // Attacker Buffs
    if (attacker.buffs.damage > now) finalDamage *= 1.5;
    if (attacker.buffs.rage > now) finalDamage *= 1.3;

    // Target Buffs
    if (target.buffs.shield > now) finalDamage *= 0.5;
    if (target.buffs.guard > now) finalDamage *= 0.2;

    target.health -= finalDamage;
    target.lastHit = now;
    io.emit('playerHit', { targetId: target.id, attackerId: attacker.id, damage: finalDamage, health: target.health });

    if (target.health <= 0) {
      handleKill(attacker, target);
    }
  }

  function handleKill(attacker: any, target: any) {
    const now = Date.now();
    attacker.kills++;
    target.deaths++;
    attacker.xp += 50;

    if (currentMode === GameMode.TEAM_BATTLE) {
      teamScores[attacker.team as 'red' | 'blue']++;
    }

    const killMsg = { attacker: attacker.username, victim: target.username, time: now };
    killFeed.push(killMsg);
    io.emit('killFeed', killMsg);

    if (attacker.xp >= attacker.level * 100) {
      attacker.level++;
      attacker.xp = 0;
      attacker.maxHealth += 20;
      attacker.health = attacker.maxHealth;
    }

    io.emit('playerKilled', { victimId: target.id, attackerId: attacker.id });

    // Win Condition Checks
    if (currentMode === GameMode.DEATHMATCH && attacker.kills >= WIN_KILLS) {
      endGame(`${attacker.username} Wins!`);
    } else if (currentMode === GameMode.TEAM_BATTLE && teamScores[attacker.team as 'red' | 'blue'] >= WIN_KILLS * 2) {
      endGame(`${attacker.team === 'red' ? 'Red' : 'Blue'} Team Wins!`);
    } else if (currentMode === GameMode.SURVIVAL) {
      const alive: any[] = Object.values(players).filter((p: any) => p.health > 0);
      if (alive.length === 1) {
        endGame(`${alive[0].username} is the Survivor!`);
      }
    }

    // Respawn
    if (currentMode !== GameMode.SURVIVAL) {
      setTimeout(() => {
        if (players[target.id]) {
          players[target.id].health = players[target.id].maxHealth;
          players[target.id].x = Math.random() * MAP_WIDTH;
          players[target.id].y = Math.random() * MAP_HEIGHT;
          io.emit('playerRespawn', players[target.id]);
        }
      }, 3000);
    }
  }

  // Timer Tick
  setInterval(() => {
    if (gameTimer > 0) {
      gameTimer--;
      if (gameTimer === 0) {
        if (currentState === GameState.PLAYING) {
          let winner = "Time's Up!";
          if (currentMode === GameMode.TEAM_BATTLE) {
            winner = teamScores.red > teamScores.blue ? "Red Team Wins!" : "Blue Team Wins!";
          }
          endGame(winner);
        } else if (currentState === GameState.GAMEOVER || currentState === GameState.LOBBY) {
          startNewGame();
        }
      }
      broadcastGameUpdate();
    } else if (currentState === GameState.LOBBY && Object.keys(players).length >= 1) {
      startNewGame();
    }
  }, 1000);

  io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    socket.on('join', (data) => {
      const { username, color, accessory, mode, bots } = data;
      
      // If no game is running, or if this is the first player, apply their settings
      if (currentState === GameState.LOBBY || Object.keys(players).length === 0) {
        if (mode !== undefined) requestedMode = mode;
        if (bots !== undefined) requestedBots = bots;
      }

      players[socket.id] = {
        id: socket.id,
        username: username || 'Guest',
        x: Math.random() * MAP_WIDTH,
        y: Math.random() * MAP_HEIGHT,
        health: 100,
        maxHealth: 100,
        level: 1,
        xp: 0,
        color: color || `hsl(${Math.random() * 360}, 70%, 50%)`,
        accessory: accessory || 'none',
        weaponType: 'sword',
        inputs: { up: false, down: false, left: false, right: false },
        lastAttack: 0,
        lastHit: 0,
        kills: 0,
        deaths: 0,
        angle: 0,
        buffs: {
          speed: 0,
          damage: 0,
          shield: 0,
          rage: 0,
          guard: 0
        },
        cooldowns: {
          dash: 0,
          heavySlash: 0,
          guard: 0,
          rage: 0
        },
        team: currentMode === GameMode.TEAM_BATTLE ? (Math.random() > 0.5 ? 'red' : 'blue') : undefined
      };

      socket.emit('init', { 
        id: socket.id, 
        players, 
        interactables,
        map: { width: MAP_WIDTH, height: MAP_HEIGHT },
        game: { state: currentState, mode: currentMode, timer: gameTimer }
      });
      socket.broadcast.emit('playerJoined', players[socket.id]);
    });

    socket.on('input', (inputs) => {
      if (players[socket.id]) {
        players[socket.id].inputs = inputs;
      }
    });

    socket.on('skill', (skillName) => {
      const player = players[socket.id];
      if (!player || player.health <= 0 || currentState !== GameState.PLAYING) return;

      const now = Date.now();
      if (player.cooldowns[skillName] > now) return;

      switch (skillName) {
        case 'dash':
          player.cooldowns.dash = now + 3000; // 3s cooldown
          const dashDist = 150;
          player.x += Math.cos(player.angle) * dashDist;
          player.y += Math.sin(player.angle) * dashDist;
          io.emit('skillUsed', { id: socket.id, skill: 'dash', x: player.x, y: player.y });
          break;

        case 'heavySlash':
          player.cooldowns.heavySlash = now + 8000; // 8s cooldown
          io.emit('playerAttack', { id: socket.id, angle: player.angle, type: 'heavy' });
          
          const HEAVY_RANGE = 100;
          const HEAVY_DAMAGE = 40 + player.level * 5;
          
          Object.values(players).forEach((target: any) => {
            if (target.id === socket.id || target.health <= 0) return;
            if (currentMode === GameMode.TEAM_BATTLE && player.team === target.team) return;

            const dist = Math.hypot(player.x - target.x, player.y - target.y);
            if (dist < HEAVY_RANGE) {
              applyDamage(player, target, HEAVY_DAMAGE);
            }
          });
          break;

        case 'guard':
          player.cooldowns.guard = now + 12000; // 12s cooldown
          player.buffs.guard = now + 3000; // 3s duration
          io.emit('skillUsed', { id: socket.id, skill: 'guard' });
          break;

        case 'rage':
          player.cooldowns.rage = now + 25000; // 25s cooldown
          player.buffs.rage = now + 6000; // 6s duration
          io.emit('skillUsed', { id: socket.id, skill: 'rage' });
          break;
      }
    });

    socket.on('attack', () => {
      const attacker = players[socket.id];
      if (!attacker || attacker.health <= 0 || currentState !== GameState.PLAYING) return;

      const now = Date.now();
      if (now - attacker.lastAttack < 1200) return; // Attack cooldown
      attacker.lastAttack = now;

      // Lunge forward on attack
      const lungeDist = 20;
      attacker.x += Math.cos(attacker.angle) * lungeDist;
      attacker.y += Math.sin(attacker.angle) * lungeDist;

      io.emit('playerAttack', { id: socket.id, angle: attacker.angle });

      const ATTACK_RANGE = 80; // Increased for better hit detection
      let baseDamage = 12 + attacker.level * 2;

      // Apply damage buffs
      if (attacker.buffs.damage > now) baseDamage *= 1.5;
      if (attacker.buffs.rage > now) baseDamage *= 1.3;

      Object.values(players).forEach((target: any) => {
        if (target.id === socket.id || target.health <= 0) return;
        if (currentMode === GameMode.TEAM_BATTLE && attacker.team === target.team) return;

        const dist = Math.hypot(attacker.x - target.x, attacker.y - target.y);
        
        // Improved hit detection - check if target is in front of attacker
        const angleToTarget = Math.atan2(target.y - attacker.y, target.x - attacker.x);
        let angleDiff = Math.abs(attacker.angle - angleToTarget);
        if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
        
        const inFrontOfAttacker = angleDiff < Math.PI / 3; // 60 degree cone
        
        if (dist < ATTACK_RANGE && inFrontOfAttacker) {
          applyDamage(attacker, target, baseDamage);
        }
      });
    });

    socket.on('disconnect', () => {
      console.log('Player disconnected:', socket.id);
      delete players[socket.id];
      io.emit('playerLeft', socket.id);

      if (currentState === GameState.PLAYING && currentMode === GameMode.SURVIVAL) {
        const alive: any[] = Object.values(players).filter((p: any) => p.health > 0);
        if (alive.length === 1) {
          endGame(`${alive[0].username} is the Survivor!`);
        } else if (alive.length === 0) {
          endGame("No Survivors!");
        }
      }
    });
  });

  // Game Loop (40 TPS)
  setInterval(() => {
    const BASE_SPEED = 2.5; // Adjusted for 40 TPS
    const now = Date.now();

    updateBots();

    Object.values(players).forEach((player: any) => {
      if (player.health <= 0) return;

      let moveX = 0;
      let moveY = 0;
      if (player.inputs.left) moveX -= 1;
      if (player.inputs.right) moveX += 1;
      if (player.inputs.up) moveY -= 1;
      if (player.inputs.down) moveY += 1;

      player.moving = moveX !== 0 || moveY !== 0;

      if (player.moving) {
        const angle = Math.atan2(moveY, moveX);
        player.angle = angle;
        
        let currentSpeed = BASE_SPEED;
        if (player.buffs && player.buffs.speed > now) currentSpeed *= 1.7;
        if (player.buffs && player.buffs.rage > now) currentSpeed *= 1.3;

        // Normalize diagonal movement
        const length = Math.sqrt(moveX * moveX + moveY * moveY);
        player.x += (moveX / length) * currentSpeed;
        player.y += (moveY / length) * currentSpeed;
      }

      // Boundaries
      player.x = Math.max(0, Math.min(MAP_WIDTH, player.x));
      player.y = Math.max(0, Math.min(MAP_HEIGHT, player.y));

      // Interactable Collisions
      interactables.forEach((item) => {
        if (!item.active) {
          if (now > item.respawnAt) {
            item.active = true;
            item.x = Math.random() * MAP_WIDTH;
            item.y = Math.random() * MAP_HEIGHT;
            io.emit('interactableSpawn', item);
          }
          return;
        }

        const dist = Math.hypot(player.x - item.x, player.y - item.y);
        if (dist < 35) {
          item.active = false;
          item.respawnAt = now + 15000; // 15s respawn
          io.emit('interactableCollected', { id: item.id, playerId: player.id });

          if (item.type === 'health') {
            player.health = Math.min(player.maxHealth, player.health + 40);
          } else if (item.type === 'speed') {
            player.buffs.speed = now + 6000; // 6s boost
          } else if (item.type === 'damage') {
            player.buffs.damage = now + 8000; // 8s boost
          } else if (item.type === 'shield') {
            player.buffs.shield = now + 8000; // 8s boost
          }
        }
      });
    });

    io.emit('state', { players, interactables });
  }, 1000 / 40);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Initializing Vite server...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware integrated.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      console.log(`[SPA Fallback] Serving index.html for: ${req.method} ${req.url}`);
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('FATAL: Failed to start server:', err);
  process.exit(1);
});
