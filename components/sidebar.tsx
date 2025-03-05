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
  Menu,
  X
} from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";

export function Sidebar() {
  const session = useSession();
  const [isSidebarFullyOpen, setIsSidebarFullyOpen] = useState(false);

  if (session.status === "unauthenticated") {
    return redirect("/login");
  } else if (session.status === "loading") {
    return <SidebarSkeleton />;
  }

  const toggleSidebar = () => {
    setIsSidebarFullyOpen(!isSidebarFullyOpen);
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", link: "/dashboard" },
    { icon: BotMessageSquare, label: "Chatbot", link: "/dashboard/chatbot" },
    { icon: Building2, label: "Integration", link: "/dashboard/integration" },
    { icon: Layers2, label: "Joined Organisations", link: "" },
    { icon: Users, label: "Team", link: "#" },
    { icon: UserCircle, label: "Clients", link: "#" },
    { icon: Settings, label: "Settings", link: "#" },
    { icon: HelpCircle, label: "Support", link: "#" }
  ];

  const renderNavItems = (items, fullView = true) => {
    return items.map((item) => (
      <Link
        key={item.label}
        href={item.link}
        className={`
          flex items-center 
          ${fullView 
            ? 'gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg' 
            : 'justify-center p-2 hover:bg-gray-100'}
        `}
        title={!fullView ? item.label : undefined}
      >
        <item.icon size={20} />
        {fullView && <span>{item.label}</span>}
      </Link>
    ));
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        {/* Mini Sidebar (Icons Only) */}
        {!isSidebarFullyOpen && (
          <div className="top-0 fixed left-0 h-full w-16 bg-white border-r z-50 flex flex-col">
            <Link href={"/dashboard"} className="p-2 flex justify-center items-center border-b">
              <img 
                src="/Conversy-logo-white.png" 
                className="w-8 mix-blend-difference" 
                alt="Conversy Logo" 
              />
            </Link>
            
            <div className="flex-1 py-4 space-y-2">
              {renderNavItems(navItems, false)}
            </div>

            <div className="border-t p-2 flex justify-center">
              <UserRound className="w-8 h-8 rounded-full" />
            </div>

            <button 
              onClick={toggleSidebar}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-2 rounded-full"
            >
              <Menu size={20} />
            </button>
          </div>
        )}

        {/* Full Sidebar */}
        {isSidebarFullyOpen && (
          <div className="fixed inset-0 z-50 bg-white">
            <div className="p-4 flex justify-between items-center border-b">
              <Link href={"/dashboard"} className="flex items-center gap-2">
                <img 
                  src="/Conversy-logo-white.png" 
                  className="w-10 mix-blend-difference" 
                  alt="Conversy Logo" 
                />
                <span className="font-semibold text-lg">Conversy</span>
              </Link>
              <button onClick={toggleSidebar} className="p-2">
                <X size={24} />
              </button>
            </div>

            <div className="p-4">
              <div className="text-xs font-semibold text-gray-400 mb-2">MAIN</div>
              <div className="space-y-2">
                {renderNavItems(navItems.slice(0, 4))}
              </div>
            </div>

            <div className="p-4">
              <div className="text-xs font-semibold text-gray-400 mb-2">RECORDS</div>
              <div className="space-y-2">
                {renderNavItems(navItems.slice(4, 6))}
              </div>
            </div>

            <div className="mt-auto p-4">
              <div className="text-xs font-semibold text-gray-400 mb-2">SETTINGS</div>
              <div className="space-y-2">
                {renderNavItems(navItems.slice(6))}
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
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed top-0 left-0 w-64 h-full bg-white border-r z-50">
        <Link href={"/dashboard"} className="p-4 flex items-center gap-1">
          <img 
            src="/Conversy-logo-white.png" 
            className="w-10 mix-blend-difference" 
            alt="Conversy Logo" 
          />
          <span className="font-semibold text-lg">Conversy</span>
        </Link>

        <div className="mt-6 px-4">
          <div className="text-xs font-semibold text-gray-400 mb-2">MAIN</div>
          <div className="space-y-2">
            {renderNavItems(navItems.slice(0, 4))}
          </div>
        </div>

        <div className="mt-6 px-4">
          <div className="text-xs font-semibold text-gray-400 mb-2">RECORDS</div>
          <div className="space-y-2">
            {renderNavItems(navItems.slice(4, 6))}
          </div>
        </div>

        <div className="mt-auto px-4 mb-6">
          <div className="text-xs font-semibold text-gray-400 mb-2">SETTINGS</div>
          <div className="space-y-2">
            {renderNavItems(navItems.slice(6))}
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
    </>
  );
}

function SidebarSkeleton() {
  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col">
      <Link href={"/dashboard"} className="p-4 flex items-center gap-1">
        <img src="/Conversy-logo-white.png" className="w-10 mix-blend-difference" alt="" />
        <span className="font-semibold text-lg"></span>
      </Link>
      {/* Rest of the skeleton remains the same */}
    </div>
  );
}