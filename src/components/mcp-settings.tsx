"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MCPServer } from "@/types";

interface MCPSettingsProps {
  mcpServers: MCPServer[];
  onAddServer: (server: MCPServer) => void;
  onRemoveServer: (serverId: string) => void;
}

export default function MCPSettings({
  mcpServers,
  onAddServer,
  onRemoveServer,
}: MCPSettingsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newServer, setNewServer] = useState<Partial<MCPServer>>({
    type: "stdio",
    name: "",
    command: "",
    args: [],
  });

  const handleAddServer = () => {
    if (
      !newServer.name ||
      (newServer.type === "stdio" && !newServer.command) ||
      (newServer.type === "sse" && !newServer.url)
    ) {
      return;
    }

    onAddServer({
      id: Date.now().toString(),
      name: newServer.name || "Unnamed Server",
      type: newServer.type as "stdio" | "sse",
      command: newServer.command || "",
      args: newServer.args || [],
      url: newServer.url || "",
    });

    setNewServer({
      type: "stdio",
      name: "",
      command: "",
      args: [],
    });

    setIsAdding(false);
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">MCP Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure Model Context Protocol servers to connect with AI models
        </p>
      </div>

      <Button
        onClick={() => setIsAdding(true)}
        className="w-full mb-4"
        disabled={isAdding}
      >
        <Plus className="mr-2 h-4 w-4" /> Add MCP Server
      </Button>

      {isAdding && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Add MCP Server</CardTitle>
            <CardDescription>
              Configure a new Model Context Protocol server
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="server-name">Server Name</Label>
              <Input
                id="server-name"
                value={newServer.name || ""}
                onChange={(e) =>
                  setNewServer({ ...newServer, name: e.target.value })
                }
                placeholder="My MCP Server"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="server-type">Server Type</Label>
              <Select
                value={newServer.type}
                onValueChange={(value) =>
                  setNewServer({ ...newServer, type: value as "stdio" | "sse" })
                }
              >
                <SelectTrigger id="server-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stdio">Standard IO</SelectItem>
                  <SelectItem value="sse">Server-Sent Events</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newServer.type === "stdio" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="command">Command</Label>
                  <Input
                    id="command"
                    value={newServer.command || ""}
                    onChange={(e) =>
                      setNewServer({ ...newServer, command: e.target.value })
                    }
                    placeholder="npx -y @modelcontextprotocol/server-postgres"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="args">Arguments (comma separated)</Label>
                  <Input
                    id="args"
                    value={newServer.args?.join(", ") || ""}
                    onChange={(e) =>
                      setNewServer({
                        ...newServer,
                        args: e.target.value
                          .split(",")
                          .map((arg) => arg.trim()),
                      })
                    }
                    placeholder="arg1, arg2, arg3"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={newServer.url || ""}
                  onChange={(e) =>
                    setNewServer({ ...newServer, url: e.target.value })
                  }
                  placeholder="http://localhost:3000/sse"
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddServer}>Add Server</Button>
          </CardFooter>
        </Card>
      )}

      {mcpServers.length === 0 ? (
        <div className="text-center p-4 text-muted-foreground">
          No MCP servers configured
        </div>
      ) : (
        <div className="space-y-4">
          {mcpServers.map((server) => (
            <Card key={server.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{server.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveServer(server.id)}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  {server.type === "stdio"
                    ? "Standard IO"
                    : "Server-Sent Events"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {server.type === "stdio" ? (
                  <div className="text-sm">
                    <div className="font-medium">Command:</div>
                    <code className="bg-muted p-1 rounded text-xs block mt-1 mb-2 overflow-x-auto">
                      {server.command} {server.args?.join(" ")}
                    </code>
                  </div>
                ) : (
                  <div className="text-sm">
                    <div className="font-medium">URL:</div>
                    <code className="bg-muted p-1 rounded text-xs block mt-1 overflow-x-auto">
                      {server.url}
                    </code>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
