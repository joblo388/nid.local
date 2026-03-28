"use client";

import Link from "next/link";
import { villes, quartiersDeVille, ressourcesUtiles } from "@/lib/data";
import { useLocale } from "@/lib/useLocale";

export type SidebarStats = {
  countsByVille: Record<string, number>;
  countsByQuartier: Record<string, number>;
  totalPosts: number;
  totalVues: number;
  totalReponses: number;
};

export function Sidebar({ villeSlug, stats }: { villeSlug?: string; stats: SidebarStats }) {
  const { t } = useLocale();
  const villesActives = villes
    .map((v) => ({ ...v, nb: stats.countsByVille[v.slug] ?? 0 }))
    .filter((v) => v.nb > 0)
    .sort((a, b) => b.nb - a.nb);

  const qDeVilleActive = villeSlug ? quartiersDeVille(villeSlug) : [];
  const quartiersActifs = qDeVilleActive
    .map((q) => ({ ...q, nb: stats.countsByQuartier[q.slug] ?? 0 }))
    .filter((q) => q.nb > 0)
    .sort((a, b) => b.nb - a.nb)
    .slice(0, 6);

  return (
    <aside className="hidden md:block space-y-3 w-[240px] shrink-0">
      {/* CTA */}
      <Link
        href="/nouveau-post"
        data-tour="publier-desktop"
        className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center"
        style={{ background: "var(--green)" }}
      >
        + {t("common.nouvelle_discussion")}
      </Link>

      {/* Villes actives */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
      >
        <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-tertiary)" }}>
            {t("sidebar.villes_actives")}
          </h3>
        </div>
        <ul>
          {villesActives.map((v) => (
            <li key={v.slug} style={{ borderBottom: "0.5px solid var(--border)" }}>
              <Link
                href={`/ville/${v.slug}`}
                className="flex items-center justify-between px-4 py-2.5 transition-colors hover-bg"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
                    {v.nom}
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                    {v.region}
                  </p>
                </div>
                <span
                  className="ml-3 text-[11px] font-medium px-1.5 py-0.5 rounded-md shrink-0"
                  style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}
                >
                  {v.nb}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="px-4 py-2.5">
          <Link
            href="/villes"
            className="text-[12px] font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--green)" }}
          >
            {t("common.toutes_villes")} →
          </Link>
        </div>
      </div>

      {/* Quartiers de la ville active */}
      {quartiersActifs.length > 0 && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
        >
          <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-tertiary)" }}>
              {t("sidebar.quartiers_actifs")}
            </h3>
          </div>
          <ul>
            {quartiersActifs.map((q) => (
              <li key={q.slug} style={{ borderBottom: "0.5px solid var(--border)" }}>
                <Link
                  href={`/quartier/${q.slug}`}
                  className="flex items-center justify-between px-4 py-2.5 transition-colors hover-bg"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${q.couleur}`} />
                    <span className="text-[13px]" style={{ color: "var(--text-primary)" }}>
                      {q.nom}
                    </span>
                  </div>
                  <span
                    className="text-[11px] font-medium px-1.5 py-0.5 rounded-md"
                    style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}
                  >
                    {q.nb}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Communauté */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
      >
        <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-tertiary)" }}>
            {t("sidebar.communaute")}
          </h3>
        </div>
        <div className="grid grid-cols-2">
          {[
            { label: t("sidebar.membres"), valeur: "3 241" },
            { label: t("sidebar.discussions"), valeur: stats.totalPosts.toLocaleString("fr-CA") },
            { label: t("sidebar.vues_totales"), valeur: stats.totalVues.toLocaleString("fr-CA") },
            { label: t("sidebar.reponses"), valeur: stats.totalReponses.toLocaleString("fr-CA") },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="px-4 py-3"
              style={{
                borderRight: i % 2 === 0 ? "0.5px solid var(--border)" : "none",
                borderTop: i >= 2 ? "0.5px solid var(--border)" : "none",
              }}
            >
              <p className="text-[18px] font-bold leading-none" style={{ color: "var(--text-primary)" }}>
                {stat.valeur}
              </p>
              <p className="text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ressources */}
      <div
        data-tour="outils-desktop"
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
      >
        <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-tertiary)" }}>
            {t("sidebar.ressources")}
          </h3>
        </div>
        <ul>
          {ressourcesUtiles.map((r, i) => (
            <li key={r.label}
              style={{ borderBottom: i < ressourcesUtiles.length - 1 ? "0.5px solid var(--border)" : "none" }}>
              <Link
                href={r.href}
                className="flex items-center justify-between px-4 py-2.5 transition-colors hover-bg"
              >
                <div className="min-w-0">
                  <span className="text-[13px]" style={{ color: "var(--text-primary)" }}>
                    {r.label}
                  </span>
                  {"description" in r && r.description && (
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                      {r.description}
                    </p>
                  )}
                </div>
                <svg className="w-3 h-3 shrink-0 ml-2" style={{ color: "var(--text-tertiary)" }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[11px] text-center px-2" style={{ color: "var(--text-tertiary)" }}>
        {t("footer.copyright")}
      </p>
    </aside>
  );
}
