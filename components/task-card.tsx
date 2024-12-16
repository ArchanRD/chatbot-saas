import { MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TaskCardProps {
  title: string
  progress: number
  tags: string[]
  avatars: number
  comments: number
  backgroundColor?: string
  textColor?: string
}

export function TaskCard({
  title,
  progress,
  tags,
  avatars,
  comments,
  backgroundColor = "bg-blue-50",
  textColor = "text-blue-500"
}: TaskCardProps) {
  return (
    <div className={`${backgroundColor} p-4 rounded-xl`}>
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-1">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={`mr-1 ${textColor} bg-white/50`}
            >
              {tag}
            </Badge>
          ))}
        </div>
        <Button variant="ghost" size="icon" className="-mr-2">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      <h3 className="font-medium mb-4">{title}</h3>
      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">Progress</div>
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full ${
                  i < progress / 10 ? textColor : "bg-white/50"
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-right text-gray-500 mt-1">
            {progress}%
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {Array.from({ length: avatars }).map((_, i) => (
              <img
                key={i}
                src={`/placeholder.svg?height=24&width=24`}
                alt={`Team member ${i + 1}`}
                className="w-6 h-6 rounded-full border-2 border-white"
              />
            ))}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>💬</span>
            <span>{comments}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

