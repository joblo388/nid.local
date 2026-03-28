import Link from "next/link";
import { Header } from "@/components/Header";
import { DonneesMarche } from "./DonneesMarche";
import { prisma } from "@/lib/prisma";
import { dbPostToAppPost, ressourcesUtiles } from "@/lib/data";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";
const PAGE_URL = `${BASE_URL}/donnees-marche`;

export const metadata: Metadata = {
  title: "Prix immobilier Québec 2026 — Données de marché par ville et quartier",
  description: "Prix médians des maisons, condos et plex au Québec en 2026. Tendances, délais de vente et conditions de marché par arrondissement de Montréal, Rive-Sud, Rive-Nord et régions.",
  keywords: [
    "prix immobilier québec 2026", "prix maison montréal", "prix condo montréal 2026",
    "marché immobilier québec", "prix duplex montréal", "prix plex montréal",
    "tendances immobilières québec", "données marché immobilier",
    "prix immobilier rosemont", "prix immobilier villeray", "prix immobilier plateau",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Prix immobilier Québec 2026 — Données par ville et quartier",
    description: "Prix médians, délais de vente et tendances immobilières au Québec. Montréal, Laval, Rive-Sud, Rive-Nord et régions.",
    url: PAGE_URL, siteName: "nid.local", locale: "fr_CA", type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "nid.local", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Données de marché", item: PAGE_URL },
    ]},
    { "@type": "WebPage", name: "Prix immobilier Québec 2026", url: PAGE_URL, description: "Données de marché immobilier au Québec — prix médians, tendances et délais par ville et quartier.", inLanguage: "fr-CA" },
    { "@type": "FAQPage", mainEntity: [
      { "@type": "Question", name: "Quel est le prix médian d'une maison au Québec en 2026?", acceptedAnswer: { "@type": "Answer", text: "Le prix médian provincial est de 485 000 $ en 2026, en hausse de 7% par rapport à 2025. Pour une unifamiliale, le médian est de 536 000 $ (+8%) et pour un condo, 404 000 $ (+3%). À Montréal, les prix varient de 425 000 $ (Montréal-Nord) à 1 485 000 $ (Outremont) selon l'arrondissement." }},
      { "@type": "Question", name: "Quels quartiers de Montréal augmentent le plus en 2026?", acceptedAnswer: { "@type": "Answer", text: "Les quartiers avec les plus fortes hausses en 2026 sont Hochelaga-Maisonneuve (+9,2%), Montréal-Nord (+8,9%), Le Sud-Ouest/Griffintown (+8,5%) et Verdun (+7,8%). Les quartiers plus établis comme le Plateau (+4,2%) et Outremont (+2,1%) connaissent des hausses plus modérées." }},
      { "@type": "Question", name: "Est-ce un marché acheteur ou vendeur au Québec en 2026?", acceptedAnswer: { "@type": "Answer", text: "Le ratio ventes/inscriptions provincial est de 42%, ce qui indique un marché équilibré dans l'ensemble. Cependant, la situation varie : la plupart des banlieues et quartiers abordables sont en marché vendeur (forte demande), tandis que le centre-ville de Montréal et certains secteurs de luxe sont en marché acheteur ou équilibré." }},
    ]},
  ],
};

const ressources = ressourcesUtiles;

