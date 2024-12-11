"use client";

import { useState } from "react";
import { Copy, Check, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ApiKeys({ apiKey }) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="w-full space-y-6 flex items-center justify-evenly">
      <div className="max-w-2xl">
        <Card className="bg-zinc-900 border-0 text-white">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Quick Copy</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                onClick={() => handleCopy(`CONVERSY_API_KEY=${apiKey}`, "env")}
              >
                {copied === "env" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-zinc-400">
              Choose your framework and paste the code into your environment
              file.
            </p>
            <div className="bg-zinc-900 rounded-md p-3 font-mono text-sm">
              <div className="flex items-center gap-2 text-zinc-400">
                <span>.env.local</span>
              </div>
              <div className="mt-2 space-y-1 line-clamp-1">
                <div className="text-zinc-100 ">CONVERSY_API_KEY={apiKey}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4 max-w-xl">
        <div>
          <h3 className="text-sm font-medium mb-1">Publishable key</h3>
          <p className="text-sm text-muted-foreground">
            This key should be used in your frontend code.
          </p>
        </div>
        <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
          <code className="text-sm text-muted-foreground line-clamp-1">
            {apiKey}
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleCopy(apiKey, "CONVERSY_API_KEY")}
          >
            {copied === "CONVERSY_API_KEY" ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
