
import React from 'react';
import { AIModelEngine, AIModelStatus } from '../types';

interface ModelGridProps {
  engines: AIModelEngine[];
  onUpdateEngine: (id: string, updates: Partial<AIModelEngine>) => void;
}

const getStatusColor = (status: AIModelStatus) => {
  switch (status) {
    case AIModelStatus.SYNCED: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-[0_0_5px_rgba(16,185,129,0.1)]';
    case AIModelStatus.PROCESSING: return 'text-blue-400 bg-blue-400/10 border-blue-400/20 animate-pulse';
    case AIModelStatus.FAILED: return 'text-red-500 bg-red-500/10 border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]';
    case AIModelStatus.IDLE: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    default: return 'text-slate-400 bg-slate-800 border-slate-700';
  }
};

const ModelGrid: React.FC<ModelGridProps> = ({ engines, onUpdateEngine }) => {
  // Sort by weight to show hierarchy
  const sortedEngines = [...engines].sort((a, b) => b.weight - a.weight);

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-[9px] font-bold text-slate-500 tracking-[0.4em] uppercase">分步逻辑节点</h2>
        <span className="text-[8px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">14 NODES ACTIVE</span>
      </div>
      
      <div className="grid grid-cols-1 gap-2.5">
        {sortedEngines.map((engine) => (
          <div 
            key={engine.id} 
            className={`p-3 border rounded-2xl transition-all duration-500 relative group overflow-hidden ${
              engine.status === AIModelStatus.PROCESSING 
                ? 'bg-blue-500/10 border-blue-500/40 scale-[1.02] shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                : engine.status === AIModelStatus.FAILED
                ? 'bg-red-500/5 border-red-500/20 grayscale'
                : 'bg-white/[0.02] border-white/5 hover:border-white/10'
            }`}
          >
            {/* Background Accent */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/[0.01] to-transparent`}></div>

            <div className="flex justify-between items-center mb-2 relative z-10">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold tracking-tight transition-colors ${engine.status === AIModelStatus.FAILED ? 'text-red-400/50' : 'text-slate-200'}`}>
                  {engine.name}
                </span>
                <span className="text-[7px] px-1.5 py-0.5 bg-white/5 text-white/30 rounded-md border border-white/5 font-mono">
                  PRIO: {engine.weight}
                </span>
              </div>
              <div className={`text-[7px] px-2 py-0.5 rounded-full font-mono uppercase border transition-all duration-300 ${getStatusColor(engine.status)}`}>
                {engine.status === AIModelStatus.SYNCED ? '稳定' : 
                 engine.status === AIModelStatus.PROCESSING ? '处理中' : 
                 engine.status === AIModelStatus.FAILED ? '链路断开' : '待机'}
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5 relative z-10">
              <div className="flex items-center justify-between text-[8px] font-mono text-slate-500">
                <span className="uppercase tracking-widest">{engine.provider}</span>
                <div className="flex gap-2 items-center">
                  <span className={engine.load > 80 ? 'text-red-400' : ''}>{Math.floor(engine.load)}% LOAD</span>
                </div>
              </div>
              <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${
                    engine.status === AIModelStatus.FAILED ? 'bg-red-500' : 
                    engine.load > 80 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 
                    'bg-indigo-500/60 shadow-[0_0_8px_rgba(79,70,229,0.5)]'
                  }`} 
                  style={{ width: `${engine.load}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelGrid;
