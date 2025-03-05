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
        <div className="h-full min-h-dvh bg-gray-200">
          <div className="flex">
            <Sidebar />
            <div className="md:ml-64 ml-16 w-full">
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
