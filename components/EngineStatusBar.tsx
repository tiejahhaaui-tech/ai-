
import React from 'react';
import { AIModelEngine, AIModelStatus } from '../types';

interface EngineStatusBarProps {
  engines: AIModelEngine[];
  activeEngineId: string | null;
}

const EngineStatusBar: React.FC<EngineStatusBarProps> = ({ engines, activeEngineId }) => {
  const getStatusColor = (status: AIModelStatus, isActive: boolean) => {
    if (isActive) return 'bg-blue-400 shadow-[0_0_8px_#60a5fa] ring-1 ring-blue-300';
    switch (status) {
      case AIModelStatus.SYNCED: return 'bg-emerald-500 shadow-[0_0_5px_#10b981] opacity-80';
      case AIModelStatus.PROCESSING: return 'bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]';
      case AIModelStatus.FAILED: return 'bg-red-500 shadow-[0_0_10px_#ef4444]';
      case AIModelStatus.OFFLINE: return 'bg-slate-700';
      default: return 'bg-slate-800';
    }
  };

  const healthyCount = engines.filter(e => e.status === AIModelStatus.SYNCED).length;

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-3 flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md mb-8">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.2em]">晶格矩阵状态</span>
          <span className="text-[10px] font-bold text-emerald-400 font-mono">{healthyCount}/14 稳定运行中</span>
        </div>
        <div className="h-6 w-px bg-white/10 mx-2"></div>
        <div className="flex gap-1.5">
          {engines.map((engine) => (
            <div
              key={engine.id}
              title={`${engine.name} (${engine.provider})\n状态: ${engine.status}\n负载: ${Math.floor(engine.load)}%`}
              className={`w-2.5 h-2.5 rounded-sm transition-all duration-500 cursor-help ${getStatusColor(engine.status, activeEngineId === engine.id)}`}
            />
          ))}
        </div>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.2em]">活动流水线</span>
          <span className="text-[10px] font-bold text-blue-400 font-mono uppercase tracking-tighter">
            {activeEngineId ? engines.find(e => e.id === activeEngineId)?.name : '待机中 (STANDBY)'}
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[9px] font-mono text-slate-400 tracking-tighter uppercase">全局同步激活</span>
        </div>
      </div>
    </div>
  );
};

export default EngineStatusBar;
