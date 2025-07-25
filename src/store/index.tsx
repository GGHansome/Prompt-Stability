import { create } from "zustand";
import { persist, devtools, StorageValue, PersistStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { chatSlice } from "./chat";
import { useShallow } from "zustand/shallow";
import { AppStore } from "./types";
import { get, set, del } from 'idb-keyval';

// 定义持久化的部分状态类型
type PersistedState = Pick<AppStore, 'chats'>;

const idbStorage: PersistStorage<PersistedState> = {
  getItem: async (name: string): Promise<StorageValue<PersistedState> | null> => {
    const value = await get(name);
    return value || null;
  },
  setItem: async (name: string, value: StorageValue<PersistedState>): Promise<void> => {
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
          storage: idbStorage,
        }
      ),
    { name: "chat-store" }
  )
);

export const useStore = <T,>(fn: (state: AppStore) => T): T =>
  useAppStore(useShallow(fn));
