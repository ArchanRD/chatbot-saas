"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { updateCorsDomain } from "@/lib/actions";
import { useSession } from "next-auth/react";

export function ChatbotCors({ info }: { info: string }) {
  const [domain, setDomain] = useState<string>(info);
  const [isEditing, setIsEditing] = useState(false);
  const { data } = useSession();

  const saveDomain = async () => {
    if (!domain) {
      toast({
        title: "Domain required",
        description: "Please enter a domain",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      const url = new URL(domain);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        toast({
          title: "Invalid protocol",
          description: "URL must start with http:// or https://",
          variant: "destructive",
        });
        return;
      }
      const res = await updateCorsDomain(data!.user!.orgId!, domain);
      if (res.error) {
        throw new Error(res.message);
      }

      setIsEditing(false);
      toast({
        title: "Domain saved",
        description: `${domain} has been set as the allowed origin`,
      });
    } catch (error) {
      let message = "Unknown error";
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === "string") {
        message = error;
      }
      toast({
        title: "Invalid URL",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">CORS Configuration</h2>
        <p className="text-sm text-gray-500">
          Configure which domain can access your chatbot. Add the domain where
          your chatbot will be embedded.
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-yellow-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800">Note</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Do not add a backslash(/) at the end of the domain. Your domain
              should be like{" "}
              <span className="font-medium">https://example.com</span>
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder={domain == "" ? "https://example.com" : domain}
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="flex-1"
            disabled={!isEditing}
          />
          <Button
            onClick={isEditing ? saveDomain : () => setIsEditing(true)}
            className="gap-1"
          >
            {isEditing ? "Save Changes" : "Edit Domain"}
          </Button>
        </div>
      </div>
    </div>
  );
}
