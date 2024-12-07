import type { Metadata } from "next";
import "../../globals.css";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Project Dashboard",
  description: "Modern project management dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-gray-200">
          <div className="flex-1 flex">
            <Sidebar />
            <div className="flex-1">
              <Header />
              {children}
            </div>
          </div>
        </div>
        <Toaster/>
      </body>
    </html>
  );
}
