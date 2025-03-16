"use client";

import { useState, useEffect } from "react";
import ChatInterface from "@/components/chat-interface";
import ChatHistory from "@/components/chat-history";
import MCPSettings from "@/components/mcp-settings";
import type { MCPServer, Chat, APIKey, Message } from "@/types";
import * as db from "@/lib/db";

export default function Home() {
  // State for MCP servers
  const [mcpServers, setMcpServers] = useState<MCPServer[]>([]);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      const [loadedApiKeys, loadedChats] = await Promise.all([
        db.getApiKeys(),
        db.getChats(),
      ]);
      setApiKeys(loadedApiKeys as APIKey[]);
      setChats(loadedChats as Chat[]);
    };
    loadData();
  }, []);

  // Load messages when active chat changes
  useEffect(() => {
    const loadMessages = async () => {
      if (activeChat) {
        const chatMessages = await db.getChatMessages(activeChat.id);
        setMessages(chatMessages);
      } else {
        setMessages([]);
      }
    };
    loadMessages();
  }, [activeChat]);

  // Create a new chat
  const createNewChat = async () => {
    // Find default API key if any
    const defaultKey = apiKeys.find((key) => key.isDefault);

    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      createdAt: new Date().toISOString(),
      mcpServerId: mcpServers.length > 0 ? mcpServers[0].id : null,
      apiKeyId: defaultKey?.id || null,
    };

    await db.addChat(newChat);
    setChats([...chats, newChat]);
    setActiveChat(newChat);
  };

  // Add a new MCP server
  const addMcpServer = (server: MCPServer) => {
    setMcpServers([...mcpServers, server]);
  };

  // Remove an MCP server
  const removeMcpServer = (serverId: string) => {
    setMcpServers(mcpServers.filter((server) => server.id !== serverId));
  };

  // Update the API key for the active chat
  const updateChatApiKey = async (apiKeyId: string | null) => {
    if (!activeChat) return;

    const updatedChat = {
      ...activeChat,
      apiKeyId,
    };

    await db.updateChat(updatedChat);
    setChats(
      chats.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat)),
    );
    setActiveChat(updatedChat);
  };

  const deleteChat = async (chatId: string) => {
    await db.deleteChat(chatId);
    setChats(chats.filter((chat) => chat.id !== chatId));
    if (activeChat?.id === chatId) {
      setActiveChat(null);
    }
  };

  const renameChat = async (chatId: string, newTitle: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      const updatedChat = { ...chat, title: newTitle };
      await db.updateChat(updatedChat);
      setChats(chats.map((c) => (c.id === chatId ? updatedChat : c)));
      if (activeChat?.id === chatId) {
        setActiveChat(updatedChat);
      }
    }
  };

  const updateChatMessages = async (chatId: string, newMessages: Message[]) => {
    // Add each new message to the database
    await Promise.all(
      newMessages.map((msg) => {
        const messageToSave = {
          ...msg,
          chatId,
        };
        return db.addMessage(messageToSave);
      }),
    );

    // Refresh messages for the current chat
    if (activeChat?.id === chatId) {
      const updatedMessages = await db.getChatMessages(chatId);
      setMessages(updatedMessages);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Chat History Sidebar */}
      <div className="w-64 border-r border-border h-full overflow-y-auto hidden md:block">
        <ChatHistory
          chats={chats}
          activeChat={activeChat}
          onSelectChat={setActiveChat}
          onCreateChat={createNewChat}
          onDeleteChat={deleteChat}
          onRenameChat={renameChat}
        />
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatInterface
          chat={activeChat}
          messages={messages}
          apiKeys={apiKeys}
          onCreateChat={createNewChat}
          onUpdateApiKey={updateChatApiKey}
          onUpdateMessages={updateChatMessages}
        />
      </div>

      {/* MCP Settings Panel */}
      <div className="w-80 border-l border-border h-full overflow-y-auto hidden lg:block">
        <MCPSettings
          mcpServers={mcpServers}
          onAddServer={addMcpServer}
          onRemoveServer={removeMcpServer}
        />
      </div>
    </div>
  );
}
