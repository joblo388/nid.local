import Link from "next/link";
import { Header } from "@/components/Header";
import { ressourcesUtiles } from "@/lib/data";

export const metadata = { title: "Outils et ressources — nid.local" };

const icons: Record<string, string> = {
  "/annonces": "🏠",
  "/donnees-marche": "📊",
  "/calculatrice-hypothecaire": "🧮",
  "/capacite-emprunt": "💰",
  "/calculateur-plex": "🏗️",
  "/acheter-ou-louer": "⚖️",
  "/estimation": "📐",
  "/suggestions": "💡",
};

export default function RessourcesPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[1100px] mx-auto px-4 py-6 pb-24">
        <h1
          className="text-[20px] font-bold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Outils et ressources
        </h1>
        <p className="text-[13px] mb-6" style={{ color: "var(--text-tertiary)" }}>
          Calculatrices, données de marché et outils pour vos projets immobiliers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ressourcesUtiles.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="flex items-center gap-3 p-4 rounded-xl transition-colors hover-bg card-hover-lift"
              style={{
                background: "var(--bg-card)",
                border: "0.5px solid var(--border)",
              }}
            >
              <span className="text-[28px] shrink-0">{icons[r.href] ?? "📄"}</span>
              <div className="min-w-0">
                <p
                  className="text-[14px] font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {r.label}
                </p>
                {"description" in r && r.description && (
                  <p
                    className="text-[12px] mt-0.5"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {r.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
