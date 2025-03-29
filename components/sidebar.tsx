"use client";
import Link from "next/link";
import {
  LayoutDashboard,
  CirclePlus,
  MessageCircleCode,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export function Sidebar() {
  const session = useSession();

  if (session.status === "unauthenticated") {
    return redirect("/login");
  } else if (session.status === "loading") {
    return <SidebarSkeleton />;
  }

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", link: "/dashboard" },
    { icon: CirclePlus, label: "Chatbot", link: "/dashboard/chatbot" },
    {
      icon: MessageCircleCode,
      label: "Integration",
      link: "/dashboard/integration",
    },
    // { icon: Layers2, label: "Joined Organisations", link: "" },
  ];

  const renderNavItems = (items, fullView = true) => {
    return items.map((item) => (
      <Link
        key={item.label}
        href={item.link}
        className={`
          flex items-center 
          ${
            fullView
              ? "gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              : "justify-center p-2 hover:bg-gray-100"
          }
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
      <div className="md:hidden font-inter">
        {/* Mini Sidebar (Icons Only) */}
        <div className="top-0 fixed left-0 h-full w-16 bg-white border-r z-50 flex flex-col">
          <Link
            href={"/dashboard"}
            className="p-2 flex justify-center items-center border-b"
          >
            <img
              src="/Conversy-logo-white.png"
              className="w-8 mix-blend-difference"
              alt="Conversy Logo"
            />
          </Link>

          <div className="flex-1 py-4 space-y-2">
            {renderNavItems(navItems, false)}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed top-0 left-0 w-64 h-full bg-white border-r z-50 font-inter">
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
      </div>
    </>
  );
}

function SidebarSkeleton() {
  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col">
      <Link href={"/dashboard"} className="p-4 flex items-center gap-1">
        <img
          src="/Conversy-logo-white.png"
          className="w-10 mix-blend-difference"
          alt=""
        />
        <span className="font-semibold text-lg"></span>
      </Link>
      {/* Rest of the skeleton remains the same */}
    </div>
  );
}
