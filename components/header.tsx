import { Search, Bell, HelpCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header({username}) {
  return (
    <header className="h-16 border-b bg-white px-4 flex items-center justify-between">
      <div className="flex items-center flex-1 gap-4">
        <div className="font-medium">
          <div className="text-sm text-gray-500">Welcome,</div>
          <div className='capitalize'>{username}</div>
        </div>
        <div className="max-w-lg flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Find something"
              className="w-full pl-9 bg-gray-50 border-0"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <span className="text-lg font-medium">米K</span>
      </div>
    </header>
  )
}

