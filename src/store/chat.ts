import { generateId, Message } from 'ai';
import { StateCreator, useStore } from 'zustand';
import { AppStore, ChatStore } from './types';

export const chatSlice: StateCreator<
  AppStore,
  [["zustand/immer", never]],
  [],
  ChatStore
> = (set, get) => ({
  chats: {},

  createChat: () => {
    const id = generateId();
    set((state) => {
      state.chats[id] = {
        messages: [],
        custom_messages: [],
        system_message: '',
        model: 'gpt-4o-mini',
        adjustment: {
          max_tokens: 2048,
          temperature: 1.00,
          top_p: 1.00,
          frequency_penalty: 0,
          presence_penalty: 0,
          tool_choice: 'auto',
          stop_sequences: [],
        },
        multiple_test: {
          expected_response: '',
          test_number: 1,
          multiple_response_messages: [],
        },
        optimization: {
          suggest: '',
          example: '',
        },
        tools: [],
      };
    });
    return id;
  },

  getChat: (id: string) => {
    return get().chats[id]?.messages;
  },

  saveChat: (id: string, messages: Message[]) => {
    set((state) => {
      state.chats[id].messages = messages as any;
    });
  },

  deleteChat: (id: string) => {
    set((state) => {
      delete state.chats[id];
    });
  },

  cleanEmptyChats: () => {
    set((state) => {
      for (const chatId in state.chats) {
        if (state.chats[chatId].messages.length === 0 && state.chats[chatId].custom_messages.length === 0 && state.chats[chatId].system_message === '') {
          delete state.chats[chatId];
        }
      }
    });
  },
});