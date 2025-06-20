import React, { useEffect, useRef } from "react";
import { Space, Flex, Empty } from "antd";
import { ChatRequestOptions, Message } from "ai";
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
    event: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>
  ) => void;
  status: string;
  stop: () => void;
  error: Error | undefined;
  reload: () => void;
  messages: Message[];
}

const Chat = ({
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
  console.log('重渲染chat组件')
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 平滑滚动到底部的函数
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  };

  // 当消息变化时自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //这里做细致拆分是因为，流式消息回复的时候，messages会不断变化
  //通过查看源码得知，messages的每个元素message都会是一个新的对象
  //所以不做缓存优化的话，单字的回复都会造成整个历史messages的重渲染
  return (
    <div className="h-[100vh] relative">
      <Flex vertical className="w-full h-full">
        <Space
          direction="vertical"
          className={`w-full h-full overflow-y-auto p-6 ${messages.length === 0 ? 'flex justify-center items-center' : ''}`}
        >
          {messages.length === 0 && (
            <Empty description="You conversation will appear here" />
          )}
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              handleDelete={handleDelete}
            />
          ))}
          {/* 用于滚动定位的元素 */}
          <div ref={messagesEndRef} />
        </Space>
        <div className="p-6 pt-0">
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </div>
      </Flex>
    </div>
  );
};

export default Chat;
