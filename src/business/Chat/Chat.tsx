import React, { useEffect, useState } from "react";
import { useAppStore, useStore } from "@/store";
import { createIdGenerator, Message } from "ai";
import { useChat } from "@ai-sdk/react";
import ChatComponent from "@/components/Chat/Chat";
import { useEvent } from "@/utils/hooks";
interface IChatProps {
  id: string;
}

const Chat = (props: IChatProps) => {
  const { id } = props;
  const { getChat, saveChat, systemMessage, tools, model } = useStore((state) => ({
    getChat: state.getChat,
    saveChat: state.saveChat,
    systemMessage: state.chats[id]?.system_message,
    tools: state.chats[id]?.tools,
    model: state.chats[id]?.model
  }));
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
      console.log('onFinish:', message);
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
    if (messages?.length > 0) {
      setInitialMessages(messages);
    }
  }, [id]);

  useEffect(() => {
    if (messages.length > 0 && message) {
      const endMessages: Message[] = [...messages.slice(0, -1), message];
      saveChat(id, endMessages);
    }
  }, [message]);

  useEffect(() => {
    console.log('messages:', messages);
  }, [messages]);

  const handleDelete = useEvent((_id: string) => {
    setMessages((prevMessages) => {
      const newMessages = prevMessages.filter((message) => message.id !== _id);
      saveChat(id, newMessages);
      return newMessages;
    });
  });
  
  const _handleSubmit = (event: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    event?.preventDefault();
    handleSubmit(event, {
      body: {
        systemMessage,
        tools,
        model,
        apiKey: "23424234",
      },
    });
  };

  return (
    <ChatComponent
      handleDelete={handleDelete}
      input={input}
      handleInputChange={handleInputChange}
      handleSubmit={_handleSubmit}
      status={status}
      stop={stop}
      error={error}
      reload={reload}
      messages={messages}
      model={model}
    />
  );
};

export default Chat;
