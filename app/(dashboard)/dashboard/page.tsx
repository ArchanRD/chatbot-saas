"use client";
import { ApiKeys } from "@/components/ApiKeys";
import ListOrganisations from "@/components/ListOrganisations";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Organisation } from "@/db/schema";
import { toast } from "@/hooks/use-toast";
import { fetchOrganisationByUserId, updateApiKey } from "@/lib/actions";
import { generateApiKey, getOrganisationDetails } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const session = useSession();
  const router = useRouter();
  const [chatbot, setChatbot] = useState([]);
  const [orgDetails, setOrgDetails] = useState<Organisation>();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    const getOrgDetails = async () => {
      const org = await fetchOrganisationByUserId(session.data?.user.id!);
      console.log(org);
      setOrgDetails(org[0]);
      const { error } = getOrganisationDetails();
      if (error) {
        localStorage.setItem("orgId", org[0].id);
        localStorage.setItem("orgName", org[0].name);
      }
    };

    if (session.status === "authenticated") {
      getOrgDetails();
    }

    setChatbot([]);
  }, [session.status, refreshTrigger]);

  const handleCreateApiKey = async () => {
    setButtonLoading(true);
    const apikey = generateApiKey(orgDetails?.id!);
    try {
      const res = await updateApiKey(apikey);
      if (!res.error) {
        toast({
          title: "Success",
          description: "Api Key generated successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Failed",
          description: "Failed to update apikey. Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Failed",
        description: "Failed to update apikey. Please try again",
        variant: "destructive",
      });
    } finally {
      setButtonLoading(false);
      router.refresh();
      setRefreshTrigger((prev) => !prev);
    }
  };

  return (
    <div className="">
      <div className="flex gap-2 flex-wrap">
        <ListOrganisations session={session} />
        {/* chatbot card */}
        <div className="font-poppins p-5 bg-gray-50 flex-1 w-full rounded-xl my-3 mr-3">
          <div className="flex items-center justify-center h-full">
            {chatbot.length == 0 ? (
              <div className="font-poppins flex items-center justify-center flex-col">
                <h1 className="mb-1 font-bold text-gray-800 text-3xl">
                  Create your first chatbot!
                </h1>
                <p className="text-gray-500 w-96 text-center mb-5">
                  You have not created any chatbot yet. Start by creating
                  chatbot.
                </p>
                <Link href={"/dashboard/chatbot"}>
                  <Button size="default" className="text-base">
                    Create chatbot
                  </Button>
                </Link>
              </div>
            ) : (
              "chatbot created"
            )}
          </div>
        </div>
      </div>
      <div className="font-poppins bg-gray-50 rounded-xl m-3 p-5">
        <div>
          <h2 className="text-xl font-semibold mb-1">API keys</h2>
          <p className="text-sm text-muted-foreground">
            Manage API keys for this instance
          </p>
        </div>
        <hr className="my-4" />
        {orgDetails && orgDetails.api_key ? (
          <>
            <ApiKeys apiKey={orgDetails.api_key} />
            <p className="text-sm text-slate-500 mt-5 flex items-center gap-2">
              <TriangleAlert />
              Use the copy button to copy the API key. The key might be
              truncated visually due to line-clamp styling.
            </p>
          </>
        ) : (
          <div className="w-full max-w-xs  space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">Generate API Key</h2>
              <p className="text-sm text-muted-foreground">
                Create a new API key for your application
              </p>
            </div>
            <Button onClick={handleCreateApiKey} className="w-full">
              {buttonLoading ? (
                <Spinner className="text-white" />
              ) : (
                "Generate new api key"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
