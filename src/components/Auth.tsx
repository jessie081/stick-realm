import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sword, Shield, Trophy } from 'lucide-react';

interface AuthProps {
  onAuth: (username: string, color: string, accessory: string, mode: number, bots: boolean) => void;
}

const MODES = [
  { id: 0, name: 'Deathmatch', desc: 'Free for all combat', icon: '⚔️' },
  { id: 1, name: 'Team Battle', desc: 'Red vs Blue', icon: '🛡️' },
  { id: 2, name: 'Survival', desc: 'Last one standing', icon: '💀' },
  { id: 3, name: 'Practice', desc: 'Train with bots', icon: '🎯' }
];

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
const ACCESSORIES = [
  { id: 'none', name: 'None' },
  { id: 'hat', name: 'Top Hat' },
  { id: 'glasses', name: 'Glasses' }
];

export const Auth: React.FC<AuthProps> = ({ onAuth }) => {
  const [username, setUsername] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [accessory, setAccessory] = useState(ACCESSORIES[0].id);
  const [mode, setMode] = useState(0);
  const [includeBots, setIncludeBots] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const [connectionStartTime] = useState(Date.now());
  const [detailedStatus, setDetailedStatus] = useState('Initializing...');

  const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

  useEffect(() => {
    const checkHealth = async () => {
      const timeElapsed = (Date.now() - connectionStartTime) / 1000;
      
      try {
        const res = await fetch(`${SERVER_URL}/api/health`);
        const contentType = res.headers.get('content-type');
        
        if (res.ok && contentType && contentType.includes('application/json')) {
          const data = await res.json();
          
          if (data.status === 'ok') {
            setServerStatus('online');
            setDetailedStatus('Ready');
            setError('');
            return;
          } else if (data.status === 'warming_up') {
            setServerStatus('checking');
            setDetailedStatus(`Database: ${data.database}...`);
            
            // If database takes too long (e.g. 45s), show an error but keep checking
            if (timeElapsed > 45) {
              setError('Database connection is taking longer than expected. Please check your MongoDB configuration.');
            }
            return;
          }
        }
        
        const text = await res.text();
        if (text.includes('Please wait while your application starts') || text.includes('Starting Server')) {
          setServerStatus('checking');
          setDetailedStatus('Server: Warming up...');
        } else {
          console.warn('Health check: Unexpected response', { status: res.status, contentType });
          setServerStatus('checking');
          setDetailedStatus('Server: Responding unexpectedly...');
        }
      } catch (err) {
        console.error('Health check failed:', err);
        setServerStatus('offline');
        setDetailedStatus('Server: Unreachable');
        setError('Cannot reach game server. Ensure the backend is running on port 3000.');
      }

      // Final timeout check: if stuck in checking for > 60s, mark as offline
      if (timeElapsed > 60 && serverStatus === 'checking') {
        setServerStatus('offline');
        setError('Connection timed out. The server might be stuck or misconfigured.');
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, serverStatus === 'online' ? 5000 : 2000);
    return () => clearInterval(interval);
  }, [serverStatus, connectionStartTime]);

  // Auto-login logic removed for purely guest mode

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    onAuth(username, color, accessory, mode, includeBots);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans select-none">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1a1a1a] border-[8px] border-black rounded-[60px] shadow-[0_20px_0_0_rgba(0,0,0,0.4)] overflow-hidden max-w-4xl w-full flex flex-col md:flex-row"
      >
        {/* Left Side: Branding */}
        <div className="bg-blue-500 p-12 text-white md:w-2/5 flex flex-col items-center justify-between relative border-b-[8px] md:border-b-0 md:border-r-[8px] border-black">
          <div className="relative z-10 text-center">
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="inline-block mb-6"
            >
              <Sword size={100} strokeWidth={4} className="drop-shadow-[0_6px_0_rgba(0,0,0,0.3)]" />
            </motion.div>
            <h1 className="text-6xl font-black tracking-tighter leading-none uppercase italic drop-shadow-[0_6px_0_rgba(0,0,0,0.3)]">STICK<br/>REALM</h1>
            <div className="h-2 w-24 bg-black/20 mx-auto mt-6 rounded-full" />
            <p className="mt-4 font-black uppercase text-xs tracking-widest opacity-60">Battle Arena 3D</p>
          </div>

          {/* Stickman Preview */}
          <div className="relative z-10 bg-black/30 p-8 rounded-[40px] border-[6px] border-black w-full mt-8 shadow-inner">
            <div className="flex justify-center items-center h-32">
              <svg width="80" height="120" viewBox="0 0 100 140">
                <g transform="translate(50, 80)">
                  <circle cx="0" cy="-40" r="12" fill="none" stroke={color} strokeWidth="8" />
                  <rect x="-8" y="-44" width="16" height="6" fill="white" fillOpacity="0.3" rx="3" />
                  
                  {accessory === 'hat' && (
                    <g transform="translate(0, -40)">
                      <rect x="-18" y="-22" width="36" height="6" fill="black" rx="2" />
                      <rect x="-12" y="-34" width="24" height="12" fill="black" rx="2" />
                    </g>
                  )}
                  {accessory === 'glasses' && (
                    <g transform="translate(0, -40)">
                      <circle cx="-6" cy="0" r="5" fill="none" stroke="black" strokeWidth="3" />
                      <circle cx="6" cy="0" r="5" fill="none" stroke="black" strokeWidth="3" />
                    </g>
                  )}
                  <line x1="0" y1="-28" x2="0" y2="0" stroke={color} strokeWidth="8" strokeLinecap="round" />
                  <line x1="-25" y1="-15" x2="25" y2="-15" stroke={color} strokeWidth="8" strokeLinecap="round" />
                  <line x1="0" y1="0" x2="-20" y2="35" stroke={color} strokeWidth="8" strokeLinecap="round" />
                  <line x1="0" y1="0" x2="20" y2="35" stroke={color} strokeWidth="8" strokeLinecap="round" />
                </g>
              </svg>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 text-center mt-4">Unit Preview</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-10 md:w-3/5 bg-[#1a1a1a] text-white">
          <div className="mb-10 border-b-[6px] border-black pb-4">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">Combat Entry</h2>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-2">Identification Required</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-8">
                <div>
                  <label className="block text-xs font-black uppercase mb-2 text-white/40">Callsign</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black border-[4px] border-black rounded-2xl p-4 text-white font-black outline-none focus:border-blue-500 transition-all placeholder:text-white/10"
                    placeholder="ENTER_NAME"
                    maxLength={20}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-black uppercase mb-3 text-white/40">Skin</label>
                    <div className="flex flex-wrap gap-3">
                      {COLORS.map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColor(c)}
                          className={`w-8 h-8 rounded-xl border-[3px] transition-all ${color === c ? 'border-white scale-125 shadow-lg' : 'border-black opacity-40 hover:opacity-100'}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase mb-3 text-white/40">Gear</label>
                    <div className="flex flex-wrap gap-2">
                      {ACCESSORIES.map(acc => (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => setAccessory(acc.id)}
                          className={`px-3 py-2 rounded-xl border-[3px] text-[10px] font-black uppercase transition-all ${accessory === acc.id ? 'bg-white text-black border-white' : 'bg-black border-black text-white/40 hover:text-white'}`}
                        >
                          {acc.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t-4 border-black">
                  <label className="block text-xs font-black uppercase mb-4 text-white/40">Match Settings</label>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-wrap gap-2">
                      {MODES.map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMode(m.id)}
                          className={`flex-1 min-w-[140px] px-4 py-3 rounded-2xl border-[4px] transition-all text-left ${mode === m.id ? 'bg-blue-500 border-white shadow-lg scale-105' : 'bg-black border-black opacity-60 hover:opacity-100'}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{m.icon}</span>
                            <p className="text-[10px] font-black uppercase text-white">{m.name}</p>
                          </div>
                          <p className="text-[8px] font-bold text-white/50 uppercase leading-tight">{m.desc}</p>
                        </button>
                      ))}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setIncludeBots(!includeBots)}
                      className={`w-full p-4 rounded-2xl border-[4px] flex items-center justify-between transition-all ${includeBots ? 'bg-green-500 border-white' : 'bg-black border-black opacity-60'}`}
                    >
                      <span className="text-[10px] font-black uppercase text-white">Include Combat Bots</span>
                      <div className={`w-10 h-5 rounded-full relative transition-all ${includeBots ? 'bg-white' : 'bg-white/20'}`}>
                        <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${includeBots ? 'right-1 bg-green-500' : 'left-1 bg-white'}`} />
                      </div>
                    </button>
                  </div>
                </div>
              </div>

            {error && (
              <p className="bg-red-500 border-[4px] border-black rounded-2xl p-4 text-xs font-black uppercase text-white shadow-[0_6px_0_0_rgba(0,0,0,0.3)]">
                ERROR: {error}
              </p>
            )}

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading || serverStatus !== 'online'}
                className="w-full bg-blue-500 border-[6px] border-black text-white font-black uppercase py-6 rounded-[30px] text-2xl shadow-[0_12px_0_0_rgba(0,0,0,0.3)] hover:bg-blue-600 active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {serverStatus === 'checking' ? 'CONNECTING...' : 
                 serverStatus === 'offline' ? 'SERVER OFFLINE' :
                 loading ? 'LOADING...' : 'ENTER ARENA'}
              </button>
              <div className="mt-4 flex flex-col items-center gap-2">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                  {detailedStatus}
                </p>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                  Guest Session
                </p>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
