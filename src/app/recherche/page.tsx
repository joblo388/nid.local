import { Suspense } from "react";
import { Header } from "@/components/Header";
import { SearchResults } from "./SearchResults";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props) {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" — nid.local` : "Recherche — nid.local",
  };
}

export default async function RecherchePage({ searchParams }: Props) {
  const { q } = await searchParams;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[1100px] mx-auto px-5 py-6 max-w-[700px]">
        <h1 className="text-[18px] font-bold mb-5" style={{ color: "var(--text-primary)" }}>
          {q ? (
            <>Résultats pour <span style={{ color: "var(--green)" }}>&ldquo;{q}&rdquo;</span></>
          ) : (
            "Recherche"
          )}
        </h1>
        <Suspense fallback={
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl h-[80px] animate-pulse"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }} />
            ))}
          </div>
        }>
          <SearchResults q={q ?? ""} />
        </Suspense>
      </main>
    </div>
  );
}
