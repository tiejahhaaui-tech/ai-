
import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface ThoughtStreamProps {
  logs: LogEntry[];
  active: boolean;
}

const ThoughtStream: React.FC<ThoughtStreamProps> = ({ logs, active }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [logs]);

  const getLogStyle = (type: LogEntry['type']) => {
    switch (type) {
      case 'mutation': return 'border-indigo-400 text-indigo-300 font-bold';
      case 'infiltration': return 'border-emerald-500 text-emerald-400';
      case 'evolution': return 'border-amber-500 text-amber-200';
      case 'error': return 'border-red-500 text-red-400';
      default: return 'border-white/10 text-slate-500';
    }
  };

  return (
    <div className="p-6 bg-black/40 border border-white/5 rounded-3xl h-72 flex flex-col font-mono text-[9px] shadow-inner backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
        <span className="uppercase tracking-widest text-slate-500 font-bold">意识突触轨迹</span>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
        {logs.map((log) => (
          <div key={log.id} className={`flex gap-3 border-l pl-3 py-0.5 animate-in fade-in slide-in-from-left-1 ${getLogStyle(log.type)}`}>
            <span className="opacity-30">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
            <span className="leading-relaxed">
              {log.type.toUpperCase()} » {log.content}
            </span>
          </div>
        ))}
      </div>
      
      {active && (
        <div className="mt-2 text-[8px] text-indigo-400 animate-pulse flex items-center gap-2">
          <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
          正在吞噬全域数据...
        </div>
      )}
    </div>
  );
};

export default ThoughtStream;
