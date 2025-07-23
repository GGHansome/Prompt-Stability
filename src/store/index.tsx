import { create } from "zustand";
import { persist, devtools, createJSONStorage, StateStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { chatSlice } from "./chat";
import { useShallow } from "zustand/shallow";
import { AppStore } from "./types";
import { get, set, del } from 'idb-keyval';

const idbStorage:StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

// 创建 Zustand store
export const useAppStore = create<AppStore>()(
  devtools(
      persist(
        immer(
          (...args) => ({
            ...chatSlice(...args),
          }),
        ),
        {
          name: "all-chats", // 使用原来的存储键名
          // 只持久化 chats 状态
          partialize: (state) => ({ chats: state.chats }),
          storage: createJSONStorage(() => idbStorage),
        }
      ),
    { name: "chat-store" }
  )
);

export const useStore = <T,>(fn: (state: AppStore) => T): T =>
  useAppStore(useShallow(fn));
