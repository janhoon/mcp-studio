"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MCPSettings from "@/components/mcp-settings";
import APIKeySettings from "@/components/api-key-settings";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { MCPServer, APIKey } from "@/types";

export default function SettingsPage() {
  const router = useRouter();

  // State for MCP servers
  const [mcpServers, setMcpServers] = useLocalStorage<MCPServer[]>(
    "mcp-servers",
    [],
  );

  // State for API keys
  const [apiKeys, setApiKeys] = useLocalStorage<APIKey[]>("api-keys", []);

  // Add a new MCP server
  const addMcpServer = (server: MCPServer) => {
    setMcpServers([...mcpServers, server]);
  };

  // Remove an MCP server
  const removeMcpServer = (serverId: string) => {
    setMcpServers(mcpServers.filter((server) => server.id !== serverId));
  };

  // Add a new API key
  const addApiKey = (apiKey: APIKey) => {
    if (apiKey.isDefault) {
      // If this key is set as default, remove default from others
      setApiKeys([
        ...apiKeys.map((key) => ({ ...key, isDefault: false })),
        apiKey,
      ]);
    } else {
      setApiKeys([...apiKeys, apiKey]);
    }
  };

  // Remove an API key
  const removeApiKey = (keyId: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== keyId));
  };

  // Update an API key
  const updateApiKey = (updatedKey: APIKey) => {
    setApiKeys(
      apiKeys.map((key) => (key.id === updatedKey.id ? updatedKey : key)),
    );
  };

  // Set a key as the default
  const setDefaultApiKey = (keyId: string) => {
    setApiKeys(
      apiKeys.map((key) => ({
        ...key,
        isDefault: key.id === keyId,
      })),
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
        <Tabs defaultValue="api" className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-4">
            <TabsTrigger value="api" className="flex-1">
              API Keys
            </TabsTrigger>
            <TabsTrigger value="mcp" className="flex-1">
              MCP Servers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api">
            <div className="bg-card rounded-lg border border-border">
              <APIKeySettings
                apiKeys={apiKeys}
                onAddKey={addApiKey}
                onRemoveKey={removeApiKey}
                onUpdateKey={updateApiKey}
                onSetDefaultKey={setDefaultApiKey}
              />
            </div>
          </TabsContent>

          <TabsContent value="mcp">
            <div className="bg-card rounded-lg border border-border">
              <MCPSettings
                mcpServers={mcpServers}
                onAddServer={addMcpServer}
                onRemoveServer={removeMcpServer}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
