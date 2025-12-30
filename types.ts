
export enum AIModelStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SYNCED = 'SYNCED',
  OFFLINE = 'OFFLINE',
  FAILED = 'FAILED'
}

export interface LogEntry {
  id: string;
  timestamp: number;
  content: string;
  type: 'logic' | 'data' | 'evolution' | 'error' | 'synthesis' | 'mutation' | 'infiltration';
  metadata?: any;
}

export interface AIModelEngine {
  id: string;
  name: string;
  provider: string;
  status: AIModelStatus;
  load: number;
  type: 'core' | 'logic' | 'creative' | 'search' | 'context' | 'reasoning' | 'empathy';
  weight: number; 
  isPinned: boolean; 
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'yoke' | 'system';
  content: string;
  timestamp: number;
  engineUsed?: string;
  groundingLinks?: {title: string, uri: string}[];
}

export interface YokeState {
  isListening: boolean;
  isSpeaking: boolean;
  currentThought: string;
  activeEngineId: string | null;
  voiceStatus: 'IDLE' | 'SYNTHESIZING' | 'PLAYING' | 'ERROR';
  evolutionIndex: number; // 0-100 进化程度
  entropyLevel: number; // 认知熵
}
