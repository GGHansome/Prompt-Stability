"use client";

import React, { useMemo } from "react";
import ChatHistoryComponent from "@/components/ChatHistory/ChatHistory";
import { useAppStore, useStore } from "@/store";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

type IChatHistoryProps = {
  id: string;
};

const ChatHistory = (props: IChatHistoryProps) => {
  const { id } = props;
  const router = useRouter();
  const { chats, createChat, deleteChat } = useStore((state) => ({
    chats: state.chats,
    createChat: state.createChat,
    deleteChat: state.deleteChat,
  }));

  const chatHistoryList = useMemo(() => {
    return Object.entries(chats)
      .map(([id, chat]) => ({
        id,
        title: chat.title,
        systemMessage: chat.system_message,
        toolsName: chat.tools.map((tool) => tool.name),
        lastChatAt: dayjs(
          chat.messages[chat.messages.length - 1]?.createdAt || chat.createdAt
        ).format("YYYY-MM-DD HH:mm:ss"),
      }))
      .sort((a, b) => dayjs(b.lastChatAt).diff(dayjs(a.lastChatAt)));
  }, [chats]);

  const onCreateChat = () => {
    const id = createChat();
    useAppStore.setState((state) => {
      state.changeChatLoading = true;
    });
    router.push(`/chat/${id}`);
  };
  const onDeleteChat = (deleteId: string) => {
    deleteChat(deleteId);
    if (deleteId === id) {
      onCreateChat()
    }
  };
  const onChatChange = (chatId: string) => {
    if (id === chatId) {
      return;
    }
    useAppStore.setState((state) => {
      state.changeChatLoading = true;
    });
    router.push(`/chat/${chatId}`);
  };
  const onTitleChange = (id: string, newTitle: string) => {
    useAppStore.setState((state) => {
      state.chats[id].title = newTitle.trim() || state.chats[id].title;
    });
  };
  return (
    <ChatHistoryComponent
      chatHistoryList={chatHistoryList}
      onCreateChat={onCreateChat}
      onDeleteChat={onDeleteChat}
      onChatChange={onChatChange}
      onTitleChange={onTitleChange}
    />
  );
};

export default ChatHistory;
