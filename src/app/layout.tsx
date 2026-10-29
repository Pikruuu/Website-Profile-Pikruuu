import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Muhammad Fikri Al Fathoni — Portfolio",
  description:
    "Portfolio of Muhammad Fikri Al Fathoni, an Information Technology student and developer focused on AI, ML, data, IoT, and robotics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
