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