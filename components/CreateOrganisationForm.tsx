"use client";
import { createOrganisation } from "@/lib/actions";
import { useSession } from "next-auth/react";
import React, { FormEvent, useState } from "react";

type Result =
  | {
      message: string;
      error: boolean;
    }
  | string;

const CreateOrganisationForm = () => {
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState({ message: "", error: false });

  const session = useSession();
  const userID = session.data?.user.id;
  const defaultOrgName = `${session.data?.user.name}'s org`

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    console.log(orgName, userID);

    const result: Result = await createOrganisation(orgName, userID!, "admin");
    if (typeof result == "object" && "error" in result) {
      if (result?.error) {
        setError({ message: result.message, error: true });
      }else{
      }
    }
    console.log(result);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-96 border border-gray-300 p-5 rounded-lg"
      >
        {error.error && <p className="text-red-500">{error.message}</p>}
        <h1 className="text-xl font-bold">Create your organisation</h1>
        <input
          className="border border-gray-500 rounded-lg p-3 my-2"
          type="text"
          name="org_name"
          id=""
          defaultValue={defaultOrgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="org name"
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
