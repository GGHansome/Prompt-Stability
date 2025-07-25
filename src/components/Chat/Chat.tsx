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
  customMessages: Message[];
  model: string;
}

const Chat = ({
  model,
  input,
  error,
  status,
  messages = [],
  customMessages = [],
  handleDelete,
  handleInputChange,
  handleSubmit,
  stop,
  reload,
}: IChatProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollEnabledRef = useRef<boolean>(true); // 控制是否自动滚动

  // 检查是否在底部
  const isAtBottom = () => {
    if (!chatContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    // 给一个小的容差值，避免因为像素误差导致的问题
    return scrollHeight - scrollTop - clientHeight < 50;
  };

  // 平滑滚动到底部的函数
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "instant",
      block: "end",
    });
  };

  // 监听用户滚动行为
  const handleScroll = () => {
    // 用户主动滚动了，禁用自动滚动
    if (autoScrollEnabledRef.current) {
      autoScrollEnabledRef.current = false;
    }
    // 如果用户滚动到底部，重新启用自动滚动
    if (isAtBottom()) {
      autoScrollEnabledRef.current = true;
    }
  };

  // 当消息变化时，如果自动滚动启用就滚动到底部
  useEffect(() => {
    if (autoScrollEnabledRef.current) {
      scrollToBottom();
    }
  }, [messages]);

  const filteredEmptyCustomMessages = useMemo(
    () =>
      customMessages.filter((message) => {
        return message?.parts?.some(
          (part) => part?.type === "text" && part?.text && part.text.trim()
        );
      }),
    [customMessages]
  );

  const _handleSubmit = (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    // 发送消息时启用自动滚动
    autoScrollEnabledRef.current = true;
    handleSubmit(event);
  };

  //这里做细致拆分是因为，流式消息回复的时候，messages会不断变化
  //通过查看源码得知，messages的每个元素message都会是一个新的对象
  //所以不做缓存优化的话，单字的回复都会造成整个历史messages的重渲染
  const isEmptyMessages = messages.length === 0 && filteredEmptyCustomMessages.length === 0
  return (
    <Flex vertical className="w-full h-full">
      <Flex
        ref={chatContainerRef}
        vertical
        flex={1}
        className="overflow-y-auto !p-6"
        justify={isEmptyMessages ? "center" : "flex-start"}
        align={isEmptyMessages ? "center" : "stretch"}
        gap={16}
        onScroll={handleScroll}
      >
        {isEmptyMessages ? (
          <Empty description="You conversation will appear here" />
        ) : (
          <>
            {filteredEmptyCustomMessages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                handleDelete={handleDelete}
                model={model}
                isCustom
              />
            ))}
            {messages.map((message) => (
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
          handleSubmit={_handleSubmit}
        />
      </div>
    </Flex>
  );
};

export default Chat;
