import Link from "next/link";
import { Header } from "@/components/Header";
import { villes, quartiers } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Villes — nid.local",
  description: "Toutes les villes du Québec sur nid.local.",
};

export default async function VillesPage() {
  const counts = await prisma.post.groupBy({ by: ["villeSlug"], _count: { id: true } });
  const countByVille = Object.fromEntries(counts.map((c) => [c.villeSlug, c._count.id]));

  const regions = [...new Set(villes.map((v) => v.region))];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[1100px] mx-auto px-5 py-6">
        <h1 className="text-[20px] font-bold mb-6" style={{ color: "var(--text-primary)" }}>
          Villes du Québec
        </h1>

        {regions.map((region) => (
          <div key={region} className="mb-8">
            <h2 className="text-[11px] font-bold uppercase tracking-widest mb-3"
              style={{ color: "var(--text-tertiary)" }}>
              {region}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {villes
                .filter((v) => v.region === region)
                .map((v) => {
                  const nbPosts = countByVille[v.slug] ?? 0;
                  const nbQuartiers = quartiers.filter((q) => q.villeSlug === v.slug).length;
                  return (
                    <Link
                      key={v.slug}
                      href={`/ville/${v.slug}`}
                      className="hover-bg rounded-xl p-4 transition-colors flex items-start gap-3"
                      style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[15px] font-black"
                        style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}>
                        {v.nom[0]}
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>
                          {v.nom}
                        </p>
                        <p className="text-[12px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                          {nbQuartiers > 1 ? `${nbQuartiers} quartiers · ` : ""}
                          {nbPosts} {nbPosts === 1 ? "discussion" : "discussions"}
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
