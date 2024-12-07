"use client";
import { ChatbotModal } from "@/components/modals/ChatbotModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Organisation } from "@/db/schema";
import { useToast } from "@/hooks/use-toast";
import { fetchOrganisationByUserId } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
  const session = useSession();
  const [loading, setloading] = useState(false);
  const [org, setOrg] = useState<Organisation>();
  const { toast } = useToast();

  useEffect(() => {
    if (session.status == "unauthenticated") {
      return redirect("/login");
    } else if (session.status == "loading") {
      setloading(true);
    } else {
      async function getOrg() {
        try {
          setloading(true);
          const res = await fetchOrganisationByUserId(session.data?.user.id!);
          setloading(false);
          setOrg(res[0]);
        } catch (error) {
          console.log(error);
        }
      }
      getOrg();
    }
  }, [session]);

  if (loading) {
    return "Loading...";
  }

  return (
    <div className="bg-gray-200 h-screen p-3">
      <Card className=" w-[500px] p-10 shadow-none bg-white">
        <div className="font-poppins flex items-center justify-center flex-col">
          <h1 className="mb-1 font-bold text-gray-800 text-3xl">
            Create your first chatbot!
          </h1>
          <p className="text-gray-500 w-96 text-center mb-5">
            You have not created any chatbot yet. Start by creating chatbot.
          </p>
          <ChatbotModal orgName={org?.name} orgId={org?.id} />
        </div>
      </Card> 
    </div>
  );
};

export default page;
