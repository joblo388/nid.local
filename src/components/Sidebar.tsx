"use client";

import Link from "next/link";
import { villes, quartiersDeVille } from "@/lib/data";
import { Post } from "@/lib/types";

const ressources = [
  { label: "Régie du logement", href: "#" },
  { label: "Registre foncier du Québec", href: "#" },
  { label: "Calcul hypothécaire", href: "#" },
  { label: "Guide du locataire", href: "#" },
  { label: "Règlements municipaux MTL", href: "#" },
];

export function Sidebar({ villeSlug, posts }: { villeSlug?: string; posts: Post[] }) {
  const villesActives = villes
    .map((v) => ({ ...v, nb: posts.filter((p) => p.quartier.villeSlug === v.slug).length }))
    .filter((v) => v.nb > 0)
    .sort((a, b) => b.nb - a.nb);

  const qDeVilleActive = villeSlug ? quartiersDeVille(villeSlug) : [];
  const quartiersActifs = qDeVilleActive
    .map((q) => ({ ...q, nb: posts.filter((p) => p.quartier.slug === q.slug).length }))
    .filter((q) => q.nb > 0)
    .sort((a, b) => b.nb - a.nb)
    .slice(0, 6);

  const totalPosts = posts.length;
  const totalVues = posts.reduce((s, p) => s + p.nbVues, 0);
  const totalReponses = posts.reduce((s, p) => s + p.nbCommentaires, 0);

  return (
    <aside className="hidden md:block space-y-3 w-[240px] shrink-0">
      {/* CTA */}
      <Link
        href="/nouveau-post"
        className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center"
        style={{ background: "var(--green)" }}
      >
        + Nouvelle discussion
      </Link>

      {/* Villes actives */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
      >
        <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-tertiary)" }}>
            Villes actives
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
            Toutes les villes →
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
              Quartiers actifs
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
            Communauté
          </h3>
        </div>
        <div className="grid grid-cols-2">
          {[
            { label: "Membres", valeur: "3 241" },
            { label: "Discussions", valeur: totalPosts.toLocaleString("fr-CA") },
            { label: "Vues totales", valeur: totalVues.toLocaleString("fr-CA") },
            { label: "Réponses", valeur: totalReponses.toLocaleString("fr-CA") },
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
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
      >
        <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-tertiary)" }}>
            Ressources utiles
          </h3>
        </div>
        <ul>
          {ressources.map((r, i) => (
            <li key={r.label}
              style={{ borderBottom: i < ressources.length - 1 ? "0.5px solid var(--border)" : "none" }}>
              <Link
                href={r.href}
                className="flex items-center justify-between px-4 py-2.5 transition-colors hover-bg"
              >
                <span className="text-[13px]" style={{ color: "var(--text-primary)" }}>
                  {r.label}
                </span>
                <svg className="w-3 h-3 shrink-0" style={{ color: "var(--text-tertiary)" }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[11px] text-center px-2" style={{ color: "var(--text-tertiary)" }}>
        © 2026 nid.local — Fait au Québec
      </p>
    </aside>
  );
}
