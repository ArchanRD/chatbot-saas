"use client";
import { Header } from "@/components/header";
import ListOrganisations from "@/components/ListOrganisations";
import { Sidebar } from "@/components/sidebar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const session = useSession();

  if (session.status == "loading") {
    return "loading...";
  }

  if (session.status == "unauthenticated") {
    return redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header username={session.data?.user.name} />
        <ListOrganisations session={session} />
      </div>
      
    </div>
  );
}
