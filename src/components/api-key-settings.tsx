"use client";

import { useState } from "react";
import { Trash2, Eye, EyeOff, Edit, Check, X } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import type { APIKey } from "@/types";

interface APIKeySettingsProps {
  apiKeys: APIKey[];
  onAddKey: (apiKey: APIKey) => Promise<void>;
  onRemoveKey: (keyId: string) => Promise<void>;
  onUpdateKey: (apiKey: APIKey) => Promise<void>;
  onSetDefaultKey: (keyId: string) => Promise<void>;
  isLoading?: boolean;
  error?: Error | null;
}

export default function APIKeySettings({
  apiKeys,
  onAddKey,
  onRemoveKey,
  onUpdateKey,
  onSetDefaultKey,
  isLoading,
  error,
}: APIKeySettingsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const [newKey, setNewKey] = useState<Partial<APIKey>>({
    provider: "openai",
    name: "",
    key: "",
  });

  const [editKey, setEditKey] = useState<Partial<APIKey>>({});

  const handleAddKey = async () => {
    if (!newKey.name || !newKey.key || !newKey.provider) {
      return;
    }

    try {
      await onAddKey({
        id: Date.now().toString(),
        name: newKey.name,
        provider: newKey.provider,
        key: newKey.key,
        isDefault: apiKeys.length === 0, // Make it default if it's the first key
      });

      setNewKey({
        provider: "openai",
        name: "",
        key: "",
      });

      setIsAdding(false);
    } catch (error) {
      console.error("Failed to add API key:", error);
    }
  };

  const handleStartEdit = (key: APIKey) => {
    setEditingKey(key.id);
    setEditKey({ ...key });
  };

  const handleSaveEdit = async () => {
    if (editingKey && editKey.name && editKey.key && editKey.provider) {
      try {
        await onUpdateKey({
          id: editingKey,
          name: editKey.name,
          provider: editKey.provider,
          key: editKey.key,
          isDefault: editKey.isDefault || false,
        });
        setEditingKey(null);
      } catch (error) {
        console.error("Failed to update API key:", error);
      }
    }
  };

  const handleRemoveKey = async (keyId: string) => {
    try {
      await onRemoveKey(keyId);
    } catch (error) {
      console.error("Failed to remove API key:", error);
    }
  };

  const handleSetDefaultKey = async (keyId: string) => {
    try {
      await onSetDefaultKey(keyId);
    } catch (error) {
      console.error("Failed to set default API key:", error);
    }
  };

  const toggleShowKey = (id: string) => {
    setShowKey((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (isLoading) {
    return (
      <div className="p-4 h-full overflow-y-auto">
        <div className="text-center p-4 text-muted-foreground">
          Loading API keys...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 h-full overflow-y-auto">
        <div className="text-center p-4 text-destructive">
          Error: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">API Key Management</h2>
        <p className="text-sm text-muted-foreground">
          Configure API keys for different language models
        </p>
      </div>

      <Button
        onClick={() => setIsAdding(true)}
        className="w-full mb-4"
        disabled={isAdding}
      >
        Add API Key
      </Button>

      {isAdding && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Add API Key</CardTitle>
            <CardDescription>
              Configure a new API key for language models
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="key-name">Key Name</Label>
              <Input
                id="key-name"
                value={newKey.name || ""}
                onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                placeholder="My OpenAI Key"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Select
                value={newKey.provider}
                onValueChange={(
                  value: "openai" | "anthropic" | "google" | "other",
                ) => setNewKey({ ...newKey, provider: value })}
              >
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="google">Google AI</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <div className="flex">
                <Input
                  id="api-key"
                  type={showKey["new"] ? "text" : "password"}
                  value={newKey.key || ""}
                  onChange={(e) =>
                    setNewKey({ ...newKey, key: e.target.value })
                  }
                  placeholder="sk-..."
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleShowKey("new")}
                  className="ml-2"
                >
                  {showKey["new"] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddKey}>Add Key</Button>
          </CardFooter>
        </Card>
      )}

      {apiKeys.length === 0 ? (
        <div className="text-center p-4 text-muted-foreground">
          No API keys configured
        </div>
      ) : (
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <Card key={apiKey.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      {apiKey.name}
                      {apiKey.isDefault && (
                        <Badge variant="secondary" className="ml-2">
                          Default
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {apiKey.provider === "openai"
                        ? "OpenAI"
                        : apiKey.provider === "anthropic"
                          ? "Anthropic"
                          : apiKey.provider === "google"
                            ? "Google AI"
                            : "Other"}
                    </CardDescription>
                  </div>
                  {!apiKey.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefaultKey(apiKey.id)}
                      className="text-xs"
                    >
                      Set as Default
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editingKey === apiKey.id ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`edit-name-${apiKey.id}`}>Name</Label>
                      <Input
                        id={`edit-name-${apiKey.id}`}
                        value={editKey.name || ""}
                        onChange={(e) =>
                          setEditKey({ ...editKey, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edit-provider-${apiKey.id}`}>
                        Provider
                      </Label>
                      <Select
                        value={editKey.provider}
                        onValueChange={(
                          value: "openai" | "anthropic" | "google" | "other",
                        ) => setEditKey({ ...editKey, provider: value })}
                      >
                        <SelectTrigger id={`edit-provider-${apiKey.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="anthropic">Anthropic</SelectItem>
                          <SelectItem value="google">Google AI</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`edit-key-${apiKey.id}`}>API Key</Label>
                      <div className="flex">
                        <Input
                          id={`edit-key-${apiKey.id}`}
                          type={showKey[apiKey.id] ? "text" : "password"}
                          value={editKey.key || ""}
                          onChange={(e) =>
                            setEditKey({ ...editKey, key: e.target.value })
                          }
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleShowKey(apiKey.id)}
                          className="ml-2"
                        >
                          {showKey[apiKey.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex space-x-2 justify-end mt-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingKey(null)}
                      >
                        <X className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                      <Button size="sm" onClick={handleSaveEdit}>
                        <Check className="h-4 w-4 mr-1" /> Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm">
                    <div className="font-medium">API Key:</div>
                    <div className="flex items-center mt-1">
                      <code className="bg-muted p-1 rounded text-xs block overflow-x-auto flex-1">
                        {showKey[apiKey.id]
                          ? apiKey.key
                          : "••••••••••••••••••••••••••"}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleShowKey(apiKey.id)}
                        className="ml-2"
                      >
                        {showKey[apiKey.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="flex space-x-2 justify-end mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStartEdit(apiKey)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveKey(apiKey.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
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
