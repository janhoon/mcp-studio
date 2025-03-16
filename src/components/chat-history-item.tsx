import { cn } from "@/lib/utils";
import { Chat } from "@/types";

export default function ChatHistoryItem({
  chat,
  activeChat,
  onSelectChat,
}: {
  chat: Chat;
  activeChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
}) {
  return (
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
  );
}
