import {
  Loader2,
  User,
  ReceiptIndianRupee,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ProjectDetails({ plan, status, role }) {
  return (
    <div className="space-y-6 pb-6">
      <div className="grid grid-cols-[100px_1fr] items-center gap-2">
        <div className="text-sm text-muted-foreground">
          <ReceiptIndianRupee className="h-4 w-4 inline mr-1" />
          Plan
        </div>
        <div className="capitalize">{plan}</div>
      </div>

      <div className="grid grid-cols-[100px_1fr] items-center gap-2">
        <div className="text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 inline mr-1" />
          Status
        </div>
        <div>
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-600 hover:bg-blue-50"
          >
            {status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-[100px_1fr] items-center gap-2">
        <div className="text-sm text-muted-foreground">
          <User className="h-4 w-4 inline mr-1" />
          Role
        </div>
        <div className="flex items-center gap-2">
          <span className="capitalize">{role}</span>
        </div>
      </div>
    </div>
  );
}
