"use client";
import { Building2, X } from "lucide-react";
import React, { FormEvent, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

type Notification = {
  message: string;
  type: "error" | "success" | "";
};

const CreateOrganisationModal = ({ onClose, onRefresh }) => {
  const session = useSession();
  const [orgName, setorgName] = useState("");
  const [notification, setnotification] = useState<Notification>({
    message: "",
    type: "",
  });

  const createOrg = async (e: FormEvent) => {
    e.preventDefault();
    if (orgName.trim().length === 0) {
      setnotification({
        message: "Please enter a valid organisation name",
        type: "error",
      });
      return;
    }
    try {
      //generate api key
      // const result = await createOrganisation(orgName, session.data?.user.id!);

      const result = await fetch("/api/create-organisation", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          orgName: orgName,
          userId: session.data?.user?.id,
        }),
      }).then((res) => res.json());

      console.log(result);

      await session.update({
        orgId: result.orgId,
        orgName: result.orgName
      });

      setnotification({ message: result.message, type: "success" });
      onClose();
      onRefresh();
      toast({
        title: "Success",
        description: result.message,
      });
    } catch (error) {
      console.log(error);
      setnotification({
        message: "An error occured while creating the organisation",
        type: "error",
      });
    }
  };

  return (
    <div className="bg-black/40 w-screen h-screen fixed top-0 left-0 font-poppins">
      <div className="bg-gray-100 sm:w-[400px] w-64 mx-auto fixed top-1/3 left-1/2 md:-translate-x-1/3 md:-translate-y-1 sm:-translate-x-44 -translate-x-28 -translate-y-1/4 rounded-xl p-7">
        <div className="flex justify-end">
          <X
            onClick={onClose}
            className="cursor-pointer hover:bg-gray-200 active:bg-gray-300 rounded-lg p-2 self-start"
            width={40}
            height={40}
          />
        </div>
        <div className="flex md:flex-nowrap flex-wrap gap-3 items-center mb-5">
          <Building2 width={40} height={40} />
          <h1 className="capitalize font-bold font-poppins text-gray-800 text-2xl">
            Create a new organisation
          </h1>
        </div>
        <form className="py-5" method="post" onSubmit={createOrg}>
          <div>
            <label
              htmlFor="orgname"
              className="font-poppins font-medium text-lg"
            >
              Enter the organisation name:
            </label>
            <Input
              onChange={(e) => {
                setorgName(e.target.value);
                setnotification({ message: "", type: "" });
              }}
              id="orgname"
              className="font-poppins border border-gray-400 mt-2"
              placeholder="Example: John's Organisation"
              required
            />
          </div>
          {notification.message && (
            <p
              className={`font-medium capitalize text-${
                notification.type == "error" ? "red" : "green"
              }-500 mt-1`}
            >
              {notification.message}!
            </p>
          )}
          <Button type="submit" className="mt-5 capitalize">
            Create organisation
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrganisationModal;
