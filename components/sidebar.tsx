"use client";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Settings,
  HelpCircle,
  UserRound,
  BotMessageSquare,
  Building2,
  Layers2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export function Sidebar() {
  const session = useSession();
  if (session.status == "unauthenticated") {
    return redirect("/login");
  } else if (session.status == "loading") {
    return "loading...";
  }

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col">
      <Link href={"/dashboard"} className="p-4 flex items-center gap-1">
        <img src="/logo.png" className="w-10" alt="" />
        <span className="font-semibold text-lg">Conversy</span>
      </Link>

      <div className="mt-6 px-4">
        <div className="text-xs font-semibold text-gray-400 mb-2">MAIN</div>
        <div className="space-y-1">
          {[
            { icon: LayoutDashboard, label: "Dashboard", link: "/dashboard" },
            { icon: BotMessageSquare, label: "Chatbot", link: "/chatbot" },
            { icon: Building2, label: "My Organisation", link: "" },
            { icon: Layers2, label: "Joined Organisations", link: "" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.link}
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
          <UserRound className="w-8 h-8 rounded-full" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {session.data!.user.name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {session.data!.user.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
