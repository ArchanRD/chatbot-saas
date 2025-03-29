"use client";
import { useState } from "react";
import { Check, Copy, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const frameworks = [
  {
    name: "React.js",
    language: "jsx",
    code: `
    <script>
      window.__CHAT_CONFIG__ = {
        apiKey: 'YOUR_API_KEY',
        theme: {
          primary: '#2563eb',
          secondary: '#ffffff',
          text: '#1f2937',
          bubble: '#2563eb'
        },
        position: 'bottom-right',
        title: 'Chat with us',
        placeholder: 'Type your message...'
      };
    </script>
    <script src="${process.env.NEXT_PUBLIC_APP_URL}/widget/chatbot.js" async ></script>
    <script src="${process.env.NEXT_PUBLIC_APP_URL}/widget/chat-init.js" async ></script>`,
    instruction: "Paste this in the <head> of your index.html",
  },
  {
    name: "Next.js",
    language: "tsx",
    code: `
    import Script from "next/script";


    <script
      dangerouslySetInnerHTML={{
            __html: \`
              window.__CHAT_CONFIG__ = {
                apiKey: '\${process.env.NEXT_PUBLIC_CHAT_API_KEY || ""}',
                theme: {
                  primary: '#2563eb',
                  secondary: '#ffffff',
                  text: '#1f2937',
                  bubble: '#2563eb'
                },
                position: 'bottom-right',
                title: 'Chat with us',
                placeholder: 'Type your message...'
              };
            \`,
          }}
        />
        <script src="${process.env.NEXT_PUBLIC_APP_URL}/widget/chatbot.js" async ></script>
    <script src="${process.env.NEXT_PUBLIC_APP_URL}/widget/chat-init.js" async ></script>`,
    instruction: "Paste this in root layout file in the app directory",
  },
  {
    name: "HTML",
    language: "html",
    code: `
    <script>
      window.__CHAT_CONFIG__ = {
        apiKey: 'YOUR_API_KEY',
        theme: {
          primary: '#2563eb',
          secondary: '#ffffff',
          text: '#1f2937',
          bubble: '#2563eb'
        },
        position: 'bottom-right',
        title: 'Chat with us',
        placeholder: 'Type your message...'
      };
    </script>
    <script src="${process.env.NEXT_PUBLIC_APP_URL}/widget/chatbot.js" async ></script>
    <script src="${process.env.NEXT_PUBLIC_APP_URL}/widget/chat-init.js" async ></script>`,
    instruction: "Paste this in the <head> of your index.html",
  },
];

const Page = () => {
  const [activeFramework, setActiveFramework] = useState(frameworks[0]);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(activeFramework.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl font-poppins">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Integration</h1>
          <p className="text-sm text-gray-500">
            Select a framework to view the integration
          </p>
        </div>
      </div>

      <div className="border-b mb-6">
        <div className="flex -mb-px space-x-8 border-b  border-gray-300">
          {frameworks.map((framework) => (
            <button
              key={framework.name}
              className={cn(
                "pb-4 px-1",
                activeFramework.name === framework.name
                  ? "border-b border-blue-600 text-blue-600 font-medium"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              onClick={() => setActiveFramework(framework)}
            >
              {framework.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 flex items-start gap-2 text-white mb-6 p-4 rounded-2xl">
        <Info />
        <div className="">
          <h1 className="font-bold text-xl mb-3">Instruction</h1>
          {activeFramework.instruction}
        </div>
      </div>

      <div className="relative">
        <div className="absolute right-4 top-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 w-8 "
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <pre className="p-4 rounded-2xl bg-[#1d1f21]  overflow-x-auto">
          <SyntaxHighlighter
            language={activeFramework.language}
            style={atomDark}
          >
            {activeFramework.code}
          </SyntaxHighlighter>
        </pre>
      </div>
    </div>
  );
};

export default Page;
