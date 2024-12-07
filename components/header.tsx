"use client"
import { Search, Bell, HelpCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signOut, useSession } from 'next-auth/react'

export function Header() {
  const session = useSession();
  return (
    <header className="h-16 border-b bg-white px-4 flex items-center justify-between">
      <div className="flex items-center flex-1 gap-4">
        <div className="font-medium">
          <div className="text-sm text-gray-500">Welcome,</div>
          <div className='capitalize'>{session.data?.user.name}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant={'destructive'} onClick={()=>signOut()}>
          Logout
        </Button>
      </div>
    </header>
  )
}

