"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Terminal, UserPlus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface InvitedUser {
  email: string;
  status: "sent" | "accepted";
  initials: string;
}

export function InviteModal({ orgId, orgName }) {
  const [email, setEmail] = React.useState("");
  const [invitedUsers] = React.useState<InvitedUser[]>([]);
  const [notification, setNotification] = React.useState({
    message: "",
    type: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().length == 0) {
      setNotification({
        message: "Enter a valid email address",
        type: "error",
      });
      return;
    }

    try {
      const res = await fetch("/api/collaborate/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, orgId, role: "member", orgName }),
      });

      if (!res.ok) {
        const error = await res.json();
        setNotification({ message: error.message, type: "error" });
        return;
      }

      const result = await res.json();
      console.log(result)
      if(result.status == 200){

        setNotification({
          message: result.message,
          type: "success",
        });
      }else{
        setNotification({
          message: result.message,
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus />
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] w-max"
        onCloseAutoFocus={() => setNotification({ message: "", type: "" })}
      >
        <DialogHeader className="font-poppins">
          <DialogTitle>Invite people to your organization</DialogTitle>
          <DialogDescription>
            We'll email them a link to join organization.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 font-poppins">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Enter email address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setNotification({ message: "", type: "" });
              }}
              className="flex-1"
              required
            />
            <Button type="submit">Send invite</Button>
          </form>
          {notification.message && (
            <Alert className="font-poppins">
              <Terminal className="h-4 w-4" />
              <AlertTitle
                className={`text-${
                  notification.type == "error" ? "red" : "green"
                }-500 capitalize`}
              >
                {notification.type}
              </AlertTitle>
              <AlertDescription>{notification.message}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-3">
            {invitedUsers.map((user) => (
              <div
                key={user.email}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                    <span className="text-sm font-medium">{user.initials}</span>
                  </div>
                  <span className="text-sm">{user.email}</span>
                </div>
                <span
                  className={`text-sm ${
                    user.status === "accepted"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {user.status === "accepted"
                    ? "Invite accepted"
                    : "Invite sent"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
