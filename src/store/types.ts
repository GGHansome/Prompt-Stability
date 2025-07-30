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

export type MultipleResponseMessage = {
  response: string,
  reason: string,
  similarity: number,
}

type Chat = {
  title: string;
  messages: Message[];
  custom_messages: Message[];
  system_message: string;
  model: string;
  createdAt: Date;
  adjustment: Adjustment
  multiple_test: {
    expected_response: string;
    test_number: number;
    multiple_response_messages: MultipleResponseMessage[];
  }
  optimization: {
    suggest: string,
    example: string,
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
  hasHydrated: boolean;
  changeChatLoading: boolean;
}

export enum SetMessageType {
  ADD,
  DELETE,
  CHANGE_ROLE,
  CHANGE_CONTENT,
}

// interface MessageTable {
//   id: string;
//   chat_id: string;
//   message_type: 'normal' | 'multiple_response';  // 只区分这两种
//   message: Message;
//   order_index: number;
//   created_at: Date;
// }

// interface ChatConfigTable {
//   id: string;                    // 主键
//   system_message: string;
//   model: string;
//   created_at: Date;
//   updated_at: Date;
//   // adjustment 配置
//   adjustment: Adjustment;
//   // multiple_test 配置
//   multiple_test: {
//     expected_response: string;
//     test_number: number;
//   };
//   // optimization 配置
//   optimization: {
//     suggest: string;
//     example: string;
//   };
//   // tools 配置
//   tools: Tool[];
//   // custom_messages 作为配置的一部分
//   custom_messages: Message[];
// }