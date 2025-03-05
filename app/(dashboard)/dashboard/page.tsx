"use client";
import { ApiKeys } from "@/components/ApiKeys";
import ListOrganisations from "@/components/ListOrganisations";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/hooks/use-toast";
import { fetchOrganisationByUserId, updateApiKey } from "@/lib/actions";
import { generateApiKey } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Org = {
  id: string;
  name: string;
  api_key: string | null;
  plan: string;
  status: string;
  created_at: Date;
};

export default function Dashboard() {
  const session = useSession();
  const router = useRouter();
  const [orgDetails, setOrgDetails] = useState<Org | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getOrgDetails = async () => {
      setLoading(true);
      const org = await fetchOrganisationByUserId(session.data!.user.id);
      setLoading(false);
      if (org.length > 0) {
        setOrgDetails(org[0]);
        if (
          session.data?.user.orgId == null ||
          session.data?.user.orgName == null
        ) {
          await session.update({
            ...session.data,
            orgId: org[0].id,
            orgName: org[0].name,
          });
        }
      } else {
        setOrgDetails(null);
      }
    };

    if (session.status === "authenticated") {
      getOrgDetails();
    }
  }, [session.status, refreshTrigger]);

  const handleCreateApiKey = async () => {
    if (
      orgDetails?.id === null ||
      orgDetails?.id === undefined ||
      orgDetails.id === ""
    ) {
      toast({
        title: "Error",
        description: "You need to create an organisation first",
        variant: "destructive",
      });
      return;
    }

    setButtonLoading(true);

    const apikey = generateApiKey(orgDetails!.id);
    try {
      const res = await updateApiKey(apikey, orgDetails.id);
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
    } catch {
      toast({
        title: "Failed",
        description: "Failed to update apikey. Please try again",
        variant: "destructive",
      });
    } finally {
      setButtonLoading(false);
      router.refresh();
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap">
        {!loading ? (
          <ListOrganisations
            onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
            orgs={orgDetails}
          />
        ) : (
          <div className="m-2 bg-white p-5 rounded-2xl">
            <Skeleton className="h-[40px] w-[650px] rounded-md" />
            <div>
              <Skeleton className="h-[20px] w-[650px] rounded-md mt-2" />
              <Skeleton className="h-[50px] w-[650px] rounded-md mt-5" />
              <div className="grid mt-5 grid-cols-2 grid-rows-3 gap-5">
                <Skeleton className="h-[20px] w-[100px] rounded-md" />
                <Skeleton className="h-[20px] w-[100px] rounded-md" />
                <Skeleton className="h-[20px] w-[100px] rounded-md" />
                <Skeleton className="h-[20px] w-[100px] rounded-md" />
              </div>
            </div>
          </div>
        )}
        {/* chatbot card */}
        <div className="font-poppins p-5 mx-3 my-2 bg-gray-50 flex-1 w-full rounded-2xl">
          <div className="flex items-center justify-center h-full">
            <div className="font-poppins flex items-center justify-center flex-col">
              <p className="border border-slate-400 py-1 px-4 text-black rounded-full text-xs mb-5">
                customized chatbot
              </p>
              <h1 className="mb-1 font-bold text-gray-800 text-3xl">
                View chatbot
              </h1>
              <p className="text-gray-500 md:w-96 text-sm md:text-base text-center mb-5">
                Check out chatbot details. Upload files to provide knowledge
                base to your chatbot
              </p>
              <Link href={"/dashboard/chatbot"}>
                <Button size="default" className="text-base">
                  View chatbot
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="font-poppins bg-gray-50 rounded-2xl m-3 p-5 w-auto">
        <div>
          <h2 className="text-xl font-semibold mb-1">API keys</h2>
          <p className="text-sm text-muted-foreground">
            Manage API keys for this instance
          </p>
        </div>
        <hr className="my-4" />
        {orgDetails && orgDetails.api_key ? (
          <div className="">
            <ApiKeys apiKey={orgDetails.api_key} />
            <p className="text-sm text-slate-500 mt-5 flex items-center gap-2">
              <TriangleAlert />
              Use the copy button to copy the API key. The key might be
              truncated visually due to line-clamp styling.
            </p>
          </div>
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
