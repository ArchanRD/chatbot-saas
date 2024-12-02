"use client";
import { createOrganisation } from "@/lib/actions";
import { useSession } from "next-auth/react";
import React, { FormEvent, useEffect, useState } from "react";

type Result =
  | {
      message: string;
      error: boolean;
    }
  | string;

const CreateOrganisationForm = () => {
  const session = useSession();

  const [orgName, setOrgName] = useState("");
  const [notification, setNotification] = useState({
    message: "",
    error: false,
  });

  const userID = session.data?.user.id;
  const defaultOrgName = `${session.data?.user.name}'s org`;

  useEffect(() => {
    setOrgName(defaultOrgName);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (orgName.trim().length === 0) {
      setNotification({
        message: "Please enter valid organisation name",
        error: true,
      });
    } else {
      console.log(orgName, userID);

      const result: Result = await createOrganisation(
        orgName,
        userID!,
        "admin"
      );
      if (typeof result == "object" && "error" in result) {
        if (result?.error) {
          setNotification({ message: result.message, error: true });
        }
      } else {
        setNotification({ message: "Org created successfully", error: false });
      }
      console.log(result);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-96 border border-gray-300 p-5 rounded-lg"
      >
        {notification && (
          <p className={notification.error ? "text-red-500" : "text-green-500"}>
            {notification.message}
          </p>
        )}
        <h1 className="text-xl font-bold">Create your organisation</h1>
        <input
          className="border border-gray-500 rounded-lg p-3 my-2"
          type="text"
          name="org_name"
          id=""
          onChange={(e) => {setOrgName(e.target.value); setNotification({message: "", error: false})}}
          placeholder="org name"
          required
        />
        <button
          className="block bg-black text-white py-2 px-4 rounded-lg"
          type="submit"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateOrganisationForm;
