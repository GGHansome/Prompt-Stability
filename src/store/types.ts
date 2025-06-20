import { Message } from 'ai';

type Chat = {
  messages: Message[];
  system_message: string;
  model: string;
  adjustment: {
    response_format: 'text' | 'json_object';
    max_tokens: number;
    temperature: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
  }
  tools: string[];
}

export interface ChatStore {
  chats: Record<string, Chat>;
  createChat: () => string;
  saveChat: (id: string, messages: Message[]) => void;
  deleteChat: (id: string) => void;
  cleanEmptyChats: () => void;
  getChat: (id: string) => Message[];
}

export interface AppStore extends ChatStore {
  
} 