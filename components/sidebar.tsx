import Link from "next/link"
import { LayoutDashboard, CheckCircle, Zap, Calendar, FileText, Package, BarChart2, Users, UserCircle, Settings, HelpCircle } from 'lucide-react'

export function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col">
      <Link href={"/dashboard"} className="p-4 flex items-center gap-1">
        <img src="/logo.png" className="w-10" alt="" />
        <span className="font-semibold text-lg">Conversy</span>
      </Link>
      
      <div className="p-2">
        <div className="space-y-1">
          <Link 
            href="#"
            className="flex items-center gap-2 px-3 py-2 text-purple-600 bg-purple-50 rounded-lg"
          >
            <CheckCircle size={20} />
            <span>Tasks</span>
            <span className="ml-auto text-sm">16</span>
          </Link>
          <Link 
            href="#"
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <Zap size={20} />
            <span>Activities</span>
          </Link>
        </div>
      </div>

      <div className="mt-6 px-4">
        <div className="text-xs font-semibold text-gray-400 mb-2">MAIN</div>
        <div className="space-y-1">
          {[
            { icon: LayoutDashboard, label: "Dashboard" },
            { icon: Calendar, label: "Schedule" },
            { icon: FileText, label: "Note" },
            { icon: Package, label: "Products" },
            { icon: BarChart2, label: "Report" },
          ].map((item) => (
            <Link
              key={item.label}
              href="#"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 px-4">
        <div className="text-xs font-semibold text-gray-400 mb-2">RECORDS</div>
        <div className="space-y-1">
          {[
            { icon: Users, label: "Team" },
            { icon: UserCircle, label: "Clients" },
          ].map((item) => (
            <Link
              key={item.label}
              href="#"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto px-4 mb-6">
        <div className="space-y-1">
          {[
            { icon: Settings, label: "Settings" },
            { icon: HelpCircle, label: "Support" },
          ].map((item) => (
            <Link
              key={item.label}
              href="#"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <img
            src="/placeholder.svg?height=32&width=32"
            alt="User"
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">Brooklyn Simmons</div>
            <div className="text-xs text-gray-500 truncate">simmons@gmail.com</div>
          </div>
        </div>
      </div>
    </div>
  )
}

