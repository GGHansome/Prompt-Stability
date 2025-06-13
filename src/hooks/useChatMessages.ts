import { useMemo } from 'react';
import useSWR from 'swr';
import { Message } from 'ai';

interface UseChatMessagesProps {
  chatId: string;
  initialMessages?: Message[];
}

export const useChatMessages = ({ chatId, initialMessages = [] }: UseChatMessagesProps) => {
  // 处理初始消息，确保稳定的引用
  const stableInitialMessages = useMemo(() => initialMessages, [initialMessages.length]);
  
  // 使用 SWR 作为状态管理器，而不是数据请求工具
  const { data: messages, mutate } = useSWR<Message[]>(
    ['chat-messages', chatId], // 使用 chatId 作为 key 的一部分
    null, // 不进行网络请求
    { 
      fallbackData: stableInitialMessages,
      revalidateOnFocus: false, // 禁用焦点时重新验证
      revalidateOnReconnect: false, // 禁用重连时重新验证
    }
  );

  // 添加消息
  const addMessage = (message: Message) => {
    mutate((currentMessages = []) => [...currentMessages, message], false);
  };

  // 更新消息
  const updateMessage = (messageId: string, updates: Partial<Message>) => {
    mutate((currentMessages = []) => 
      currentMessages.map(msg => 
        msg.id === messageId ? { ...msg, ...updates } : msg
      ), false
    );
  };

  // 删除消息
  const deleteMessage = (messageId: string) => {
    mutate((currentMessages = []) => 
      currentMessages.filter(msg => msg.id !== messageId), false
    );
  };

  // 清空消息
  const clearMessages = () => {
    mutate([], false);
  };

  // 批量设置消息
  const setMessages = (newMessages: Message[]) => {
    mutate(newMessages, false);
  };

  return {
    messages: messages || [],
    addMessage,
    updateMessage,
    deleteMessage,
    clearMessages,
    setMessages,
    mutate, // 暴露原始的 mutate 函数以便更复杂的操作
  };
}; 