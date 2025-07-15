import React, { useEffect, useMemo, useRef } from "react";
import { Flex, Empty } from "antd";
import { Message } from "ai";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

interface IChatProps {
  handleDelete: (id: string) => void;
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleSubmit: (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => void;
  status: string;
  stop: () => void;
  error: Error | undefined;
  reload: () => void;
  messages: Message[];
  model: string;
}

const Chat = ({
  model,
  input,
  error,
  status,
  messages = [],
  handleDelete,
  handleInputChange,
  handleSubmit,
  stop,
  reload,
}: IChatProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 平滑滚动到底部的函数
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "instant",
      block: "end",
    });
  };

  // 当消息变化时自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredMessages = useMemo(() => messages.filter(
    (message) => {
      const annotationType = Object.assign({}, ...(message.annotations || []))?.type;
      // 如果不是 custom 类型，保留消息
      if (annotationType !== "custom") {
        return true;
      }
      // 如果是 custom 类型，检查是否有有效的文本内容
      return message?.parts?.some(part => 
        part?.type === "text" && part?.text && part.text.trim()
      );
    }
  ), [messages]);

  //这里做细致拆分是因为，流式消息回复的时候，messages会不断变化
  //通过查看源码得知，messages的每个元素message都会是一个新的对象
  //所以不做缓存优化的话，单字的回复都会造成整个历史messages的重渲染
  return (
    <Flex vertical className="w-full h-screen">
      <Flex 
        vertical 
        flex={1} 
        className="overflow-y-auto !p-6"
        justify={messages.length === 0 ? "center" : "flex-start"}
        align={messages.length === 0 ? "center" : "stretch"}
        gap={16}
      >
        {messages.length === 0 ? (
          <Empty description="You conversation will appear here" />
        ) : (
          <>
            {filteredMessages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                handleDelete={handleDelete}
                model={model}
              />
            ))}
            {/* 用于滚动定位的元素 */}
            <div ref={messagesEndRef} />
          </>
        )}
      </Flex>
      <div className="p-6 pt-0">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </Flex>
  );
};

export default Chat;
