"use client";
import { Organisation } from "@/db/schema";
import { fetchAllOrganisations, joinOrganisation } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";

type Notification = {
  message: string;
  type: "error" | "success" | "";
};

const ListOrganisations = () => {
  const session = useSession();

  const [loading, setloading] = useState<boolean>(false);
  const [orgs, setOrgs] = useState<Organisation[]>([]);
  const [notification, setNotification] = useState<Notification>({
    message: "",
    type: "",
  });

  useEffect(() => {
    if (session.status == "loading") {
      console.log(24);
      setloading(true);
    } else if (session.status == "unauthenticated") {
      return redirect("/login");
    } else {
      console.log(26);
      setloading(false);

      // fetch orgs
      const fetchOrgs = async () => {
        try {
          const res = await fetchAllOrganisations();
          setloading(false);
          setOrgs(res);
        } catch (error) {
          console.log("error", error);
        }
      };
      fetchOrgs();
    }
    return () => {};
  }, [session.status]);

  // useEffect(() => {
  //   if (session.status !== "loading") {
  //     console.log(34)
  //     const fetchOrgs = async () => {
  //       try {
  //         const res = await fetchAllOrganisations();
  //         setloading(false);
  //         setOrgs(res);
  //       } catch (error) {
  //         console.log("error", error);
  //       }
  //     };
  //     fetchOrgs();
  //   }
  //   return () => {};
  // }, []);

  const handleJoin = async (e: FormEvent) => {
    e.preventDefault();
    if (session.status === "unauthenticated") {
      console.log("you must be logged in");
      return;
    }
    if (session.status === "authenticated") {
      try {
        const orgId = e.currentTarget["orgId"].value;
        const userId = session.data.user.id;
        const res = await joinOrganisation(orgId, userId);
        console.log(res);
        if (!res?.success) {
          setNotification({ message: res.message, type: "error" });
          return;
        }
        console.log(52);
        setNotification({ type: "success", message: res.message });
      } catch {
        return Error("There is an ERROR");
      }
    } else {
      console.log("Please try again");
    }
  };
  return (
    <div>
      {notification && (
        <p
          className={`text-${
            notification.type === "error" ? "red" : "green"
          }-500`}
        >
          {notification.message}
        </p>
      )}
      {loading == true && <p>Content is loading...</p>}
      <div className="border border-gray-300 p-3 mx-auto w-96 rounded-xl">
        {orgs.map((org) => (
          <div key={org.id} className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">{org.name}</h2>
            <p className="text-gray-600">Plan: {org.plan}</p>
            <p className="text-gray-600">
              Created at: {org.created_at.toDateString()}
            </p>
            <form onSubmit={handleJoin} method="post">
              <input type="hidden" name="orgId" value={org.id} />
              <input type="hidden" name="orgName" value={org.name} />
              <input
                type="hidden"
                name="userId"
                value={session.data?.user.id}
              />
              <button className="bg-green-500 py-1 px-4 text-white rounded-md hover:bg-green-600">
                Join
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListOrganisations;
