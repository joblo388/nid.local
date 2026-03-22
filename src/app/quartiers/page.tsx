import Link from "next/link";
import { Header } from "@/components/Header";
import { villes, quartiers } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quartiers — nid.local",
  description: "Tous les quartiers par ville sur nid.local.",
};

export default async function QuartiersPage() {
  const counts = await prisma.post.groupBy({ by: ["quartierSlug"], _count: { id: true } });
  const countByQuartier = Object.fromEntries(counts.map((c) => [c.quartierSlug, c._count.id]));

  const villesAvecQuartiers = villes
    .map((v) => ({ ...v, quartiers: quartiers.filter((q) => q.villeSlug === v.slug) }))
    .filter((v) => v.quartiers.length > 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[1100px] mx-auto px-5 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>
            Quartiers
          </h1>
          <Link href="/villes" className="text-[13px] font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--green)" }}>
            Voir par ville →
          </Link>
        </div>

        {villesAvecQuartiers.map((ville) => (
          <div key={ville.slug} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Link
                href={`/ville/${ville.slug}`}
                className="text-[13px] font-bold transition-opacity hover:opacity-70"
                style={{ color: "var(--text-primary)" }}
              >
                {ville.nom}
              </Link>
              <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                {ville.region}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {ville.quartiers.map((q) => {
                const nb = countByQuartier[q.slug] ?? 0;
                return (
                  <Link
                    key={q.slug}
                    href={`/quartier/${q.slug}`}
                    className="hover-bg rounded-xl p-4 transition-colors flex items-start gap-2.5"
                    style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${q.couleur}`} />
                    <div>
                      <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>
                        {q.nom}
                      </p>
                      <p className="text-[12px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                        {nb} {nb === 1 ? "discussion" : "discussions"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
