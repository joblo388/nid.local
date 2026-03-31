import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { AnnoncesListeView } from "./AnnoncesListeView";
import { MarketplaceSidebar } from "@/components/MarketplaceSidebar";
import { MobileCalcFab } from "@/components/MobileCalcFab";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nidlocal.com";

export const metadata: Metadata = {
  title: "Annonces immobilières Québec 2026 | Acheter, vendre sans commission",
  description: "Propriétés à vendre et à louer au Québec, publiées directement par les propriétaires. Maisons, condos, plex, terrains. Sans commission, sans courtier.",
  keywords: [
    "annonces immobilières québec", "maison à vendre québec", "condo à vendre montréal",
    "plex à vendre", "vendre sans courtier", "duproprio alternative", "immobilier sans commission",
    "location québec", "propriété à vendre",
  ],
  alternates: { canonical: `${BASE_URL}/annonces` },
  openGraph: {
    title: "Annonces immobilières Québec 2026 | Sans commission",
    description: "Propriétés à vendre et à louer au Québec. Publiées directement par les propriétaires.",
    url: `${BASE_URL}/annonces`,
    siteName: "nid.local",
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Annonces immobilières Québec 2026",
    description: "Propriétés à vendre et à louer au Québec, sans commission.",
  },
};

export default function AnnoncesPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[1100px] mx-auto px-3 md:px-5 py-4 md:py-6">
        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0">
            <AnnoncesListeView />
          </div>
          <MarketplaceSidebar />
        </div>
      </main>
      <MobileCalcFab />
    </div>
  );
}
