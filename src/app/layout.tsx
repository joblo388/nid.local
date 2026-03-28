import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "@/components/SessionProvider";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";

export const metadata: Metadata = {
  title: "nid.local — Le forum immobilier québécois",
  description:
    "Forum communautaire sur l'immobilier au Québec. Questions, annonces, rénovations et nouvelles de quartier.",
  alternates: {
    types: {
      "application/rss+xml": `${BASE_URL}/rss.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={geist.variable}>
      <body className="min-h-screen">
          <SessionProvider>{children}<BottomNav /></SessionProvider>
        </body>
    </html>
  );
}
