"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { Skeleton } from "./ui/skeleton";

export function Header() {
  const session = useSession();
  const handleLogout = async () => {
    localStorage.removeItem("orgId");
    localStorage.removeItem("orgName");
    localStorage.removeItem("chatbotId");

    await signOut();
  };
  return (
    <header className="h-16 sticky top-0 border-b bg-white px-4 flex items-center justify-between font-inter">
      <div className="flex items-center flex-1 gap-4">
        <div className="font-medium">
          <div className="text-sm text-gray-500">Welcome,</div>
          {session.status === "loading" ? (
            <Skeleton className="h-5 w-16" />
          ) : (
            <div className="capitalize">{session.data?.user.name}</div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant={"destructive"} onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
