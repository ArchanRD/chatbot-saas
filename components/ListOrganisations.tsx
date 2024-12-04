"use client";
import { Collaborator, Organisation } from "@/db/schema";
import {
  fetchOrganisationByUserId,
  fetchOrgDetailsById,
  fetchOrgsWithCollaboration,
} from "@/lib/actions";
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
  const [orgWithCollaboration, setOrgWithCollaboration] = useState<
    Organisation[]
  >([]);

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
          const [org, orgWithCollab] = await Promise.all([
            await fetchOrganisationByUserId(session.data.user.id),
            await fetchOrgsWithCollaboration(session.data.user.email),
          ]);
          setloading(false);
          setOrgs(org);

          if (orgWithCollab.length > 0) {
            const res = await fetchOrgDetailsById(orgWithCollab[0].org_id!);
            setOrgWithCollaboration(res);
          }
        } catch (error) {
          setloading(false);
          console.error("Failed to fetch organisations:", error);
        }
      };
      fetchOrgsDetails();
    }
    return () => {};
  }, [session.status]);

  if (loading) {
    return (
      <div className="m-2 bg-white p-5 rounded-2xl flex items-center justify-center">
        <p className="">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="bg-white p-8 rounded-2xl">
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
      {/* List org with collaboration  */}
      <div className="my-3 bg-white p-8 rounded-2xl">
        {orgWithCollaboration.length > 0 && (
          <div className="font-poppins">
            <h1 className="capitalize mb-5 font-bold text-gray-800 text-3xl">
              Your are joined to an organisation
            </h1>
            <hr />
            <OrganisationCard org={orgWithCollaboration[0]} />
            <hr />
          </div>
        )}
      </div>
    </div>
  );
};

export default ListOrganisations;
