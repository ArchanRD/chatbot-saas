import type { Metadata } from "next";
import "../../globals.css";

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
      <body>{children}</body>
    </html>
  );
}
