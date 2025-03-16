"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import ChatInterface from "@/components/chat-interface";
import ChatHistory from "@/components/chat-history";
import MCPSettings from "@/components/mcp-settings";
import type { MCPServer, Chat, Message, APIKey } from "@/types";

export default function Home() {
  // State for MCP servers
  const [mcpServers, setMcpServers] = useLocalStorage<MCPServer[]>(
    "mcp-servers",
    [],
  );

  // State for API keys
  const [apiKeys, setApiKeys] = useLocalStorage<APIKey[]>("api-keys", []);

  // State for chats
  const [chats, setChats] = useLocalStorage<Chat[]>("chats", []);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  // Create a new chat
  const createNewChat = () => {
    // Find default API key if any
    const defaultKey = apiKeys.find((key) => key.isDefault);

    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
      mcpServerId: mcpServers.length > 0 ? mcpServers[0].id : null,
      apiKeyId: defaultKey?.id || null,
    };

    setChats([newChat, ...chats]);
    setActiveChat(newChat);
  };

  // Add a message to the active chat
  const addMessage = (message: Message) => {
    if (!activeChat) return;

    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, message],
      title:
        activeChat.messages.length === 0
          ? message.content.slice(0, 30) + "..."
          : activeChat.title,
    };

    setActiveChat(updatedChat);
    setChats(
      chats.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat)),
    );
  };

  // Add a new MCP server
  const addMcpServer = (server: MCPServer) => {
    setMcpServers([...mcpServers, server]);
  };

  // Remove an MCP server
  const removeMcpServer = (serverId: string) => {
    setMcpServers(mcpServers.filter((server) => server.id !== serverId));
  };

  // Add a new API key
  // const addApiKey = (apiKey: APIKey) => {
  //   if (apiKey.isDefault) {
  //     // If this key is set as default, remove default from others
  //     setApiKeys([
  //       ...apiKeys.map((key) => ({ ...key, isDefault: false })),
  //       apiKey,
  //     ]);
  //   } else {
  //     setApiKeys([...apiKeys, apiKey]);
  //   }
  // };

  // // Remove an API key
  // const removeApiKey = (keyId: string) => {
  //   setApiKeys(apiKeys.filter((key) => key.id !== keyId));

  //   // Update any chats using this key to use null
  //   setChats(
  //     chats.map((chat) =>
  //       chat.apiKeyId === keyId ? { ...chat, apiKeyId: null } : chat,
  //     ),
  //   );
  // };

  // // Update an API key
  // const updateApiKey = (updatedKey: APIKey) => {
  //   setApiKeys(
  //     apiKeys.map((key) => (key.id === updatedKey.id ? updatedKey : key)),
  //   );
  // };

  // // Set a key as the default
  // const setDefaultApiKey = (keyId: string) => {
  //   setApiKeys(
  //     apiKeys.map((key) => ({
  //       ...key,
  //       isDefault: key.id === keyId,
  //     })),
  //   );
  // };

  // Update the API key for the active chat
  const updateChatApiKey = (apiKeyId: string | null) => {
    if (!activeChat) return;

    const updatedChat = {
      ...activeChat,
      apiKeyId,
    };

    setActiveChat(updatedChat);
    setChats(
      chats.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat)),
    );
  };

  const deleteChat = (chatId: string) => {
    setChats(chats.filter((chat) => chat.id !== chatId));
  };

  const renameChat = (chatId: string, newTitle: string) => {
    setChats(chats.map((chat) => (chat.id === chatId ? { ...chat, title: newTitle } : chat)));
  };

  // Initialize with a new chat if none exists
  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    } else if (!activeChat) {
      setActiveChat(chats[0]);
    }
  }, [chats, activeChat]);

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
          // onSendMessage={addMessage}
          // mcpServers={mcpServers}
          apiKeys={apiKeys}
          onCreateChat={createNewChat}
          onUpdateApiKey={updateChatApiKey}
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
