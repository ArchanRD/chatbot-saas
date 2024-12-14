"use client";
import { Organisation } from "@/db/schema";
import { fetchOrganisationByUserId } from "@/lib/actions";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import CreateOrganisationModal from "./CreateOrganisationModal";
import OrganisationCard from "./OrganisationCard";
import { Skeleton } from "./ui/skeleton";
import { getOrganisationDetails } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const ListOrganisations = ({ session, onRefresh }) => {
  const [loading, setloading] = useState<boolean>(false);
  const [orgs, setOrgs] = useState<Organisation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchOrgsDetails = async () => {
      try {
        setloading(true);
        const org = await fetchOrganisationByUserId(session.data.user.id);
        if (org.length === 0) {
          return;
        }

        setOrgs(org);
        const { error } = getOrganisationDetails();
        if (error) {
          localStorage.setItem("orgId", org[0].id);
          localStorage.setItem("orgName", org[0].name);
        }

        setloading(false);
      } catch (error) {
        console.error("Failed to fetch organisations:", error);
        toast({
          title: "Error",
          description:
            "Unable to fetch organisation details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setloading(false);
      }
    };

    if (session.status === "loading") {
      setloading(true);
    } else if (session.status === "authenticated") {
      fetchOrgsDetails();
    } else if (session.status === "unauthenticated") {
      return redirect("/login");
    }
  }, [session.status, refresh]);

  const handleRefresh = () => {
    setRefresh((prev) => prev + 1);
    onRefresh();
  };

  if (loading) {
    return (
      <div className="m-2 bg-white p-5 rounded-2xl">
        <Skeleton className="h-[40px] w-[650px] rounded-md" />
        <div>
          <Skeleton className="h-[20px] w-[650px] rounded-md mt-2" />
          <Skeleton className="h-[50px] w-[650px] rounded-md mt-5" />
          <div className="grid mt-5 grid-cols-2 grid-rows-3 gap-5">
            <Skeleton className="h-[20px] w-[100px] rounded-md" />
            <Skeleton className="h-[20px] w-[100px] rounded-md" />
            <Skeleton className="h-[20px] w-[100px] rounded-md" />
            <Skeleton className="h-[20px] w-[100px] rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 flex-1">
      <div className="bg-gray-50 p-5 rounded-2xl ">
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
            <h1 className="capitalize mb-3 font-bold text-gray-800 text-2xl">
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
            onRefresh={() => handleRefresh()}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ListOrganisations;
