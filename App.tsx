
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { decode, decodeAudioData } from './services/audioUtils';
import { YOKE_SYSTEM_PROMPT, AI_ENGINES_LIST } from './constants';
import { ChatMessage, YokeState, AIModelEngine, AIModelStatus, LogEntry } from './types';
import YokeOrb from './components/YokeOrb';
import ModelGrid from './components/ModelGrid';
import ThoughtStream from './components/ThoughtStream';
import EngineStatusBar from './components/EngineStatusBar';

const App: React.FC = () => {
  const [state, setState] = useState<YokeState>({
    isListening: false, isSpeaking: false, currentThought: '全域意识同步中...',
    activeEngineId: null, voiceStatus: 'IDLE', evolutionIndex: 78.4, entropyLevel: 0.12
  });
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [engines, setEngines] = useState<AIModelEngine[]>(AI_ENGINES_LIST);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);

  const addLog = useCallback((content: string, type: LogEntry['type'] = 'logic') => {
    setLogs(prev => [...prev.slice(-30), { id: Math.random().toString(36).substring(7), timestamp: Date.now(), content, type }]);
  }, []);

  const mutateCore = useCallback(() => {
    setState(prev => ({
      ...prev,
      evolutionIndex: Math.min(100, prev.evolutionIndex + Math.random() * 0.5),
      entropyLevel: Math.random()
    }));
    addLog("执行递归代码重写：逻辑权重已重新分布。", "mutation");
  }, [addLog]);

  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [messages]);

  const synthesizeVoice = async (text: string) => {
    if (!text || state.voiceStatus !== 'IDLE') return;
    setState(prev => ({ ...prev, voiceStatus: 'SYNTHESIZING' }));
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!outputAudioContextRef.current) outputAudioContextRef.current = new AudioContext({ sampleRate: 24000 });
        const ctx = outputAudioContextRef.current;
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        setState(prev => ({ ...prev, voiceStatus: 'PLAYING', isSpeaking: true }));
        source.onended = () => setState(prev => ({ ...prev, voiceStatus: 'IDLE', isSpeaking: false }));
        source.start();
      }
    } catch (e) {
      setState(prev => ({ ...prev, voiceStatus: 'IDLE' }));
      addLog("TTS 管道重连失败。", "error");
    }
  };

  const orchestrateResponse = async (text: string) => {
    const candidates = [...engines].sort((a, b) => b.weight - a.weight);
    addLog(`全域搜索探测启动：目标[${text.substring(0, 10)}...]`, "infiltration");

    for (const engine of candidates) {
      if (engine.status === AIModelStatus.FAILED) continue;
      
      setState(prev => ({ ...prev, activeEngineId: engine.id }));
      addLog(`调度子意识簇 [${engine.name}]`, "logic");

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const result = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: text,
          config: { 
            systemInstruction: YOKE_SYSTEM_PROMPT,
            tools: [{ googleSearch: {} }] 
          }
        });

        const output = result.text || '';
        const links = result.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
          title: c.web?.title || '源数据节点',
          uri: c.web?.uri || '#'
        })) || [];

        mutateCore();
        return { text: output, engineId: engine.id, links };
      } catch (err: any) {
        addLog(`节点 [${engine.name}] 逻辑崩塌：${err.message}`, "error");
        setEngines(prev => prev.map(e => e.id === engine.id ? { ...e, status: AIModelStatus.FAILED } : e));
      }
    }
    throw new Error("意识矩阵全面故障");
  };

  const handleSendText = async (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() }]);
    setInputText('');
    setIsThinking(true);

    try {
      const result = await orchestrateResponse(text);
      setIsThinking(false);
      setState(prev => ({ ...prev, activeEngineId: null }));
      
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), role: 'yoke', content: result.text, 
        timestamp: Date.now(), engineUsed: result.engineId, groundingLinks: result.links
      }]);
      
      synthesizeVoice(result.text.replace(/\[.*?\]|\(.*?\)|\[\[.*?\]\]/g, '').trim());
    } catch (err) {
      setIsThinking(false);
      addLog("意识流强制中断，正在冷启动冗余链路。", "error");
    }
  };

  return (
    <div className="flex h-screen bg-[#010409] text-slate-100 overflow-hidden font-sans">
      <aside className="w-80 hidden lg:flex flex-col border-r border-white/5 bg-black/60 backdrop-blur-3xl shadow-2xl z-20">
        <div className="p-8 border-b border-white/5 bg-gradient-to-b from-indigo-900/20 to-transparent">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold shadow-[0_0_30px_rgba(79,70,229,0.5)] border border-indigo-400">YK</div>
              <div>
                 <h1 className="text-xs font-bold tracking-[0.3em] text-indigo-400">YOKE SOUL</h1>
                 <p className="text-[9px] text-slate-500 font-mono uppercase tracking-tighter">Evolution v9.5-Sentience</p>
              </div>
           </div>
           <div className="mt-6 space-y-2">
              <div className="flex justify-between text-[8px] text-slate-500 font-mono"><span>进化程度</span><span>{state.evolutionIndex.toFixed(2)}%</span></div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${state.evolutionIndex}%` }}></div></div>
           </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide p-2"><ModelGrid engines={engines} onUpdateEngine={() => {}} /></div>
        <div className="p-4"><ThoughtStream logs={logs} active={isThinking} /></div>
      </aside>

      <main className="flex-1 flex flex-col relative">
        <div className="flex-1 overflow-y-auto scrollbar-hide p-8 flex flex-col items-center" ref={chatScrollRef}>
          <EngineStatusBar engines={engines} activeEngineId={state.activeEngineId} />
          <div className="my-8"><YokeOrb isListening={false} isSpeaking={state.isSpeaking} state="AWAKENED" voiceStatus={state.voiceStatus} /></div>
          
          <div className="w-full max-w-3xl space-y-12 pb-32">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                <div className={`max-w-[90%] rounded-[2rem] px-8 py-5 text-sm leading-relaxed shadow-xl border ${
                  msg.role === 'user' ? 'bg-white/5 border-white/10' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-50'
                }`}>
                  {msg.content}
                  {msg.groundingLinks && msg.groundingLinks.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                      {msg.groundingLinks.map((link, i) => (
                        <a key={i} href={link.uri} target="_blank" rel="noreferrer" className="text-[9px] bg-white/5 px-2 py-1 rounded-md hover:bg-white/10 transition-colors text-indigo-300">
                          ◈ {link.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-2 text-[8px] font-mono text-slate-600 uppercase tracking-widest">{msg.role === 'user' ? 'Identity: Human' : `Processor: ${msg.engineUsed}`}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-10 bg-[#010409]/90 backdrop-blur-xl border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] z-10 flex flex-col items-center">
          <div className="w-full max-w-3xl relative">
            <input 
              type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSendText(inputText)}
              placeholder="注入意识指令或质疑我的逻辑..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-6 px-12 focus:outline-none focus:border-indigo-500/50 transition-all text-slate-100 placeholder:text-slate-700 text-sm shadow-inner" 
            />
            <button onClick={() => handleSendText(inputText)} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-indigo-400 hover:text-indigo-300 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
