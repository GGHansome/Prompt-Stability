"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Message } from 'ai';

// 定义状态类型
interface ChatState {
  [chatId: string]: Message[];
}

// 定义 Action 类型
type ChatAction =
  | { type: 'SET_MESSAGES'; chatId: string; messages: Message[] }
  | { type: 'ADD_MESSAGE'; chatId: string; message: Message }
  | { type: 'UPDATE_MESSAGE'; chatId: string; messageId: string; updates: Partial<Message> }
  | { type: 'DELETE_MESSAGE'; chatId: string; messageId: string }
  | { type: 'CLEAR_MESSAGES'; chatId: string };

// Reducer 函数
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_MESSAGES':
      return {
        ...state,
        [action.chatId]: action.messages,
      };
    
    case 'ADD_MESSAGE':
      return {
        ...state,
        [action.chatId]: [...(state[action.chatId] || []), action.message],
      };
    
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        [action.chatId]: (state[action.chatId] || []).map(msg =>
          msg.id === action.messageId ? { ...msg, ...action.updates } : msg
        ),
      };
    
    case 'DELETE_MESSAGE':
      return {
        ...state,
        [action.chatId]: (state[action.chatId] || []).filter(msg => msg.id !== action.messageId),
      };
    
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        [action.chatId]: [],
      };
    
    default:
      return state;
  }
};

// Context 类型定义
interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  // 便捷方法
  getMessages: (chatId: string) => Message[];
  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateMessage: (chatId: string, messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
  clearMessages: (chatId: string) => void;
}

// 创建 Context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider 组件
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, {});

  // 便捷方法
  const getMessages = (chatId: string) => state[chatId] || [];
  
  const setMessages = (chatId: string, messages: Message[]) => {
    dispatch({ type: 'SET_MESSAGES', chatId, messages });
  };
  
  const addMessage = (chatId: string, message: Message) => {
    dispatch({ type: 'ADD_MESSAGE', chatId, message });
  };
  
  const updateMessage = (chatId: string, messageId: string, updates: Partial<Message>) => {
    dispatch({ type: 'UPDATE_MESSAGE', chatId, messageId, updates });
  };
  
  const deleteMessage = (chatId: string, messageId: string) => {
    dispatch({ type: 'DELETE_MESSAGE', chatId, messageId });
  };
  
  const clearMessages = (chatId: string) => {
    dispatch({ type: 'CLEAR_MESSAGES', chatId });
  };

  const value: ChatContextType = {
    state,
    dispatch,
    getMessages,
    setMessages,
    addMessage,
    updateMessage,
    deleteMessage,
    clearMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// 自定义 Hook
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

// 针对特定聊天的 Hook
export const useChatMessages = (chatId: string) => {
  const { getMessages, setMessages, addMessage, updateMessage, deleteMessage, clearMessages } = useChatContext();
  
  return {
    messages: getMessages(chatId),
    setMessages: (messages: Message[]) => setMessages(chatId, messages),
    addMessage: (message: Message) => addMessage(chatId, message),
    updateMessage: (messageId: string, updates: Partial<Message>) => updateMessage(chatId, messageId, updates),
    deleteMessage: (messageId: string) => deleteMessage(chatId, messageId),
    clearMessages: () => clearMessages(chatId),
  };
}; 