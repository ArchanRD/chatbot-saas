"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const InvitePage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isVerifying, setisVerifying] = useState(false);

  useEffect(() => {
    const verifyInvite = async () => {
      if (!token) return;
      setisVerifying(true);
      try {
        await fetch("/api/collaborate/accept", {
          method: "POST",
          headers: {
            "Content-Type": " application/json",
          },
          body: JSON.stringify({token}),
        }).then(res=>res.json()).then(result=>console.log(result)) 
      } catch (error) {
        console.error("25 - Error verifying user", error);
      }
    };
    verifyInvite();
  }, [token]);
  return <div>{isVerifying ? "Verifying..." : "Verified!"}</div>;
};

export default InvitePage;
