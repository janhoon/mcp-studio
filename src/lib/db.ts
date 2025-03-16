import Dexie from "dexie";
import type { Chat, Message, APIKey } from "@/types";

class MCPStudioDB extends Dexie {
  apiKeys!: Dexie.Table<APIKey, string>;
  chats!: Dexie.Table<Chat, string>;
  messages!: Dexie.Table<Message, string>;

  constructor() {
    super("mcp-studio");
    this.version(12).stores({
      apiKeys: "id",
      chats: "id",
      messages: "++seq, id, chatId, timestamp",
    });
  }
}

const db = new MCPStudioDB();

// API Keys
export async function getApiKeys(): Promise<APIKey[]> {
  return db.apiKeys.toArray();
}

export async function addApiKey(apiKey: APIKey): Promise<void> {
  await db.apiKeys.add(apiKey);
}

export async function updateApiKey(apiKey: APIKey): Promise<void> {
  await db.apiKeys.put(apiKey);
}

export async function deleteApiKey(id: string): Promise<void> {
  await db.apiKeys.delete(id);
}

// Chats
export async function getChats(): Promise<Chat[]> {
  return db.chats.toArray();
}

export async function getChat(id: string): Promise<Chat | undefined> {
  return db.chats.get(id);
}

export async function addChat(chat: Chat): Promise<void> {
  await db.chats.add(chat);
}

export async function updateChat(chat: Chat): Promise<void> {
  await db.chats.put(chat);
}

export async function deleteChat(id: string): Promise<void> {
  await db.chats.delete(id);
  // Also delete all messages for this chat
  await db.messages.where("chatId").equals(id).delete();
}

// Messages
export async function getChatMessages(chatId: string): Promise<Message[]> {
  return db.messages.where("chatId").equals(chatId).sortBy("seq");
}

export async function addMessage(message: Message): Promise<void> {
  await db.messages.add(message);
}

export async function addMessages(messages: Message[]): Promise<void> {
  await db.messages.bulkAdd(messages);
}

export async function updateMessage(message: Message): Promise<void> {
  await db.messages.put(message);
}

export async function deleteMessage(id: string): Promise<void> {
  await db.messages.delete(id);
}

export async function getLatestMessage(
  chatId: string,
): Promise<Message | undefined> {
  return db.messages.where("chatId").equals(chatId).reverse().first();
}

export async function getMessageCount(chatId: string): Promise<number> {
  return db.messages.where("chatId").equals(chatId).count();
}

// Clear all data
export async function clearAll(): Promise<void> {
  await Promise.all([
    db.apiKeys.clear(),
    db.chats.clear(),
    db.messages.clear(),
  ]);
}

export default db;
