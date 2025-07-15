import { Message } from 'ai';

export type Tool = {
  name: string;
  description?: string;
  parameters: {
    type?: string;
    properties?: Record<string, any>;
    required?: string[];
  };
}

export type Adjustment = {
  max_tokens: number;
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  tool_choice: "auto" | "none" | "required" | { "type": "tool", "toolName": string }
  stop_sequences: string[]
}

type Chat = {
  messages: Message[];
  system_message: string;
  model: string;
  adjustment: Adjustment
  tools: Tool[];
}

export interface ChatStore {
  chats: Record<string, Chat>;
  setMessages: ((messages: Message[] | ((messages: Message[]) => Message[])) => void) | null;
  createChat: () => string;
  saveChat: (id: string, messages: Message[]) => void;
  deleteChat: (id: string) => void;
  cleanEmptyChats: () => void;
  getChat: (id: string) => Message[];
}

export interface AppStore extends ChatStore {
  
} 

export enum SetMessageType {
  ADD,
  DELETE,
  CHANGE_ROLE,
  CHANGE_CONTENT,
}