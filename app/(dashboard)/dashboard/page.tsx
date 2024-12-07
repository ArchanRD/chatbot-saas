"use client";
import { Header } from "@/components/header";
import ListOrganisations from "@/components/ListOrganisations";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const session = useSession();
  const [chatbot, setChatbot] = useState([]);

  if (session.status == "loading") {
    return "loading...";
  }

  if (session.status == "unauthenticated") {
    return redirect("/login");
  }

  return (
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
                You have not created any chatbot yet. Start by creating chatbot.
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
  );
}
