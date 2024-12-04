import { ProjectHeader } from "@/components/project-header";
import { ProjectDetails } from "@/components/project-details";
import { Card } from "@/components/ui/card";

export default function OrganisationCard({org}) {
  return (
    <div className="container max-w-5xl">
      <div className="space-y-6">
        <Card className=" !border-0 shadow-none">
          <ProjectHeader createdAt={org.created_at} orgName={org.name} orgId={org.id} />
          <ProjectDetails plan={org.plan} role={org.role} status={org.status} />
        </Card>
      </div>
    </div>
  );
}
