/* eslint-disable @typescript-eslint/no-non-null-assertion */
"use client";

import { useEffect, useState } from "react";
import { Bot, Globe, BookOpen, Info, Hammer, Check, Copy, Sparkles, Palette } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ChatbotInfo } from "@/components/chatbot/chatbot-info";
import { ChatbotCors } from "@/components/chatbot/chatbot-cors";
import { ChatbotKnowledge } from "@/components/chatbot/chatbot-knowledge";
import { ChatbotCustomization } from "@/components/chatbot/chatbot-customization";
import { ChatbotTheme } from "@/components/chatbot/chatbot-theme";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  fetchChatbotDetailsByOrgId,
  fetchOrgDetailsById,
  getFileByChatbotId,
} from "@/lib/actions";
import { Chatbot, Files, Organisation } from "@/db/schema";

// Define the ChatbotWithTheme type to match what ChatbotTheme component expects
type ChatbotWithTheme = Chatbot & {
  theme?: {
    primary_color?: string;
    secondary_color?: string;
    font_size?: string;
    border_radius?: number;
    chat_position?: string;
  };
}
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChatbotModal } from "@/components/modals/ChatbotModal";
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";

const tabs = [
  {
    id: "info",
    label: "Info",
    icon: Info,
  },
  {
    id: "cors",
    label: "CORS",
    icon: Globe,
  },
  {
    id: "knowledge",
    label: "Knowledge",
    icon: BookOpen,
  },
  {
    id: "integration",
    label: "Integration",
    icon: Hammer,
  },
  {
    id: "customization",
    label: "Customization",
    icon: Sparkles,
  },
  {
    id: "theme",
    label: "Theme",
    icon: Palette,
  },
];

