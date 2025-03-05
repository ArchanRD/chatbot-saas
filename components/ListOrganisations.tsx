"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import CreateOrganisationModal from "./CreateOrganisationModal";
import OrganisationCard from "./OrganisationCard";

const ListOrganisations = ({ onRefresh, orgs }) => {
  const [showModal, setShowModal] = useState(false);

  const handleRefresh = () => {
    onRefresh();
  };

  return (
    <div className="mx-3 my-2 md:flex-1">
      <div className="bg-gray-50 p-5 rounded-2xl">
        {orgs == null ? (
          <div className="font-poppins flex items-center justify-center flex-col text-center">
            <h1 className="mb-1 font-bold text-gray-800 text-3xl">
              Create your organisation
            </h1>
            <p className="text-gray-500 w-full sm:w-96 text-center mb-5">
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
          <div className="font-poppins flex flex-wrap">
            <h1 className="capitalize mb-3 font-bold text-gray-800 text-2xl w-full">
              Your organisation
            </h1>
            <hr className="w-full" />
            <OrganisationCard org={orgs} />
            <hr className="w-full" />
          </div>
        )}

        {showModal && (
          <CreateOrganisationModal
            onRefresh={() => handleRefresh()}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ListOrganisations;