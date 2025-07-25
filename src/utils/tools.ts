import { createIdGenerator, Message } from "ai";

// 创建一个WeakMap来存储对象的唯一标识
const objectIdMap = new WeakMap();
let objectIdCounter = 0;

// 获取对象的唯一标识符
export const getObjectId = (obj: any) => {
  if (!objectIdMap.has(obj)) {
    objectIdMap.set(obj, ++objectIdCounter);
  }
  return objectIdMap.get(obj);
};

export const generateMessageFormat = (role: "user" | "assistant" | "system" | "data", content: string, id?: string, isCustom?: boolean) => {
  const message: Message = {
    id: id || createIdGenerator({
      prefix: role === "user" ? "client" : "server",
      size: 16,
    })(),
    role,
    content,
    createdAt: new Date(),
    parts: [
      {
        type: "text",
        text: content,
      }
    ],
  }
  return message
}

// Response工具函数类型定义
interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

// 创建API响应的工具函数
export const createApiResponse = <T = any>(
  data?: T,
  error?: any
): Response => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (error) {
    const response: ApiResponse = {
      status: 'error',
      message: error instanceof Error ? error.message : String(error),
    }; 
    return new Response(JSON.stringify(response), {
      headers
    });
  }
  const response: ApiResponse<T> = {
    status: 'success',
    data,
  };
  return new Response(JSON.stringify(response), {
    headers,
  });
};