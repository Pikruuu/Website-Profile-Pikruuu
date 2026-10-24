import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Muhammad Fikri Al Fathoni — Portofolio",
  description:
    "Portofolio Muhammad Fikri Al Fathoni, mahasiswa Teknologi Informasi dan developer yang berfokus pada AI, ML, data, IoT, dan robotics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-dvh antialiased">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
