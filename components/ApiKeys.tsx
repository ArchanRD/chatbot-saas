"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
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
    <div className="w-full space-y-6 items-center flex flex-wrap">
      <div className="space-y-4 max-w-xl">
        <div>
          <h3 className="text-sm font-medium mb-1">Publishable key</h3>
          <p className="text-sm text-muted-foreground">
            This key should be used in your frontend code.
          </p>
        </div>
        <div className="flex items-center justify-between p-3 border rounded-lg bg-background sm:w-96 w-60">
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
