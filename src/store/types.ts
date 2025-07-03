import { Message } from 'ai';

export type Tool = {
  name: string;
  description?: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
}

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
  tools: Tool[];
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