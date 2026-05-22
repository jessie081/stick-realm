/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Auth } from './components/Auth';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';

export default function App() {
  const [authState, setAuthState] = useState<{ username: string; color: string; accessory: string; mode: number; bots: boolean } | null>(null);
  const [myStats, setMyStats] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [game, setGame] = useState<any>({ state: 0, mode: 0, timer: 0, killFeed: [] });

  const handleAuth = (username: string, color: string, accessory: string, mode: number, bots: boolean) => {
    setAuthState({ username, color, accessory, mode, bots });
  };

  const handleLogout = () => {
    setAuthState(null);
    setMyStats(null);
  };

  if (!authState) {
    return <Auth onAuth={handleAuth} />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      <GameCanvas 
        username={authState.username} 
        color={authState.color}
        accessory={authState.accessory}
        mode={authState.mode}
        bots={authState.bots}
        onStatsUpdate={setMyStats}
        onLeaderboardUpdate={setLeaderboard}
        onGameUpdate={setGame}
      />
      
      <HUD stats={myStats} leaderboard={leaderboard} game={game} onLogout={handleLogout} />

      {/* Game Over Overlay */}
      {game.state === 2 && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-black border-4 border-orange-500 p-12 text-center max-w-md w-full shadow-[0_0_50px_rgba(249,115,22,0.3)]"
          >
            <h1 className="text-5xl font-black text-white italic tracking-tighter mb-2">GAME OVER</h1>
            <div className="w-full h-1 bg-orange-500 mb-8" />
            <p className="text-xl font-bold text-white/60 uppercase tracking-widest mb-8">
              {game.winner || "Match Ended"}
            </p>
            <div className="bg-white/5 p-6 border border-white/10 mb-8">
              <p className="text-xs font-black text-white/40 uppercase mb-2">Next Match In</p>
              <p className="text-4xl font-black text-white tabular-nums">{game.timer}s</p>
            </div>
            <p className="text-[10px] font-bold text-white/20 uppercase">Preparing New Arena...</p>
          </motion.div>
        </div>
      )}

      {/* Lobby Overlay */}
      {game.state === 0 && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 backdrop-blur-sm pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-ping" />
              <h2 className="text-2xl font-black text-white italic tracking-tighter">WAITING FOR OPERATIVES</h2>
            </div>
            <p className="text-xs font-bold text-white/40 uppercase tracking-[0.5em]">Match Starting in {game.timer}s</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}