export default async function DonneesPage() {
  const dbPosts = await prisma.post.findMany({ orderBy: [{ epingle: "desc" }, { nbVotes: "desc" }], take: 5 });
  const popularPosts = dbPosts.map(dbPostToAppPost);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
        <Header />
        <main className="max-w-[1100px] mx-auto px-5 py-6">
          <nav className="flex items-center gap-1.5 text-[12px] mb-5" style={{ color: "var(--text-tertiary)" }}>
            <Link href="/" className="transition-opacity hover:opacity-70" style={{ color: "var(--text-tertiary)" }}>nid.local</Link>
            <span>/</span>
            <span style={{ color: "var(--text-secondary)" }}>Données de marché</span>
          </nav>

          <div className="flex gap-5 items-start">
            <div className="flex-1 min-w-0 space-y-5">
              <div>
                <h1 className="text-[22px] font-bold leading-snug mb-2" style={{ color: "var(--text-primary)" }}>Données de marché — Québec 2026</h1>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Prix médians, délais de vente et tendances par ville et arrondissement. Sources : APCIQ, Centris, Royal LePage.
                </p>
              </div>

              <div className="dm-disclaimer">
                Ces données sont issues de sources publiques pour 2025-2026 et sont présentées à titre indicatif. Les prix varient selon le secteur précis, l&apos;état de la propriété et les conditions du marché. Mise à jour : mars 2026.
              </div>

              <DonneesMarche />

              {/* FAQ */}
              <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>Questions fréquentes</h2>
                <dl className="space-y-4">
                  {[
                    { q: "Quel est le prix médian d'une maison au Québec en 2026?", r: "Le prix médian provincial est de 485 000 $, en hausse de 7% par rapport à 2025. Une unifamiliale médiane coûte 536 000 $ et un condo 404 000 $." },
                    { q: "Quels quartiers de Montréal augmentent le plus?", r: "Hochelaga-Maisonneuve (+9,2%), Montréal-Nord (+8,9%), Griffintown/St-Henri (+8,5%) et Verdun (+7,8%) connaissent les plus fortes hausses." },
                    { q: "Est-ce un marché acheteur ou vendeur?", r: "Le ratio ventes/inscriptions de 42% indique un marché équilibré dans l'ensemble. Les banlieues sont en marché vendeur, le centre-ville en marché acheteur." },
                    { q: "Combien de temps faut-il pour vendre une maison?", r: "Le délai moyen varie de 30 jours (Limoilou, Québec) à 85 jours (Îles-de-la-Madeleine). À Montréal, la moyenne est de 50-55 jours." },
                  ].map((item) => (
                    <div key={item.q} className="pb-4" style={{ borderBottom: "0.5px solid var(--border)" }}>
                      <dt className="text-[13px] font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>{item.q}</dt>
                      <dd className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.r}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* CTA */}
              <div className="rounded-xl p-6 text-center space-y-3" style={{ background: "var(--green-light-bg)", border: "0.5px solid var(--border)" }}>
                <h2 className="text-[15px] font-bold" style={{ color: "var(--green-text)" }}>Prêt à acheter ou vendre?</h2>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--green-text)", opacity: 0.85 }}>
                  Parcourez les annonces publiées par des propriétaires ou calculez votre capacité d&apos;emprunt.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Link href="/annonces" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "var(--green)" }}>Voir les annonces →</Link>
                  <Link href="/capacite-emprunt" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-80" style={{ background: "var(--bg-card)", color: "var(--green-text)", border: "0.5px solid var(--border)" }}>Calculer ma capacité</Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden md:flex flex-col gap-3 w-[240px] shrink-0">
              <Link href="/annonces" className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center" style={{ background: "var(--green)" }}>Voir les annonces</Link>
              {popularPosts.length > 0 && (
                <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                  <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}><h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Discussions populaires</h3></div>
                  <ul>{popularPosts.map((post, i) => (<li key={post.id} style={{ borderBottom: i < popularPosts.length - 1 ? "0.5px solid var(--border)" : "none" }}><Link href={`/post/${post.id}`} className="flex flex-col gap-1 px-4 py-3 transition-colors hover-bg"><span className="text-[12px] font-medium leading-snug line-clamp-2" style={{ color: "var(--text-primary)" }}>{post.titre}</span><span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{post.quartier.nom} · {post.nbVotes} votes</span></Link></li>))}</ul>
                </div>
              )}
              <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}><h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Ressources utiles</h3></div>
                <ul>{ressources.map((r, i) => (<li key={r.label} style={{ borderBottom: i < ressources.length - 1 ? "0.5px solid var(--border)" : "none" }}><Link href={r.href} className="flex items-center justify-between px-4 py-2.5 transition-colors hover-bg"><span className="text-[13px]" style={{ color: "var(--text-primary)" }}>{r.label}</span><svg className="w-3 h-3 shrink-0" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></Link></li>))}</ul>
              </div>
              <p className="text-[11px] text-center px-2" style={{ color: "var(--text-tertiary)" }}>© 2026 nid.local — Fait au Québec</p>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
