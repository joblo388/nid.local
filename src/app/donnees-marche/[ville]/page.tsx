import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { CommunityCTA } from "@/components/CommunityCTA";
import { prisma } from "@/lib/prisma";
import { dbPostToAppPost, ressourcesUtiles } from "@/lib/data";
import { quartiersDeVille } from "@/lib/data";
import { CITY_SEO, getCityStats } from "@/lib/donneesMarche";
import { DonneesVille } from "./DonneesVille";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";

type Props = { params: Promise<{ ville: string }> };

export async function generateStaticParams() {
  return Object.keys(CITY_SEO).map((ville) => ({ ville }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ville } = await params;
  const city = CITY_SEO[ville];
  if (!city) return {};

  const PAGE_URL = `${BASE_URL}/donnees-marche/${ville}`;
  const villeMin = city.nom.toLowerCase();

  return {
    title: `Prix immobilier ${city.nom} 2026 | Données de marché par quartier`,
    description: city.description,
    keywords: [
      `prix immobilier ${villeMin}`,
      `prix maison ${villeMin} 2026`,
      `marché immobilier ${villeMin}`,
      `prix condo ${villeMin}`,
      `acheter maison ${villeMin}`,
    ],
    alternates: { canonical: PAGE_URL },
    openGraph: {
      title: `Prix immobilier ${city.nom} 2026 | Données par quartier`,
      description: city.description,
      url: PAGE_URL,
      siteName: "nid.local",
      locale: "fr_CA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Prix immobilier ${city.nom} 2026`,
      description: city.description,
    },
  };
}

const ressources = ressourcesUtiles;

export default async function DonneesVillePage({ params }: Props) {
  const { ville } = await params;
  const city = CITY_SEO[ville];
  if (!city) notFound();

  const PAGE_URL = `${BASE_URL}/donnees-marche/${ville}`;

  // Quartiers de cette ville
  const quartiersList = quartiersDeVille(ville);
  const quartierSlugs = quartiersList.map((q) => q.slug);

  // Stats agrégées
  const stats = getCityStats(ville, quartierSlugs);

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "nid.local", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Données de marché", item: `${BASE_URL}/donnees-marche` },
          { "@type": "ListItem", position: 3, name: city.nom, item: PAGE_URL },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: city.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.r },
        })),
      },
    ],
  };

  // Posts populaires pour la sidebar
  const dbPosts = await prisma.post.findMany({
    orderBy: [{ epingle: "desc" }, { nbVotes: "desc" }],
    take: 5,
  });
  const popularPosts = dbPosts.map(dbPostToAppPost);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
        <Header />
        <main className="max-w-[1100px] mx-auto px-3 md:px-5 py-4 md:py-6 pb-20 md:pb-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[12px] mb-5" style={{ color: "var(--text-tertiary)" }}>
            <Link href="/" className="transition-opacity hover:opacity-70" style={{ color: "var(--text-tertiary)" }}>nid.local</Link>
            <span>/</span>
            <Link href="/donnees-marche" className="transition-opacity hover:opacity-70" style={{ color: "var(--text-tertiary)" }}>Données de marché</Link>
            <span>/</span>
            <span style={{ color: "var(--text-secondary)" }}>{city.nom}</span>
          </nav>

          <div className="flex gap-5 items-start">
            {/* Contenu principal */}
            <div className="flex-1 min-w-0 space-y-5">
              {/* H1 + intro */}
              <div>
                <h1 className="text-[22px] font-bold leading-snug mb-2" style={{ color: "var(--text-primary)" }}>
                  Prix immobilier à {city.nom} | 2026
                </h1>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {city.description}
                </p>
              </div>

              {/* Avertissement */}
              <div className="rounded-xl p-4 text-[12px] leading-relaxed" style={{ background: "var(--amber-bg)", color: "var(--amber-text)", border: "0.5px solid var(--border)" }}>
                Ces données sont issues de sources publiques pour 2025-2026 et sont présentées à titre indicatif. Les prix varient selon le secteur précis, l&apos;état de la propriété et les conditions du marché. Mise à jour : mars 2026.
              </div>

              {/* Composant données ville */}
              <DonneesVille villeSlug={ville} villeNom={city.nom} stats={stats} />

              {/* FAQ */}
              <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>Questions fréquentes | {city.nom}</h2>
                <dl className="space-y-4">
                  {city.faq.map((item) => (
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
                    { href: "/calculatrice-hypothecaire", label: "Calculatrice hypothécaire", desc: "Estimez vos paiements mensuels et le coût total de votre prêt." },
                    { href: "/estimation", label: "Estimation de valeur", desc: "Estimez la valeur marchande d\u2019une propriété dans votre quartier." },
                    { href: "/comparer-quartiers", label: "Comparer les quartiers", desc: "Comparez les prix, tendances et profil de deux quartiers." },
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
              {/* Lien vers toutes les données */}
              <Link href="/donnees-marche" className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center" style={{ background: "var(--green)" }}>
                ← Toutes les villes
              </Link>

              {/* Posts populaires */}
              {popularPosts.length > 0 && (
                <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                  <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
                    <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Discussions populaires</h3>
                  </div>
                  <ul>
                    {popularPosts.map((post, i) => (
                      <li key={post.id} style={{ borderBottom: i < popularPosts.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                        <Link href={`/post/${post.id}`} className="flex flex-col gap-1 px-4 py-3 transition-colors hover-bg">
                          <span className="text-[12px] font-medium leading-snug line-clamp-2" style={{ color: "var(--text-primary)" }}>{post.titre}</span>
                          <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{post.quartier.nom} · {post.nbVotes} votes</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ressources utiles */}
              <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Ressources utiles</h3>
                </div>
                <ul>
                  {ressources.map((r, i) => (
                    <li key={r.label} style={{ borderBottom: i < ressources.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                      <Link href={r.href} className="flex items-center justify-between px-4 py-2.5 transition-colors hover-bg">
                        <span className="text-[13px]" style={{ color: "var(--text-primary)" }}>{r.label}</span>
                        <svg className="w-3 h-3 shrink-0" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-[11px] text-center px-2" style={{ color: "var(--text-tertiary)" }}>© 2026 nid.local | Fait au Québec</p>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
