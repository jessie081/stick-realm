import { io, Socket } from 'socket.io-client';

// Connect to backend server
const getServerUrl = () => {
  // In production, connect to Render backend
  if (window.location.hostname !== 'localhost') {
    return 'https://stick-realm.onrender.com'; // Replace with your Render URL
  }
  // In development, connect to localhost
  return 'http://localhost:3000';
};

export class GameClient {
  socket: Socket;
  players: any = {};
  interactables: any[] = [];
  myId: string | null = null;
  map: { width: number, height: number } = { width: 2000, height: 2000 };
  game: any = { state: 0, mode: 0, timer: 0, teamScores: { red: 0, blue: 0 }, killFeed: [] };
  onStateUpdate: (data: { players: any, interactables: any[], game: any }) => void;

  constructor(onStateUpdate: (data: { players: any, interactables: any[], game: any }) => void) {
    const serverUrl = getServerUrl();
    console.log('Connecting to server:', serverUrl);
    this.socket = io(serverUrl);
    this.onStateUpdate = onStateUpdate;

    this.socket.on('init', (data) => {
      this.myId = data.id;
      this.players = data.players;
      this.interactables = data.interactables;
      this.map = data.map;
      if (data.game) this.game = { ...this.game, ...data.game };
    });

    this.socket.on('state', (data) => {
      this.players = data.players;
      this.interactables = data.interactables;
      this.onStateUpdate({ players: this.players, interactables: this.interactables, game: this.game });
    });

    this.socket.on('gameUpdate', (data) => {
      this.game = { ...this.game, ...data };
      this.onStateUpdate({ players: this.players, interactables: this.interactables, game: this.game });
    });

    this.socket.on('gameOver', (data) => {
      this.game.winner = data.winner;
    });

    this.socket.on('killFeed', (msg) => {
      this.game.killFeed.push(msg);
      if (this.game.killFeed.length > 5) this.game.killFeed.shift();
    });

    this.socket.on('playerJoined', (player) => {
      this.players[player.id] = player;
    });

    this.socket.on('playerLeft', (id) => {
      delete this.players[id];
    });

    this.socket.on('playerRespawn', (player) => {
      this.players[player.id] = player;
    });

    this.socket.on('playerAttack', (data) => {
      if (this.players[data.id]) {
        this.players[data.id].lastAttack = Date.now();
        this.players[data.id].angle = data.angle;
      }
    });

    this.socket.on('playerHit', (data) => {
      if (this.players[data.targetId]) {
        this.players[data.targetId].lastHit = Date.now();
        this.players[data.targetId].health = data.health;
      }
    });
  }

  join(username: string, color: string, accessory: string, mode: number, bots: boolean) {
    this.socket.emit('join', { username, color, accessory, mode, bots });
  }

  sendInput(inputs: { up: boolean, down: boolean, left: boolean, right: boolean }) {
    this.socket.emit('input', inputs);
  }

  attack() {
    this.socket.emit('attack');
  }

  useSkill(skillName: string) {
    this.socket.emit('skill', skillName);
  }
}
