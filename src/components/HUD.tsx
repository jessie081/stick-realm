import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sword, Trophy, Timer, Users, Target, Zap, Shield, Flame, Wind, ShieldAlert } from 'lucide-react';

interface HUDProps {
  stats: any;
  leaderboard: any[];
  game: any;
  onLogout: () => void;
}

export const HUD: React.FC<HUDProps> = ({ stats, leaderboard, game, onLogout }) => {
  if (!stats) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeName = (mode: number) => {
    switch (mode) {
      case 0: return 'DEATHMATCH';
      case 1: return 'TEAM BATTLE';
      case 2: return 'SURVIVAL';
      case 3: return 'PRACTICE';
      default: return 'BATTLE';
    }
  };

  const getModeIcon = (mode: number) => {
    switch (mode) {
      case 0: return '⚔️';
      case 1: return '🛡️';
      case 2: return '💀';
      case 3: return '🎯';
      default: return '⚔️';
    }
  };

  const attackCooldown = Math.max(0, 1 - (Date.now() - (stats.lastAttack || 0)) / 1200);

  const now = Date.now();
  const getCooldown = (skillName: string, duration: number) => {
    const cd = stats.cooldowns?.[skillName] || 0;
    return Math.max(0, (cd - now) / duration);
  };

  const getBuffTime = (buffName: string) => {
    const time = stats.buffs?.[buffName] || 0;
    return Math.max(0, Math.ceil((time - now) / 1000));
  };

  const SkillIcon = ({ icon: Icon, label, keyHint, cooldown, color }: any) => (
    <div className="relative group">
      <div className={`p-2 border-2 transition-all ${cooldown > 0 ? 'border-white/10 text-white/20' : `border-${color}-500 text-${color}-500 shadow-[0_0_15px_rgba(var(--${color}-rgb),0.3)]`}`}>
        <Icon size={20} />
      </div>
      {cooldown > 0 && (
        <div 
          className="absolute inset-x-0 bottom-0 bg-black/60"
          style={{ height: `${cooldown * 100}%` }}
        />
      )}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 px-2 py-1 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        <p className="text-[8px] font-black uppercase tracking-widest">{label}</p>
      </div>
      <div className="mt-1 flex flex-col items-center gap-1">
        <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[8px] font-black border border-white/20">{keyHint}</kbd>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 pointer-events-none p-4 flex flex-col justify-between font-mono select-none text-white">
      {/* Top Center: Game Mode & Timer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <motion.div 
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="bg-black/80 border-x-4 border-b-4 border-white/20 px-12 py-2 flex flex-col items-center shadow-[0_0_20px_rgba(0,0,0,0.5)]"
        >
          <div className="flex items-center gap-4">
            <span className="text-xl">{getModeIcon(game.mode)}</span>
            <span className="text-xs font-black tracking-[0.3em] text-white/40">{getModeName(game.mode)}</span>
            <div className="w-1 h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <Timer size={16} className="text-orange-500" />
              <span className="text-2xl font-black tabular-nums">{formatTime(game.timer)}</span>
            </div>
          </div>
          {game.mode === 1 && (
            <div className="flex gap-8 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                <span className="text-sm font-black">{game.teamScores.red}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black">{game.teamScores.blue}</span>
                <div className="w-2 h-2 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Top Left: Player Stats */}
      <div className="flex justify-between items-start">
        <motion.div 
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          className="bg-black/80 border-4 border-white/10 p-4 min-w-[260px] backdrop-blur-sm"
        >
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-xl font-black tracking-tighter italic">{stats.username}</h2>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Level {stats.level} Operative</p>
            </div>
            <button 
              onClick={onLogout}
              className="text-[10px] font-black text-white/20 hover:text-red-500 transition-colors pointer-events-auto"
            >
              [ABORT]
            </button>
          </div>

          <div className="space-y-4">
            {/* HP Bar */}
            <div>
              <div className="flex justify-between text-[10px] font-black mb-1">
                <span>VITALITY</span>
                <span className={stats.health < 30 ? 'text-red-500 animate-pulse' : ''}>{Math.round(stats.health)}%</span>
              </div>
              <div className="h-2 bg-white/10 p-[2px] border border-white/20">
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: `${(stats.health / stats.maxHealth) * 100}%` }}
                  className={`h-full shadow-[0_0_10px_rgba(255,255,255,0.2)] ${stats.health < 30 ? 'bg-red-500' : 'bg-white'}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-2 border-l-2 border-orange-500">
                <p className="text-[9px] font-bold text-white/40 uppercase">Eliminations</p>
                <p className="text-xl font-black">{stats.kills}</p>
              </div>
              <div className="bg-white/5 p-2 border-l-2 border-white/20">
                <p className="text-[9px] font-bold text-white/40 uppercase">Deaths</p>
                <p className="text-xl font-black">{stats.deaths || 0}</p>
              </div>
            </div>

            {/* Active Buffs */}
            <div className="flex flex-wrap gap-2">
              {getBuffTime('speed') > 0 && (
                <div className="flex items-center gap-1 bg-cyan-500/20 px-2 py-1 border border-cyan-500/40">
                  <Wind size={10} className="text-cyan-400" />
                  <span className="text-[9px] font-black text-cyan-400">{getBuffTime('speed')}s</span>
                </div>
              )}
              {getBuffTime('damage') > 0 && (
                <div className="flex items-center gap-1 bg-orange-500/20 px-2 py-1 border border-orange-500/40">
                  <Flame size={10} className="text-orange-400" />
                  <span className="text-[9px] font-black text-orange-400">{getBuffTime('damage')}s</span>
                </div>
              )}
              {getBuffTime('shield') > 0 && (
                <div className="flex items-center gap-1 bg-blue-500/20 px-2 py-1 border border-blue-500/40">
                  <Shield size={10} className="text-blue-400" />
                  <span className="text-[9px] font-black text-blue-400">{getBuffTime('shield')}s</span>
                </div>
              )}
              {getBuffTime('rage') > 0 && (
                <div className="flex items-center gap-1 bg-red-500/20 px-2 py-1 border border-red-500/40">
                  <Flame size={10} className="text-red-400" />
                  <span className="text-[9px] font-black text-red-400">RAGE {getBuffTime('rage')}s</span>
                </div>
              )}
              {getBuffTime('guard') > 0 && (
                <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 border border-yellow-500/40">
                  <ShieldAlert size={10} className="text-yellow-400" />
                  <span className="text-[9px] font-black text-yellow-400">GUARD {getBuffTime('guard')}s</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Top Right: Leaderboard */}
        <motion.div 
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          className="bg-black/80 border-4 border-white/10 p-4 w-64 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
            <Trophy size={14} className="text-orange-500" />
            <h3 className="text-[10px] font-black tracking-widest uppercase">Leaderboard</h3>
          </div>
          <div className="space-y-1">
            {leaderboard.slice(0, 5).map((player, i) => (
              <div key={player.id} className={`flex justify-between items-center p-1 px-2 text-[11px] ${player.id === stats.id ? 'bg-orange-500/20 border-l-2 border-orange-500' : ''}`}>
                <div className="flex items-center gap-2 truncate">
                  <span className="opacity-30 font-bold">{i + 1}</span>
                  <span className="truncate font-black uppercase">{player.username}</span>
                </div>
                <span className="font-bold text-white/60">{player.kills}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Center: Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40">
        <div className="relative w-8 h-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-2 bg-white" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-2 bg-white" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-[2px] bg-white" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-[2px] bg-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-orange-500 rounded-full" />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-end">
        {/* Kill Feed */}
        <div className="w-64 space-y-1 mb-4">
          <AnimatePresence mode="popLayout">
            {game.killFeed?.map((kill: any, i: number) => (
              <motion.div 
                key={`${kill.attacker}-${kill.victim}-${kill.time}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-black/60 border-l-4 border-orange-500 p-2 text-[10px] font-bold flex items-center gap-2"
              >
                <span className="text-orange-500">{kill.attacker}</span>
                <Sword size={10} className="text-white/40" />
                <span className="text-white/80">{kill.victim}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom Center: Skills & Cooldowns */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 bg-black/80 border-4 border-white/10 p-3 backdrop-blur-sm">
            {/* Primary Attack */}
            <div className="relative group mr-4 pr-4 border-r border-white/10">
              <div className={`p-2 border-2 transition-all ${attackCooldown > 0 ? 'border-white/10 text-white/20' : 'border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'}`}>
                <Sword size={24} />
              </div>
              {attackCooldown > 0 && (
                <div 
                  className="absolute inset-x-0 bottom-0 bg-black/60"
                  style={{ height: `${attackCooldown * 100}%` }}
                />
              )}
              <div className="mt-1 flex flex-col items-center gap-1">
                <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[8px] font-black border border-white/20">SPACE</kbd>
              </div>
            </div>

            {/* Skills */}
            <SkillIcon 
              icon={Zap} 
              label="Dash" 
              keyHint="SHIFT" 
              cooldown={getCooldown('dash', 3000)} 
              color="cyan" 
            />
            <SkillIcon 
              icon={Sword} 
              label="Heavy Slash" 
              keyHint="Q" 
              cooldown={getCooldown('heavySlash', 8000)} 
              color="orange" 
            />
            <SkillIcon 
              icon={Shield} 
              label="Guard" 
              keyHint="E" 
              cooldown={getCooldown('guard', 12000)} 
              color="yellow" 
            />
            <SkillIcon 
              icon={Flame} 
              label="Rage" 
              keyHint="R" 
              cooldown={getCooldown('rage', 25000)} 
              color="red" 
            />
          </div>
        </div>

        {/* Bottom Right: Controls Hint */}
        <div className="bg-black/40 p-4 border-t-4 border-white/10 text-[10px] font-bold text-white/40">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <kbd className="bg-white/10 px-1.5 py-0.5 rounded border border-white/20">WASD</kbd>
              <span>MOVE</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="bg-white/10 px-1.5 py-0.5 rounded border border-white/20">SPACE</kbd>
              <span>ATTACK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

