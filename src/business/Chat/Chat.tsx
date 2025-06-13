import React from "react";
import { useEffect, useState } from "react";
import { getChat, saveChat } from "@/store/chat-stores";
import { createIdGenerator, Message } from "ai";
import { useChat } from "@ai-sdk/react";
import ChatComponent from "@/components/Chat/Chat";
import { useEvent } from "@/utils/hooks";

interface IChatProps {
  id: string;
}


const Chat = (props: IChatProps) => {
  const { id } = props;
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
    initialMessages: initialMessages,
    // send id and createdAt for each message 因为我统一采用本地缓存所以不需要将id和createdAt发送给后端
    // sendExtraMessageFields:true,
    onFinish: (message) => {
      setMessage(message);
    },
    generateId: createIdGenerator({
      prefix: "client",
      size: 16,
    }),
    experimental_throttle: 50,
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

  const handleDelete = useEvent((_id: string) => {
    setMessages((prevMessages) => {
      console.log(prevMessages, _id);
      const newMessages = prevMessages.filter(
          (message) => message.id !== _id
        );
      saveChat(id, newMessages);
      return newMessages;
    });
  });

  return (
    <ChatComponent
      handleDelete={handleDelete}
      input={input}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      status={status}
      stop={stop}
      error={error}
      reload={reload}
      messages={messages}
    />
  );
};

export default Chat;
