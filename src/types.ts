export interface Chat {
  id: string;
  title: string;
  createdAt: string;
  mcpServerId: string | null;
  apiKeyId: string | null;
}

export interface Message {
  id: string;
  seq?: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  chatId: string;
  [key: string]: unknown;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  provider: "openai" | "anthropic" | "google" | "other";
  isDefault?: boolean;
  [key: string]: unknown;
}

export interface MCPServer {
  id: string;
  name: string;
  url: string;
  type: "stdio" | "sse";
  command?: string;
  args?: string[];
  [key: string]: unknown;
}
