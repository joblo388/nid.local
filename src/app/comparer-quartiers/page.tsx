import Link from "next/link";
import { Header } from "@/components/Header";
import { ComparerQuartiers } from "./ComparerQuartiers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparer des quartiers — nid.local",
  description: "Comparez les quartiers du Québec côte à côte : prix médians, avis, nombre de discussions et annonces actives.",
};

export default function ComparerPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[1100px] mx-auto px-3 md:px-5 py-4 md:py-6">
        <nav className="flex items-center gap-1.5 text-[12px] mb-5" style={{ color: "var(--text-tertiary)" }}>
          <Link href="/" className="transition-opacity hover:opacity-70" style={{ color: "var(--text-tertiary)" }}>nid.local</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>Comparer des quartiers</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-[22px] font-bold leading-snug mb-2" style={{ color: "var(--text-primary)" }}>
            Comparer des quartiers
          </h1>
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Sélectionnez 2 ou 3 quartiers pour les comparer côte à côte : prix, avis, activité et annonces.
          </p>
        </div>

        <ComparerQuartiers />
      </main>
    </div>
  );
}
