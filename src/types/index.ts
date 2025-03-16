export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  mcpServerId: string | null;
  apiKeyId: string | null;
}

export interface MCPServer {
  id: string;
  name: string;
  type: "stdio" | "sse";
  command?: string;
  args?: string[];
  url?: string;
}

export interface APIKey {
  id: string;
  name: string;
  provider: "openai" | "anthropic" | "google" | "other";
  key: string;
  isDefault: boolean;
} 