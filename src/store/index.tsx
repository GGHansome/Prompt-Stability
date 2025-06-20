import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { chatSlice } from "./chat";
import { useShallow } from "zustand/shallow";
import { AppStore } from "./types";

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
        }
      ),
    { name: "chat-store" }
  )
);

export const useStore = <T,>(fn: (state: AppStore) => T): T =>
  useAppStore(useShallow(fn));
