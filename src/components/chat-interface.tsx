"use client";

import { useState, useRef, useEffect, useMemo, type ComponentPropsWithoutRef } from "react";
import { Send, Menu, Plus, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Chat, APIKey } from "@/types";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  chat: Chat | null;
  apiKeys: APIKey[];
  onCreateChat: () => void;
  onUpdateApiKey: (apiKeyId: string | null) => void;
}

export default function ChatInterface({
  chat,
  apiKeys,
  onCreateChat,
  onUpdateApiKey,
}: ChatInterfaceProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get the selected API key
  const selectedApiKey = chat?.apiKeyId
    ? apiKeys.find((key) => key.id === chat.apiKeyId)
    : null;

  const {
    messages: aiMessages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    setMessages,
    error,
  } = useChat({
    api: "/api/chat",
    body: {
      apiKey: selectedApiKey?.key,
      provider: selectedApiKey?.provider,
    },
    onFinish: () => {
      setIsLoading(false);
    },
    onError: (error) => {
      console.error(error);
      setIsLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    originalHandleSubmit(e);
  };

  // Determine if we're waiting for the first response chunk
  const isProcessing = useMemo(() => {
    if (!isLoading) return false;
    const lastMessage = aiMessages[aiMessages.length - 1];
    return lastMessage?.role === "assistant" && !lastMessage.content;
  }, [isLoading, aiMessages]);

  // Sync messages from chat to AI messages on chat change
  useEffect(() => {
    if (chat) {
      setMessages(
        chat.messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
        })),
      );
    }
  }, [chat, setMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages]);

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
        {aiMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <p className="text-center mb-2">No messages yet</p>
            <p className="text-center text-sm">
              Start a conversation with your selected API
            </p>
          </div>
        ) : (
          aiMessages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                "mb-4 p-3 rounded-lg max-w-[80%] relative",
                message.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted prose prose-sm dark:prose-invert max-w-none",
                // Add a subtle animation for the latest message if it's streaming
                index === aiMessages.length - 1 && isProcessing && message.role === "assistant"
                  ? "after:absolute after:bottom-0 after:right-0 after:h-4 after:w-2 after:animate-pulse after:bg-foreground/20 after:rounded-full"
                  : ""
              )}
            >
              {message.role === "user" ? (
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none [&_pre]:!mt-0 [&_pre]:!mb-0">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      pre: ({ children }) => children,
                      code(props: ComponentPropsWithoutRef<"code"> & { inline?: boolean }) {
                        const { inline, className, children } = props;
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline ? (
                          <div className="not-prose bg-muted/50 rounded-md my-0">
                            <SyntaxHighlighter
                              language={match?.[1] || 'text'}
                              style={oneDark}
                              customStyle={{
                                margin: 0,
                                padding: '1rem',
                                background: 'transparent',
                              }}
                              PreTag="div"
                              codeTagProps={{
                                style: {
                                  fontSize: 'inherit',
                                  lineHeight: 'inherit',
                                }
                              }}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code className="bg-muted/50 rounded px-1 py-0.5">
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
              <div className="text-xs opacity-70 mt-1 flex items-center gap-2">
                {isMounted && (
                  <span>{new Date().toLocaleTimeString()}</span>
                )}
                {index === aiMessages.length - 1 && isProcessing && message.role === "assistant" && (
                  <span className="text-xs">typing...</span>
                )}
              </div>
            </div>
          ))
        )}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
            <p className="text-sm">{error.message}</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="flex-1 flex items-center relative">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder={isProcessing ? "Waiting for response..." : "Type your message..."}
              className="pr-24"
              disabled={!selectedApiKey || isProcessing || isLoading}
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
            type="submit"
            disabled={!input.trim() || !chat || !selectedApiKey || isProcessing}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </>
  );
}
