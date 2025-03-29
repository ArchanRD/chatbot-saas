"use client";
import { Edit, Building2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InviteModal } from "./invite-modal";
import ShowMembersModal from "./ShowMembersModal";
import { useEffect, useState } from "react";
import { fetchCollaboratorsByOrgId } from "@/lib/actions";
import { useSession } from "next-auth/react";

interface ShowCollaboratorType {
  email: string | null
}

export function ProjectHeader({ createdAt, orgName, orgId }) {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const [collaborators, setCollaborators] = useState<ShowCollaboratorType[]>([]);

  useEffect(() => {
    async function fetchCollaborators() {
      try {
        const result = await fetchCollaboratorsByOrgId(
          session.data?.user.orgId!
        );

        if (result.error) {
          console.log(result.message);
        } else {
          setCollaborators(result.data || [])
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchCollaborators()
  }, []);

  return (
    <div className="space-y-4 py-6">
      <div className="flex items-center text-sm text-muted-foreground">
        <span>
          Created at <b>{createdAt.toDateString()}</b>
        </span>
      </div>

      <div className="flex md:flex-nowrap flex-wrap items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <Building2 />
          </div>
          <h1 className="text-sm sm:text-xl md:text-2xl font-semibold">
            {orgName}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <InviteModal orgId={orgId} orgName={orgName} />
          <Button
            onClick={() => setIsOpen(true)}
            className="gap-2 bg-gray-800 hover:bg-gray-700 active:bg-gray-900"
          >
            <Users className="h-4 w-4" />
            View Members
          </Button>
          <ShowMembersModal collaborators={collaborators} isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
    </div>
  );
}
