"use client";
import { Organisation } from "@/db/schema";
import { fetchOrganisationByUserId } from "@/lib/actions";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import CreateOrganisationModal from "./CreateOrganisationModal";
import OrganisationCard from "./OrganisationCard";

const ListOrganisations = ({ session }) => {
  const [loading, setloading] = useState<boolean>(false);
  const [orgs, setOrgs] = useState<Organisation[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (session.status == "loading") {
      setloading(true);
    } else if (session.status == "unauthenticated") {
      return redirect("/login");
    } else {
      setloading(false);

      // fetch user's orgs
      const fetchOrgsDetails = async () => {
        try {
          setloading(true);
          const res = await fetchOrganisationByUserId(session.data.user.id);
          console.log(38, res);
          setloading(false);
          setOrgs(res);
        } catch (error) {
          console.log(error);
        }
      };
      fetchOrgsDetails();
    }
    return () => {};
  }, [session.status]);

  // const handleJoin = async (e: FormEvent) => {
  //   e.preventDefault();
  //   if (session.status === "unauthenticated") {
  //     return redirect("/login");
  //   }

  //   if (session.status === "authenticated") {
  //     try {
  //       const orgId = e.currentTarget["orgId"].value;
  //       const userId = session.data.user.id;
  //       const res = await joinOrganisation(orgId, userId);
  //       if (!res?.success) {
  //         setNotification({ message: res.message, type: "error" });
  //         return;
  //       }
  //       setNotification({ type: "success", message: res.message });
  //     } catch {
  //       return Error("There is an ERROR");
  //     }
  //   } else {
  //     console.log("Please try again");
  //   }
  // };

  if (loading) {
    return (
      <div className="m-2 bg-white p-5 rounded-2xl flex items-center justify-center">
        <p className="">Loading...</p>
      </div>
    );
  }

  return (
    <div className="m-2 bg-white p-8 rounded-2xl">
      {orgs.length === 0 ? (
        <div className="font-poppins flex items-center justify-center flex-col">
          <h1 className="mb-1 font-bold text-gray-800 text-3xl">
            Create your organisation
          </h1>
          <p className="text-gray-500 w-96 text-center mb-5">
            You have not created any organisation yet. Start by creating
            organisation and invite collaborators.
          </p>
          <Button
            onClick={() => setShowModal(true)}
            size="default"
            className="text-base"
          >
            <Plus className="mr-1 h-4 w-4" />
            Create organisation
          </Button>
        </div>
      ) : (
        <div className="font-poppins">
          <h1 className="capitalize mb-5 font-bold text-gray-800 text-3xl">
            Your organisation
          </h1>
          <hr />
          <OrganisationCard org={orgs[0]} />
          <hr />
        </div>
      )}
      {showModal && (
        <CreateOrganisationModal
          session={session}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ListOrganisations;
