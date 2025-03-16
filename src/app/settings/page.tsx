"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MCPSettings from "@/components/mcp-settings";
import APIKeySettings from "@/components/api-key-settings";
import type { MCPServer, APIKey } from "@/types";
import * as db from "@/lib/db";

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // State for MCP servers
  const [mcpServers, setMcpServers] = useState<MCPServer[]>([]);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedApiKeys = await db.getApiKeys();
        setApiKeys(loadedApiKeys as APIKey[]);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load data"));
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Add a new MCP server
  const handleAddMcpServer = (server: MCPServer) => {
    setMcpServers([...mcpServers, server]);
  };

  // Remove an MCP server
  const handleRemoveMcpServer = (serverId: string) => {
    setMcpServers(mcpServers.filter((server) => server.id !== serverId));
  };

  // Add a new API key
  const handleAddApiKey = async (apiKey: APIKey) => {
    try {
      await db.addApiKey(apiKey as APIKey);
      setApiKeys([...apiKeys, apiKey]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to add API key"));
    }
  };

  // Remove an API key
  const handleRemoveApiKey = async (keyId: string) => {
    try {
      await db.deleteApiKey(keyId);
      setApiKeys(apiKeys.filter((key) => key.id !== keyId));
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to remove API key"),
      );
    }
  };

  // Update an API key
  const handleUpdateApiKey = async (apiKey: APIKey) => {
    try {
      await db.updateApiKey(apiKey as APIKey);
      setApiKeys(apiKeys.map((key) => (key.id === apiKey.id ? apiKey : key)));
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to update API key"),
      );
    }
  };

  // Set a key as the default
  const handleSetDefaultApiKey = async (keyId: string) => {
    try {
      // Update all keys to be non-default except the selected one
      await Promise.all(
        apiKeys.map((key) =>
          db.updateApiKey({
            ...key,
            isDefault: key.id === keyId,
          }),
        ),
      );

      // Update local state
      setApiKeys(
        apiKeys.map((key) => ({
          ...key,
          isDefault: key.id === keyId,
        })),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to set default API key"),
      );
    }
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
                onAddKey={handleAddApiKey}
                onRemoveKey={handleRemoveApiKey}
                onUpdateKey={handleUpdateApiKey}
                onSetDefaultKey={handleSetDefaultApiKey}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </TabsContent>

          <TabsContent value="mcp">
            <div className="bg-card rounded-lg border border-border">
              <MCPSettings
                mcpServers={mcpServers}
                onAddServer={handleAddMcpServer}
                onRemoveServer={handleRemoveMcpServer}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
