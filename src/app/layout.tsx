import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "@/components/SessionProvider";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "nid.local — Le forum immobilier québécois",
  description:
    "Forum communautaire sur l'immobilier au Québec. Questions, annonces, rénovations et nouvelles de quartier.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={geist.variable}>
      <body className="min-h-screen">
          <SessionProvider>{children}</SessionProvider>
        </body>
    </html>
  );
}
