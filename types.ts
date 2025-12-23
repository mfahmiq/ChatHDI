
export type Role = 'user' | 'assistant';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  type?: 'text' | 'image' | 'video' | 'pptx';
  mediaUrl?: string;
  groundingSources?: GroundingSource[];
  searchEntryPoint?: string; // HTML from Google Search
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

export interface ModalState {
  type: 'none' | 'pptx' | 'image' | 'video' | 'clearHistory' | 'settings' | 'database';
}
