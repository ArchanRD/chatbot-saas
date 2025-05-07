"use client";
import { FileText, Globe, Info, Settings } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { ChatbotModal } from "./modals/ChatbotModal";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tab";
import { Chatbot } from "@/db/schema";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import {
  downloadFile,
  fetchChatbotDetailsByOrgId,
  getFileByChatbotId,
  removeFileById,
} from "@/lib/actions";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { UploadFile } from "./UploadFile";
import { Input } from "./ui/input";
const chatbotSliderOptions = [
  {
    name: "Info",
    icon: <Info className="w-4 h-4 mr-2" />,
  },
  {
    name: "Files",
    icon: <FileText className="w-4 h-4 mr-2" />,
  },
  {
    name: "CORS",
    icon: <Globe className="w-4 h-4 mr-2" />,
  },
  {
    name: "Settings",
    icon: <Settings className="w-4 h-4 mr-2" />,
  },
];

type File = {
  id: string | null;
  path: string | null;
  name: string | null;
  type: string | null;
};

type OrgDetails = {
  id: string;
  name: string;
}

const ChatbotConfiguration = () => {
  const session = useSession();
  const [activeTab] = useState(chatbotSliderOptions[0]);
  const [downloadLoading, setdownloadLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [loading, setloading] = useState(false);
  const [chatbot, setChatbot] = useState<Chatbot>();
  const [orgDetails, setOrgDetails] = useState<OrgDetails>();
  const [uploadFileOpen, setUploadFileOpen] = useState(false);
  const [corsInput, setCorsInput] = useState<string>("");
  const router = useRouter();
  const [file, setFile] = useState<File>({
    id: null,
    path: null,
    name: null,
    type: null,
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function getChatbotDetails() {
      const orgId = session.data?.user.orgId;
      const orgName = session.data?.user.orgName;
      setOrgDetails({ id: orgId!, name: orgName! });

      try {
        const res = await fetchChatbotDetailsByOrgId(orgId!);
        if (res.length > 0) {
          setChatbot(res[0]);
          if (session.data?.user.chatbotId == null) {
            await session.update({
              ...session.data,
              chatbotId: res[0].id,
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    async function getDocument() {
      if (chatbot === undefined) {
        return;
      }
      try {
        const data = await getFileByChatbotId(chatbot!.id);
        if (data.length > 0) {
          setFile({
            id: data[0].id,
            name: data[0].name,
            path: data[0].url,
            type: data[0].type,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (session.status === "unauthenticated") {
      return router.push("/login");
    } else if (session.status === "loading") {
      setloading(true);
    } else if (session.status === "authenticated") {
      getChatbotDetails();
      getDocument();
      setloading(false);
    }
  }, [session, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleFileDownload = async () => {
    setdownloadLoading(true);
    try {
      const response = await downloadFile(file.path!);
      console.log(response);
      const url = URL.createObjectURL(response.data!);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name!;
      a.click();
    } catch (error) {
      console.log(error);
    } finally {
      setdownloadLoading(false);
    }
  };

  const handleFileRemove = async () => {
    setRemoveLoading(true);
    try {
      const response = await removeFileById(file.id!, file.path!);
      if (response.error) {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: response.message,
      });

      setFile({ id: null, name: null, path: null, type: null });
      handleRefresh();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Internal error occurred",
        variant: "destructive",
      });
    } finally {
      setRemoveLoading(false);
    }
  };

  const addCorsDomain = async() => {
    if (corsInput !== "" && corsInput !== undefined && corsInput.trim().length > 0){
      console.log("add cors")
    }
  }

  return (
    <Card className="w-full font-inter shadow-none border border-gray-300">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Configurations</CardTitle>
      </CardHeader>
      <Tabs defaultValue={activeTab.name.toLowerCase()} className="w-ful">
        <div className="border-b">
          <div className="px-4 sm:px-6 overflow-x-auto">
            <TabsList className="h-10 w-max flex flex-nowrap mt-1 mb-2">
              {chatbotSliderOptions.map((option, index) => (
                <TabsTrigger
                  key={index}
                  value={option.name.toLowerCase()}
                  className="flex items-center whitespace-nowrap"
                >
                  {option.icon}
                  {option.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
        <CardContent className="p-4 sm:p-6 bg-gray-50 rounded-b-xl">
          <TabsContent value="info" className="mt-0">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-40 mb-2" />
                <div className="grid gap-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div className="space-y-2" key={i}>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : chatbot?.id ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Chatbot Information</h3>
                <div className="grid gap-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Name</h4>
                      <p className="text-sm">{chatbot?.name}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Created On</h4>
                      <p className="text-sm">
                        {chatbot?.created_at.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Description</h4>
                      <p className="text-sm">{chatbot?.description}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Welcome message</h4>
                      <p className="text-sm">{chatbot?.welcome_mesg}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Card className="w-72 sm:w-[500px] sm:p-10 p-4 shadow-none bg-white">
                <div className="font-poppins flex sm:items-center justify-center flex-col">
                  <h1 className="mb-1 font-bold text-gray-800 text-xl sm:text-3xl">
                    Create your first chatbot!
                  </h1>
                  <p className="text-gray-500 text-sm sm:text-base w-auto sm:w-96 sm:text-center mb-5">
                    You have not created any chatbot yet. Start by creating
                    chatbot.
                  </p>
                  <ChatbotModal
                    orgName={orgDetails?.name}
                    orgId={orgDetails?.id}
                  />
                </div>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="files" className="mt-0">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-52 mb-2" />
                <div className="border rounded-md p-4 mt-4">
                  <div className="flex items-center gap-2 mb-5 flex-wrap max-w-xl justify-between">
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-10 w-10 rounded-lg mr-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">File Management</h3>
                <p className="text-gray-500">
                  Upload, download, and manage files associated with your chatbot.
                </p>
                <div className="border rounded-md p-4 mt-4">
                  {file.id ? (
                    <div>
                      <div className="flex items-center gap-2 mb-5 flex-wrap max-w-xl justify-between">
                        <div className="flex items-center gap-1">
                          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <FileText />
                          </div>
                          <h2 className="break-all">{file.name}</h2>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            onClick={handleFileDownload}
                            variant={"default"}
                            disabled={downloadLoading}
                          >
                            {downloadLoading ? (
                              <Spinner className="text-white" />
                            ) : (
                              "Download"
                            )}
                          </Button>
                          <Button
                            onClick={handleFileRemove}
                            variant={"destructive"}
                          >
                            {removeLoading ? (
                              <Spinner className="text-white" />
                            ) : (
                              "Remove"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-center text-gray-500">
                      No files uploaded yet <br />
                      <Button
                        variant={"outline"}
                        onClick={() => setUploadFileOpen(true)}
                        className="mt-2"
                      >
                        Upload
                      </Button>
                      <UploadFile
                        chatbotId={chatbot?.id}
                        onOpenChange={setUploadFileOpen}
                        onRefresh={handleRefresh}
                        open={uploadFileOpen}
                        orgDetails={orgDetails}
                        key={1}
                      />
                    </p>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="cors" className="mt-0">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-64 mb-2" />
                <div className="grid gap-4 mt-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-10 w-52" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">CORS Settings</h3>
                <p className="text-gray-500">
                  Configure Cross-Origin Resource Sharing (CORS) settings for your
                  API endpoints. Control which domains can access your resources.
                </p>
                <div className="grid gap-4 mt-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Allowed Origins</h4>
                    <p className="text-sm">*</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Add domain</h4>
                    <div className="flex items-center gap-2">
                      <Input
                        className="font-inter max-w-xs"
                        placeholder="e.g conversy.archan.dev"
                        onChange={(e)=>setCorsInput(e.target.value)}
                      />
                      <Button
                        variant={"ghost"}
                        className="border border-gray-300 hover:bg-gray-300"
                        onClick={addCorsDomain}
                      >
                        Add domain
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="settings" className="mt-0">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-64 mb-2" />
                <div className="grid gap-4 mt-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Project Settings</h3>
                <p className="text-gray-500">
                  Manage project settings including environment variables,
                  deployment configurations, and access controls.
                </p>
                <div className="grid gap-4 mt-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Environment</h4>
                    <p className="text-sm">Production</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Framework</h4>
                    <p className="text-sm">Next.js</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default ChatbotConfiguration;

