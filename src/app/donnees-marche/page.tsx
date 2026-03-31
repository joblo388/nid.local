import Link from "next/link";
import { Header } from "@/components/Header";
import { CommunityCTA } from "@/components/CommunityCTA";
import { DonneesMarche } from "./DonneesMarche";
import { prisma } from "@/lib/prisma";
import { dbPostToAppPost, ressourcesUtiles } from "@/lib/data";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";
const PAGE_URL = `${BASE_URL}/donnees-marche`;

export const metadata: Metadata = {
  title: "Données marché immobilier Québec 2026 | Prix par ville et quartier",
  description: "Prix médians des maisons, condos et plex au Québec en 2026. Tendances, délais de vente et conditions de marché par ville et quartier.",
  keywords: [
    "prix immobilier québec 2026", "prix maison montréal", "prix condo montréal 2026",
    "marché immobilier québec", "prix duplex montréal", "prix plex montréal",
    "tendances immobilières québec", "données marché immobilier",
    "prix immobilier rosemont", "prix immobilier villeray", "prix immobilier plateau",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Données marché immobilier Québec 2026 | Prix par ville et quartier",
    description: "Prix médians, délais de vente et tendances immobilières au Québec. Montréal, Laval, Rive-Sud, Rive-Nord et régions.",
    url: PAGE_URL, siteName: "nid.local", locale: "fr_CA", type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Données marché immobilier Québec 2026 | Prix par ville et quartier",
    description: "Prix médians, délais de vente et tendances immobilières au Québec. Montréal, Laval, Rive-Sud, Rive-Nord et régions.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "nid.local", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Données de marché", item: PAGE_URL },
    ]},
    { "@type": "WebPage", name: "Prix immobilier Québec 2026", url: PAGE_URL, description: "Données de marché immobilier au Québec : prix médians, tendances et délais par ville et quartier.", inLanguage: "fr-CA" },
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
        <main className="max-w-[1100px] mx-auto px-3 md:px-5 py-4 md:py-6 pb-20 md:pb-6">
          <nav className="flex items-center gap-1.5 text-[12px] mb-5" style={{ color: "var(--text-tertiary)" }}>
            <Link href="/" className="transition-opacity hover:opacity-70" style={{ color: "var(--text-tertiary)" }}>nid.local</Link>
            <span>/</span>
            <span style={{ color: "var(--text-secondary)" }}>Données de marché</span>
          </nav>

          <div className="flex gap-5 items-start">
            <div className="flex-1 min-w-0 space-y-5">
              <div>
                <h1 className="text-[22px] font-bold leading-snug mb-2" style={{ color: "var(--text-primary)" }}>Données de marché | Québec 2026</h1>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Prix médians, délais de vente et tendances par ville et arrondissement. Sources : APCIQ, Centris, Royal LePage.
                </p>
              </div>

              <div className="rounded-xl p-4 text-[12px] leading-relaxed" style={{ background: "var(--amber-bg)", color: "var(--amber-text)", border: "0.5px solid var(--border)" }}>
                Ces données sont issues de sources publiques pour 2025-2026 et sont présentées à titre indicatif. Les prix varient selon le secteur précis, l&apos;état de la propriété et les conditions du marché. Mise à jour : mars 2026.
              </div>

              <DonneesMarche />

              {/* Données par ville */}
              <div className="rounded-xl p-6 space-y-3" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>Données de marché par ville</h2>
                <p className="text-[12px] leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>
                  Consultez les données détaillées pour chaque ville du Québec.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {[
                    { slug: "montreal", nom: "Montréal" },
                    { slug: "quebec", nom: "Québec" },
                    { slug: "laval", nom: "Laval" },
                    { slug: "longueuil", nom: "Longueuil" },
                    { slug: "sherbrooke", nom: "Sherbrooke" },
                    { slug: "gatineau", nom: "Gatineau" },
                    { slug: "trois-rivieres", nom: "Trois-Rivières" },
                    { slug: "saguenay", nom: "Saguenay" },
                    { slug: "levis", nom: "Lévis" },
                    { slug: "terrebonne", nom: "Terrebonne" },
                    { slug: "rimouski", nom: "Rimouski" },
                    { slug: "drummondville", nom: "Drummondville" },
                  ].map((v) => (
                    <Link
                      key={v.slug}
                      href={`/donnees-marche/${v.slug}`}
                      className="px-3 py-2 rounded-lg text-[12px] font-medium transition-colors hover-bg text-center"
                      style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)", color: "var(--text-primary)" }}
                    >
                      {v.nom}
                    </Link>
                  ))}
                </div>
              </div>

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

              {/* Outils connexes */}
              <div className="rounded-xl p-6 space-y-3" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>Outils connexes</h2>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { href: "/estimation", label: "Estimation de valeur", desc: "Estimez la valeur marchande d\u2019une propri\u00e9t\u00e9 dans votre quartier." },
                    { href: "/comparer-quartiers", label: "Comparer les quartiers", desc: "Comparez les prix, tendances et profil de deux quartiers." },
                    { href: "/calculateur-plex", label: "Calculateur plex", desc: "MRB, cashflow et rendement pour un duplex, triplex ou quadruplex." },
                  ].map((tool) => (
                    <Link key={tool.href} href={tool.href} className="p-3 rounded-lg transition-colors hover-bg" style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)" }}>
                      <p className="text-[13px] font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{tool.label}</p>
                      <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{tool.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <CommunityCTA contexte="donnees" />
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
              <p className="text-[11px] text-center px-2" style={{ color: "var(--text-tertiary)" }}>© 2026 nid.local | Fait au Québec</p>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
