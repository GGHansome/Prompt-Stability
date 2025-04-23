import { generateId, Message } from 'ai';

const CHATS_STORAGE_KEY = 'all-chats';

export function createChat(): string {
  const id = generateId(); // generate a unique chat ID
  const allChats = getAllChats();
  
  // 清理空消息的聊天
  cleanEmptyChats(allChats);
  
  allChats[id] = [];
  saveAllChats(allChats);
  return id;
}

export function saveChat(id: string, messages: Message[]): void {
  const allChats = getAllChats();
  allChats[id] = messages;
  saveAllChats(allChats);
}

export function getChat(id: string): any[] {
  const allChats = getAllChats();
  return allChats[id] || [];
}

export function deleteChat(id: string): void {
  const allChats = getAllChats();
  delete allChats[id];
  saveAllChats(allChats);
}

function getAllChats(): Record<string, any[]> {
  const chats = localStorage.getItem(CHATS_STORAGE_KEY);
  return chats ? JSON.parse(chats) : {};
}

function saveAllChats(chats: Record<string, any[]>): void {
  localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
}

function cleanEmptyChats(chats: Record<string, any[]>): void {
  for (const chatId in chats) {
    if (chats[chatId].length === 0) {
      delete chats[chatId];
    }
  }
}