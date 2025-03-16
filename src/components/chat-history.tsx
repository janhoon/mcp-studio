"use client";

import { Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Chat } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ChatHistoryProps {
  chats: Chat[];
  activeChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  onCreateChat: () => void;
}

export default function ChatHistory({
  chats,
  activeChat,
  onSelectChat,
  onCreateChat,
}: ChatHistoryProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Chat History</h2>
          <Link href="/settings">
            <Button variant="ghost" size="icon" title="Settings">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <Button onClick={onCreateChat} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {chats.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm p-4">
              No chats yet
            </p>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className={cn(
                  "p-3 rounded-md mb-1 cursor-pointer hover:bg-muted transition-colors",
                  activeChat?.id === chat.id ? "bg-muted" : "",
                )}
              >
                <div className="font-medium truncate">{chat.title}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(chat.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
