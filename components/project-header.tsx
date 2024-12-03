import { User, Edit, Building2 } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function ProjectHeader({createdAt, orgName}) {
  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center text-sm text-muted-foreground">
        <span>Created at <b>{createdAt.toDateString()}</b></span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
          <Building2 />  
          </div>
          <h1 className="text-2xl font-semibold">{orgName}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <User className="h-4 w-4" />
            Collaborators
          </Button>
          <Button className="gap-2 bg-gray-800 hover:bg-emerald-600">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>
    </div>
  )
}

