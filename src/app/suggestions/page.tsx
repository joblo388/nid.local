import Link from "next/link";
import { Header } from "@/components/Header";
import { SuggestionForm } from "./SuggestionForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suggestions — nid.local",
  description: "Envoyez vos suggestions pour améliorer nid.local",
};

export default function SuggestionsPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[600px] mx-auto px-5 py-6">
        <nav className="flex items-center gap-1.5 text-[12px] mb-5" style={{ color: "var(--text-tertiary)" }}>
          <Link href="/" className="transition-opacity hover:opacity-70" style={{ color: "var(--text-tertiary)" }}>nid.local</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>Suggestions</span>
        </nav>

        <div className="rounded-xl p-6" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
          <h1 className="text-[20px] font-bold mb-2" style={{ color: "var(--text-primary)" }}>Suggestions</h1>
          <p className="text-[13px] mb-5" style={{ color: "var(--text-tertiary)", lineHeight: 1.6 }}>
            Une idée pour améliorer nid.local? Un bug à signaler? Des données de marché manquantes? Envoyez-nous votre suggestion — l&apos;équipe lit tout.
          </p>
          <SuggestionForm />
        </div>
      </main>
    </div>
  );
}
