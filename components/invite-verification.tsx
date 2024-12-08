"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const InviteVerification = () => {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const [statusMessage, setStatusMessage] = useState("Verifying...");

  useEffect(() => {
    const verifyInvite = async () => {
      if (!token) {
        setStatusMessage("Verification failed. Error with token");
        return;
      }

      try {
        const response = await fetch("/api/collaborate/accept", {
          method: "POST",
          headers: {
            "Content-Type": " application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.status == 200) {
            setStatusMessage("Verification successfull");
          } else {
            setStatusMessage(result.message);
          }
        } else {
          const result = await response.json();
          setStatusMessage(result?.message || "Verification failed!");
        }
      } catch (error) {
        console.error("Error verifying user", error);
        setStatusMessage("An error occurred during verification");
      }
    };
    verifyInvite();
  }, [token]);
  return <div>{statusMessage}</div>;
};

export default InviteVerification;
