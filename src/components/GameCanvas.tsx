import React, { useEffect, useRef, useState } from 'react';
import { GameClient } from '../game/GameClient';
import { Renderer } from '../game/Renderer';

interface GameCanvasProps {
  username: string;
  color: string;
  accessory: string;
  mode: number;
  bots: boolean;
  onStatsUpdate: (me: any) => void;
  onLeaderboardUpdate: (players: any[]) => void;
  onGameUpdate: (game: any) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ username, color, accessory, mode, bots, onStatsUpdate, onLeaderboardUpdate, onGameUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameClientRef = useRef<GameClient | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const inputsRef = useRef({ up: false, down: false, left: false, right: false });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    rendererRef.current = new Renderer(canvas);

    const handleResize = () => {
      if (rendererRef.current) {
        rendererRef.current.onResize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    let lastUIUpdate = 0;
    gameClientRef.current = new GameClient((data) => {
      const now = Date.now();
      if (now - lastUIUpdate > 50) { // 20 FPS UI updates
        const me = data.players[gameClientRef.current?.myId || ''];
        if (me) onStatsUpdate(me);
        if (data.game) onGameUpdate(data.game);

        const sortedPlayers = Object.values(data.players)
          .sort((a: any, b: any) => b.level - a.level || b.kills - a.kills)
          .slice(0, 10);
        onLeaderboardUpdate(sortedPlayers);
        lastUIUpdate = now;
      }
    });

    gameClientRef.current.join(username, color, accessory, mode, bots);

    // Render Loop
    let animationFrameId: number;
    const render = () => {
      if (rendererRef.current && gameClientRef.current) {
        rendererRef.current.render(
          gameClientRef.current.players,
          gameClientRef.current.interactables,
          gameClientRef.current.myId,
          gameClientRef.current.map
        );
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const prevInputs = { ...inputsRef.current };
      
      if (key === 'w' || key === 'arrowup') inputsRef.current.up = true;
      if (key === 's' || key === 'arrowdown') inputsRef.current.down = true;
      if (key === 'a' || key === 'arrowleft') inputsRef.current.left = true;
      if (key === 'd' || key === 'arrowright') inputsRef.current.right = true;
      if (key === ' ') gameClientRef.current?.attack();
      
      // Skills
      if (key === 'shift') gameClientRef.current?.useSkill('dash');
      if (key === 'q') gameClientRef.current?.useSkill('heavySlash');
      if (key === 'e') gameClientRef.current?.useSkill('guard');
      if (key === 'r') gameClientRef.current?.useSkill('rage');
      
      if (JSON.stringify(prevInputs) !== JSON.stringify(inputsRef.current)) {
        gameClientRef.current?.sendInput(inputsRef.current);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const prevInputs = { ...inputsRef.current };
      
      if (key === 'w' || key === 'arrowup') inputsRef.current.up = false;
      if (key === 's' || key === 'arrowdown') inputsRef.current.down = false;
      if (key === 'a' || key === 'arrowleft') inputsRef.current.left = false;
      if (key === 'd' || key === 'arrowright') inputsRef.current.right = false;
      
      if (JSON.stringify(prevInputs) !== JSON.stringify(inputsRef.current)) {
        gameClientRef.current?.sendInput(inputsRef.current);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
      gameClientRef.current?.socket.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 bg-gray-100 touch-none"
      id="game-canvas"
    />
  );
};
