"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Menu, Plus, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Chat, Message, MCPServer, APIKey } from "@/types";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  chat: Chat | null;
  onSendMessage: (message: Message) => void;
  mcpServers: MCPServer[];
  apiKeys: APIKey[];
  onCreateChat: () => void;
  onUpdateApiKey: (apiKeyId: string | null) => void;
}

export default function ChatInterface({
  chat,
  onSendMessage,
  mcpServers,
  apiKeys,
  onCreateChat,
  onUpdateApiKey,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (!input.trim() || !chat) return;

    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    onSendMessage(userMessage);
    setInput("");

    // Use requestAnimationFrame to delay the AI response and avoid React update conflicts
    requestAnimationFrame(() => {
      // Get the selected API key if any
      const selectedApiKey = chat.apiKeyId
        ? apiKeys.find((key) => key.id === chat.apiKeyId)
        : null;

      // Simulate AI response (in a real app, this would come from the API)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `This is a simulated response. In a real implementation, this would use the ${
          selectedApiKey
            ? `${selectedApiKey.provider} API with key ${selectedApiKey.name}`
            : "no API key"
        } and MCP server ${chat.mcpServerId ? mcpServers.find((s) => s.id === chat.mcpServerId)?.name : "none"}.`,
        timestamp: new Date().toISOString(),
      };

      onSendMessage(aiMessage);
    });
  };

  // Get the selected API key
  const selectedApiKey = chat?.apiKeyId
    ? apiKeys.find((key) => key.id === chat.apiKeyId)
    : null;

  return (
    <>
      {/* Mobile Header */}
      <div className="border-b border-border p-2 flex items-center justify-between md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu />
        </Button>
        <h1 className="text-lg font-semibold">{chat?.title || "Chat"}</h1>
        <Button variant="ghost" size="icon" onClick={onCreateChat}>
          <Plus />
        </Button>
      </div>

      {/* Mobile Menu (Sidebar) */}
      {isMobileMenuOpen && (
        <div className="absolute top-12 left-0 w-64 h-[calc(100%-3rem)] bg-background border-r border-border z-10 md:hidden">
          {/* Mobile menu content would go here */}
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {chat?.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <p className="text-center mb-2">No messages yet</p>
            <p className="text-center text-sm">
              Start a conversation with your selected API
            </p>
          </div>
        ) : (
          chat?.messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "mb-4 p-3 rounded-lg max-w-[80%]",
                message.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted",
              )}
            >
              <p>{message.content}</p>
              <div className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1 flex items-center relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              className="pr-24"
            />
            <div className="absolute right-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {selectedApiKey ? selectedApiKey.name : "Select Model"}
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="end">
                  <div className="space-y-1">
                    <p className="text-xs font-medium mb-2">Select Model</p>
                    {apiKeys.length === 0 ? (
                      <div className="text-xs text-muted-foreground py-1 px-2">
                        No API keys configured.
                        <Link href="/settings" className="text-primary ml-1">
                          Add in Settings
                        </Link>
                      </div>
                    ) : (
                      apiKeys.map((key) => (
                        <Button
                          key={key.id}
                          variant={
                            chat?.apiKeyId === key.id ? "secondary" : "ghost"
                          }
                          size="sm"
                          className="w-full justify-start text-xs h-8"
                          onClick={() => onUpdateApiKey(key.id)}
                        >
                          {key.name} ({key.provider})
                          {key.isDefault && " (Default)"}
                        </Button>
                      ))
                    )}
                    <Button
                      variant={!chat?.apiKeyId ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-xs h-8"
                      onClick={() => onUpdateApiKey(null)}
                    >
                      No API Key
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || !chat}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
