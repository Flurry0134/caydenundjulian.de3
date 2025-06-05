export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  avatarUrl?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  citations?: Citation[];
}

export interface Citation {
  id: string;
  text: string;
  source: string;
  url?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
  chatSessionId?: string;
}

export interface ThemeConfig {
  primaryColor: string;
  roundedCorners: boolean;
  logoUrl: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';