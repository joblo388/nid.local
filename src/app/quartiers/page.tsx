import Link from "next/link";
import { Header } from "@/components/Header";
import { quartiers, posts } from "@/lib/data";

export const metadata = {
  title: "Quartiers — nid.local",
  description: "Tous les quartiers disponibles sur nid.local.",
};

export default function QuartiersPage() {
  const villes = ["Montréal", "Québec"];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[1100px] mx-auto px-5 py-6">
        <h1 className="text-[20px] font-bold mb-6" style={{ color: "var(--text-primary)" }}>Quartiers</h1>

        {villes.map((ville) => (
          <div key={ville} className="mb-8">
            <h2
              className="text-[11px] font-bold uppercase tracking-widest mb-3"
              style={{ color: "var(--text-tertiary)" }}
            >
              {ville}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {quartiers
                .filter((q) => q.ville === ville)
                .map((q) => {
                  const nb = posts.filter((p) => p.quartier.slug === q.slug).length;
                  return (
                    <Link
                      key={q.slug}
                      href={`/quartier/${q.slug}`}
                      className="hover-bg rounded-xl p-4 transition-colors flex items-start gap-2.5"
                      style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${q.couleur}`} />
                      <div>
                        <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>{q.nom}</p>
                        <p className="text-[12px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                          {nb} {nb === 1 ? "publication" : "publications"}
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
