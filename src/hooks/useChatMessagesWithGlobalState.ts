import { useMemo } from 'react';
import { Message } from 'ai';
import { useGlobalState } from './useGlobalState';

interface UseChatMessagesProps {
  chatId: string;
  initialMessages?: Message[];
}

export const useChatMessagesWithGlobalState = ({ 
  chatId, 
  initialMessages = [] 
}: UseChatMessagesProps) => {
  // 处理初始消息，确保稳定的引用
  const stableInitialMessages = useMemo(() => initialMessages, [initialMessages.length]);
  
  // 使用自定义全局状态管理器
  const { data: messages, mutate } = useGlobalState<Message[]>(
    ['chat-messages', chatId],
    stableInitialMessages
  );

  // 添加消息
  const addMessage = (message: Message) => {
    mutate((currentMessages = []) => [...currentMessages, message]);
  };

  // 更新消息
  const updateMessage = (messageId: string, updates: Partial<Message>) => {
    mutate((currentMessages = []) => 
      currentMessages.map(msg => 
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    );
  };

  // 删除消息
  const deleteMessage = (messageId: string) => {
    mutate((currentMessages = []) => 
      currentMessages.filter(msg => msg.id !== messageId)
    );
  };

  // 清空消息
  const clearMessages = () => {
    mutate([]);
  };

  // 批量设置消息
  const setMessages = (newMessages: Message[]) => {
    mutate(newMessages);
  };

  return {
    messages: messages || [],
    addMessage,
    updateMessage,
    deleteMessage,
    clearMessages,
    setMessages,
    mutate,
  };
}; 