"use client";
import { ChatbotModal } from "@/components/modals/ChatbotModal";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchChatbotDetailsByOrgId } from "@/lib/actions";
import { getOrganisationDetails } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Chatbot } from "@/db/schema";
import ChatbotCard from "@/components/ChatbotCard";
import { UploadFile } from "@/components/UploadFile";
import { Files } from "lucide-react";

type OrgDetails = {
  orgId: string;
  orgName: string;
};

const Page = () => {
  const session = useSession();
  const [loading, setloading] = useState(false);
  const [chatbot, setChatbot] = useState<Chatbot>();
  const [isOrgIdSet, setIsOrgIdSet] = useState<boolean>(true);
  const [orgDetails, setOrgDetails] = useState<OrgDetails>();
  const [uploadFileOpen, setUploadFileOpen] = useState(false);

  useEffect(() => {
    const { orgId, orgName, error } = getOrganisationDetails();
    if (error || !orgId || !orgName) {
      setIsOrgIdSet(false);
      return;
    } else {
      setOrgDetails({ orgId: orgId, orgName: orgName});
    }
    if (session.status == "unauthenticated") {
      return redirect("/login");
    } else if (session.status == "loading") {
      setloading(true);
    } else {
      async function getOrg() {
        try {
          setloading(true);
          const res = await fetchChatbotDetailsByOrgId(orgId!);
          localStorage.setItem("chatbotId", res[0].id);
          setChatbot(res[0]);
          setloading(false);
        } catch (error) {
          console.log(error);
        }
      }
      getOrg();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="m-2 flex flex-col items-center h-72 justify-center bg-white p-5 rounded-2xl max-w-xl">
        <Skeleton className="h-[60px] w-[450px] rounded-md" />
        <Skeleton className="h-[15px] w-[350px] mt-2 rounded-md" />
        <Skeleton className="h-[15px] w-[350px] mt-2 rounded-md" />
        <Skeleton className="h-[15px] w-[350px] mt-2 rounded-md" />
      </div>
    );
  }

  if (!isOrgIdSet) {
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
          <Button onClick={() => redirect("/dashboard")}>
            Visit dashboard
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="bg-gray-200 h-screen p-3">
      {chatbot ? (
        <div className="p-3 flex-1">
          <ChatbotCard chatbot={chatbot} />
        </div>
      ) : (
        <Card className=" w-[500px] p-10 shadow-none bg-white">
          <div className="font-poppins flex items-center justify-center flex-col">
            <h1 className="mb-1 font-bold text-gray-800 text-3xl">
              Create your first chatbot!
            </h1>
            <p className="text-gray-500 w-96 text-center mb-5">
              You have not created any chatbot yet. Start by creating chatbot.
            </p>
            <ChatbotModal orgName={orgDetails?.orgName} orgId={orgDetails?.orgId} />
          </div>
        </Card>
      )}

      <div className="p-3">
        <Card className="w-full max-w-xl !rounded-2xl !border-none !shadow-none">
          <CardHeader className="font-poppins flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="">
              <div className="flex items-center space-x-2">
                <Files fontVariant="outline" className="text-xs font-normal" />
                <h1 className="font-medium">Documents</h1>
              </div>
            </div>
          </CardHeader>
          <hr />
          <CardContent className="space-y-4 p-6 font-poppins">
            <p className="text-sm text-muted-foreground">
              Upload file containing knowledge to provide context to your
              chatbot. Accepted file types are txt and pdf.
            </p>
            <Button onClick={() => setUploadFileOpen(true)}>Upload file</Button>
            <UploadFile
              open={uploadFileOpen}
              onOpenChange={setUploadFileOpen}
              key={1}
              orgDetails={orgDetails}
              chatbotId={chatbot?.id}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
