import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { AnnoncesListeView } from "./AnnoncesListeView";
import { MarketplaceSidebar } from "@/components/MarketplaceSidebar";
import { MobileCalcFab } from "@/components/MobileCalcFab";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Annonces immobilières",
  description: "Propriétés vendues directement par les propriétaires, sans commission.",
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
