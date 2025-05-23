"use client";

import { use, useEffect, useState } from "react";
import { getChat, saveChat } from "@/store/chat-stores";
import { Message } from "ai";
import { useChat } from "@ai-sdk/react";
import Chat from "@/components/Chat/Chat";

export default function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<Message>();
  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    error,
    reload,
  } = useChat({
    id,
    initialMessages:initialMessages,
    // send id and createdAt for each message 因为我统一采用本地缓存所以不需要将id和createdAt发送给后端
    // sendExtraMessageFields:true,
    onFinish: (message) => {
      setMessage(message);
    },
  });

  useEffect(() => {
    const messages = getChat(id);
    if (messages.length > 0) {
      setInitialMessages(messages);
    }
  }, [id]);

  useEffect(() => {
    if (messages.length > 0) {
      saveChat(id, messages);
    }
  }, [message]);

  const handleDelete = (_id: string) => {
    const newMessages = messages.filter((message) => message.id !== _id);
    setMessages(newMessages);
    saveChat(id, newMessages);
  };

  return (
    <>
      <Chat handleDelete={handleDelete} input={input} handleInputChange={handleInputChange} handleSubmit={handleSubmit} status={status} stop={stop} error={error} reload={reload} messages={messages}/>
    </>
  );
}