export default function ChatbotPage() {
  const [activeTab, setActiveTab] = useState("info");
  const [chatbotDetails, setChatbotDetails] = useState<ChatbotWithTheme>();
  const [orgDetails, setOrgDetails] = useState<Organisation>();
  const [knowledgeBase, setKnowledgeBase] = useState<Files>();
  const [isLoading, setIsLoading] = useState(false);
  const { data, status, update } = useSession();
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [copied, setCopied] = useState(false);
  const integrationCode = '<script src="' + process.env.NEXT_PUBLIC_APP_URL + '/widget/chatbot.js" data-api-key="YOUR_API_KEY"></script>';
  
  console.log(isLoading)
  useEffect(() => {
    if (status === "authenticated") {
      fetchChatbotDetails();
      fetchOrgDetails();
      getFile();
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, data, refreshTrigger]);

  const fetchChatbotDetails = async () => {
    const chatbotDetails = await fetchChatbotDetailsByOrgId(data!.user!.orgId!);
    if (chatbotDetails.length > 0) {
      // Convert the theme from unknown to the expected type
      const chatbotWithTheme: ChatbotWithTheme = {
        ...chatbotDetails[0],
        theme: chatbotDetails[0].theme as ChatbotWithTheme['theme']
      };
      setChatbotDetails(chatbotWithTheme);
      
      // update chatbotId in session if null
      if (data?.user.chatbotId == null) {
        await update({
          ...data,
          chatbotId: chatbotDetails[0].id,
        });
      }
    }
  };

  const fetchOrgDetails = async () => {
    const orgDetails = await fetchOrgDetailsById(data!.user!.orgId!);
    setOrgDetails(orgDetails[0]);
  };

  const getFile = async () => {
    const file = await getFileByChatbotId(data!.user!.chatbotId!);
    if (file.length > 0) {
      setKnowledgeBase(file[0]);
    }
  };
  if (status === "loading") {
    return "loading...";
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(integrationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // redirect on org page if Org not created or id not set in session
  if (data?.user!.orgId == undefined) {
    return (
      <Dialog open>
        <DialogContent className="sm:max-w-[425px] font-poppins">
          <DialogHeader>
            <DialogTitle className="text-2xl text-red-600">
              Your organisation id is not set
            </DialogTitle>
            <DialogDescription className="">
              Visit the dashboard page to set automatically. If you have not
              created the organisation then create and try again.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => router.push("/dashboard")}>
            Visit dashboard
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  if (chatbotDetails?.id) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl font-inter">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-3 rounded-lg">
              <Bot className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Chatbot Details</h1>
              <p className="text-gray-500">
                Configure and manage your chatbot.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <nav className="flex space-x-1 rounded-lg bg-gray-100 p-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
                  "min-w-[100px] flex-shrink-0 relative z-10",
                  activeTab === tab.id
                    ? "bg-white text-gray-800 shadow"
                    : "text-gray-600 hover:text-gray-800"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {tab.label === "CORS" && orgDetails?.cors_domain === "" && (
                  <span className="bg-red-500 h-2 w-2 rounded-full absolute right-2 top-2"></span>
                )}
                {tab.label === "Knowledge" && !knowledgeBase?.url && (
                  <span className="bg-red-500 h-2 w-2 rounded-full absolute right-1 top-2"></span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          {activeTab === "info" && <ChatbotInfo info={chatbotDetails} />}
          {activeTab === "cors" && (
            <ChatbotCors info={orgDetails!.cors_domain!} />
          )}
          {activeTab === "knowledge" && (
            <ChatbotKnowledge
              knowledgeBase={knowledgeBase}
              onRefresh={() => {
                setKnowledgeBase(undefined); // Optimistically clear file
                setRefreshTrigger((prev) => prev + 1);
              }}
            />
          )}
          {activeTab === "integration" && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="">
                    <pre className=" rounded-2xl  overflow-x-auto">
                      <SyntaxHighlighter language={"HTML"} style={atomOneLight}>
                        {integrationCode}
                      </SyntaxHighlighter>
                    </pre>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className=""
                      >
                        {copied ? (<>
                          <h2>Copied</h2>
                          <Check className="h-4 w-4 text-green-500" />
                        </>
                        ) : (<>
                        <h2>Copy</h2>
                          <Copy className="h-4 w-4" />
                        </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "customization" && (
            <ChatbotCustomization 
              info={chatbotDetails} 
              onUpdate={async (data) => {
                try {
                  setIsLoading(true);
                  
                  // Make API call to update the chatbot customization
                  const response = await fetch(`/api/chatbots/${chatbotDetails?.id}`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                  });
                  
                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to update chatbot customization");
                  }
                  
                  // Log success message
                  console.log("Chatbot customization updated successfully:", data);
                  
                  // After successful update, refresh the chatbot details
                  await fetchChatbotDetails();
                  
                  // Show success notification
                  toast({
                    title: "Success",
                    description: "Chatbot customization updated successfully",
                    variant: "default"
                  });
                } catch (error) {
                  console.error("Error updating chatbot customization:", error);
                  toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Failed to update chatbot customization",
                    variant: "destructive"
                  });
                } finally {
                  setIsLoading(false);
                }
              }}
            />
          )}
          {activeTab === "theme" && (
            <ChatbotTheme 
              info={chatbotDetails}
              onUpdate={async (data) => {
                try {
                  setIsLoading(true);
                  
                  // Make API call to update the chatbot theme
                  const response = await fetch(`/api/chatbots/${chatbotDetails?.id}`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                  });
                  
                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to update chatbot theme");
                  }
                  
                  // Log success message
                  console.log("Chatbot theme updated successfully:", data);
                  
                  // After successful update, refresh the chatbot details
                  await fetchChatbotDetails();
                  
                  // Show success notification
                  toast({
                    title: "Success",
                    description: "Chatbot theme updated successfully",
                    variant: "default"
                  });
                } catch (error) {
                  console.error("Error updating chatbot theme:", error);
                  toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Failed to update chatbot theme",
                    variant: "destructive"
                  });
                } finally {
                  setIsLoading(false);
                }
              }}
            />
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl font-inter">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-3 rounded-lg">
              <Bot className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Chatbot Details</h1>
              <p className="text-gray-500">
                Configure and manage your chatbot.
              </p>
            </div>
          </div>
        </div>
        <div className="h-0.5 w-full bg-gray-300"></div>
        <Card className="w-full sm:p-10 p-4 shadow-none border-none bg-transparent md:ml-6">
          <div className="font-inter flex sm:items-start justify-center flex-col">
            <h1 className="mb-1 font-bold text-gray-800 text-lg sm:text-xl lg:text-2xl">
              Create your first chatbot!
            </h1>
            <p className="text-gray-500 text-sm sm:text-base w-auto sm:w-96 mb-5">
              You have not created any chatbot yet. Start by creating chatbot.
            </p>
            <ChatbotModal orgName={orgDetails?.name} orgId={orgDetails?.id} />
          </div>
        </Card>
      </div>
    );
  }
}
