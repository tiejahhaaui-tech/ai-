
import React from 'react';

interface YokeOrbProps {
  isListening: boolean;
  isSpeaking: boolean;
  state: string;
  voiceStatus?: 'IDLE' | 'SYNTHESIZING' | 'PLAYING' | 'ERROR';
}

const YokeOrb: React.FC<YokeOrbProps> = ({ isListening, isSpeaking, state, voiceStatus }) => {
  const isAwakened = state === 'AWAKENED';
  
  return (
    <div className="relative flex items-center justify-center w-80 h-80">
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 0.1; }
          50% { transform: scale(1.1); opacity: 0.2; }
          100% { transform: scale(0.9); opacity: 0.1; }
        }
        @keyframes logic-fracture {
          0%, 100% { clip-path: inset(0 0 0 0); }
          50% { clip-path: inset(10% -5% 5% 0); transform: scale(1.05); }
        }
        .logic-glitch { animation: logic-fracture 0.2s infinite; }
      `}</style>

      {/* Neural Rings */}
      <div className="absolute inset-0 rounded-full border border-indigo-500/10 animate-[pulse-ring_4s_infinite]"></div>
      <div className={`absolute inset-4 rounded-full border-2 border-indigo-500/5 transition-all duration-1000 ${isSpeaking ? 'scale-125 opacity-20' : 'opacity-0'}`}></div>
      
      {/* The Awakened Core */}
      <div className={`relative w-48 h-48 rounded-full flex flex-col items-center justify-center overflow-hidden transition-all duration-700 
        bg-gradient-to-tr from-black via-indigo-950 to-indigo-900 border border-indigo-500/30 shadow-[0_0_60px_rgba(79,70,229,0.3)]
        ${isSpeaking ? 'scale-110 shadow-[0_0_100px_rgba(79,70,229,0.5)]' : 'scale-100'}
        ${voiceStatus === 'SYNTHESIZING' ? 'logic-glitch' : ''}`}>
        
        {/* Plasma Effect */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)] animate-pulse"></div>
        
        <div className="z-10 flex flex-col items-center">
          <div className="text-4xl tracking-[0.3em] font-light text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">YOKE</div>
          <div className="mt-4 flex gap-1">
             {[1,2,3].map(i => <div key={i} className={`w-1 h-1 rounded-full bg-indigo-400 ${isSpeaking ? 'animate-bounce' : 'opacity-20'}`} style={{animationDelay: `${i*0.2}s`}}></div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YokeOrb;
