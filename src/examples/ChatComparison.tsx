"use client";

import React from 'react';
import { Message } from 'ai';

// 方案1: React Context
import { useChatMessages as useContextChatMessages } from '../contexts/ChatContext';

// 方案2: 自定义全局状态（类似 SWR）
import { useChatMessagesWithGlobalState } from '../hooks/useChatMessagesWithGlobalState';

// 方案3: 传统 useState（仅作对比，实际不能跨组件共享）
import { useState } from 'react';

// 示例组件 - 使用 Context 方案
const ChatWithContext: React.FC<{ chatId: string }> = ({ chatId }) => {
  const { messages, addMessage, deleteMessage } = useContextChatMessages(chatId);

  const handleAddMessage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: 'Hello from Context!',
    };
    addMessage(newMessage);
  };

  return (
    <div className="p-4 border rounded">
      <h3>Context 方案</h3>
      <p>消息数量: {messages.length}</p>
      <button onClick={handleAddMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
        添加消息
      </button>
      <div className="mt-2">
        {messages.map(msg => (
          <div key={msg.id} className="flex justify-between items-center p-2 border-b">
            <span>{msg.content}</span>
            <button 
              onClick={() => deleteMessage(msg.id)}
              className="text-red-500 text-sm"
            >
              删除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 示例组件 - 使用自定义全局状态方案
const ChatWithGlobalState: React.FC<{ chatId: string }> = ({ chatId }) => {
  const { messages, addMessage, deleteMessage } = useChatMessagesWithGlobalState({ 
    chatId,
    initialMessages: []
  });

  const handleAddMessage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: 'Hello from Global State!',
    };
    addMessage(newMessage);
  };

  return (
    <div className="p-4 border rounded">
      <h3>全局状态方案（类似 SWR）</h3>
      <p>消息数量: {messages.length}</p>
      <button onClick={handleAddMessage} className="bg-green-500 text-white px-4 py-2 rounded">
        添加消息
      </button>
      <div className="mt-2">
        {messages.map(msg => (
          <div key={msg.id} className="flex justify-between items-center p-2 border-b">
            <span>{msg.content}</span>
            <button 
              onClick={() => deleteMessage(msg.id)}
              className="text-red-500 text-sm"
            >
              删除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 示例组件 - 使用 useState（仅作对比）
const ChatWithUseState: React.FC<{ chatId: string }> = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const handleAddMessage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: 'Hello from useState!',
    };
    addMessage(newMessage);
  };

  return (
    <div className="p-4 border rounded">
      <h3>useState 方案（仅本组件）</h3>
      <p>消息数量: {messages.length}</p>
      <button onClick={handleAddMessage} className="bg-purple-500 text-white px-4 py-2 rounded">
        添加消息
      </button>
      <div className="mt-2">
        {messages.map(msg => (
          <div key={msg.id} className="flex justify-between items-center p-2 border-b">
            <span>{msg.content}</span>
            <button 
              onClick={() => deleteMessage(msg.id)}
              className="text-red-500 text-sm"
            >
              删除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 主对比组件
const ChatComparison: React.FC = () => {
  const chatId = "demo-chat";

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">聊天状态管理方案对比</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ChatWithContext chatId={chatId} />
        <ChatWithGlobalState chatId={chatId} />
        <ChatWithUseState chatId={chatId} />
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-4">测试说明:</h2>
        <ul className="space-y-2 text-sm">
          <li>• <strong>Context 方案</strong>: 在不同组件间共享状态，但需要 Provider 包裹</li>
          <li>• <strong>全局状态方案</strong>: 类似 SWR，自动跨组件共享，无需 Provider</li>
          <li>• <strong>useState 方案</strong>: 仅在当前组件内有效，组件卸载后状态丢失</li>
        </ul>
      </div>
    </div>
  );
};

export default ChatComparison; 