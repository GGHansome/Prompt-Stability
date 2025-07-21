import React, { useEffect, useState } from "react";
import { useAppStore, useStore } from "@/store";
import { createIdGenerator, Message } from "ai";
import { useChat } from "@ai-sdk/react";
import ChatComponent from "@/components/Chat/Chat";
import { useEvent } from "@/utils/hooks";
import { generateMessageFormat } from "@/utils/tools";
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
    model: state.chats[id]?.model,
  }));
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<Message>();
  const {
    messages,
    setMessages,
    setInput,
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
    useAppStore.setState((state) => {
      state.setMessages = setMessages;
    });
  }, [setMessages]);

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

  const handleDelete = useEvent((_id: string) => {
    setMessages((prevMessages) => {
      const newMessages = prevMessages.filter((message) => message.id !== _id);
      saveChat(id, newMessages);
      return newMessages;
    });
  });
  
  const _handleSubmit = (event: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    event?.preventDefault();
    if (!input.trim()) {
      setInput("");
      return;
    }
    const message = generateMessageFormat("user", input, undefined, false);
    const filterMessages = [...messages, message].filter((message) => {
      const annotationType = Object.assign(
        {},
        ...(message.annotations || [])
      )?.type;
      // 如果不是 custom 类型，保留消息
      if (annotationType !== "custom") {
        return true;
      }
      // 如果是 custom 类型，检查是否有有效的文本内容
      return message?.parts?.some(
        (part) => part?.type === "text" && part?.text && part.text.trim()
      );
    });
    handleSubmit(event, {
      body: {
        systemMessage,
        tools,
        model,
        apiKey: "23424234",
        messages: filterMessages
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
