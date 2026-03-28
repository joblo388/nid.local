import Link from "next/link";
import { Header } from "@/components/Header";
import { EstimationClient } from "./EstimationClient";
import { prisma } from "@/lib/prisma";
import { dbPostToAppPost, ressourcesUtiles } from "@/lib/data";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";
const PAGE_URL = `${BASE_URL}/estimation`;

export const metadata: Metadata = {
  title: "Estimation de valeur immobiliere Quebec 2026 — Estimez votre propriete",
  description:
    "Estimez gratuitement la valeur de votre propriete au Quebec. Basee sur les donnees medianes du marche par quartier, type de propriete, superficie et etat. Resultats instantanes.",
  keywords: [
    "estimation valeur propriete",
    "estimation immobiliere quebec",
    "valeur maison quebec",
    "combien vaut ma maison",
    "estimation prix maison",
    "evaluation immobiliere",
    "prix propriete quebec",
    "valeur condo quebec",
    "estimation plex",
    "valeur marchande propriete",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Estimation de valeur immobiliere Quebec 2026 — Estimez votre propriete",
    description:
      "Estimez la valeur de votre propriete selon les donnees medianes du marche quebecois par quartier et type de propriete.",
    url: PAGE_URL,
    siteName: "nid.local",
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Estimation de valeur immobiliere Quebec 2026",
    description:
      "Estimez gratuitement la valeur de votre propriete au Quebec. Donnees de marche par quartier, ajustements personnalises.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "nid.local", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Estimation de valeur", "item": PAGE_URL },
      ],
    },
    {
      "@type": "WebApplication",
      "name": "Estimation de valeur immobiliere Quebec — nid.local",
      "url": PAGE_URL,
      "description":
        "Estimez la valeur de votre propriete au Quebec selon les donnees medianes du marche par quartier, type de propriete, superficie, chambres, salles de bain, annee de construction et etat.",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All",
      "inLanguage": "fr-CA",
      "isAccessibleForFree": true,
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "CAD" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Comment est calculee l'estimation de valeur?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "L'estimation se base sur le prix median du marche pour votre quartier et type de propriete, puis applique des ajustements pour la superficie, le nombre de chambres et salles de bain, l'annee de construction et l'etat general. Le resultat est une estimation indicative avec une fourchette de +/- 10%.",
          },
        },
        {
          "@type": "Question",
          "name": "Quelle est la precision de cette estimation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Cette estimation est fournie a titre indicatif seulement. La valeur reelle peut varier en fonction de l'emplacement exact, des renovations effectuees, du terrain, de la vue et des conditions du marche. Pour une evaluation precise, consultez un evaluateur agree ou un courtier immobilier.",
          },
        },
        {
          "@type": "Question",
          "name": "Quels types de propriete sont supportes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "L'outil supporte les maisons unifamiliales, les condos, les duplex, les triplex et les quadruplex. Les donnees de marche couvrent plus de 50 quartiers a travers le Quebec, incluant Montreal, Quebec, Laval, Longueuil, Sherbrooke, Gatineau et d'autres villes.",
          },
        },
      ],
    },
  ],
};

const ressources = ressourcesUtiles;

export default async function EstimationPage() {
  const dbPosts = await prisma.post.findMany({
    orderBy: [{ epingle: "desc" }, { nbVotes: "desc" }],
    take: 5,
  });
  const popularPosts = dbPosts.map(dbPostToAppPost);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
        <Header />
        <main className="max-w-[1100px] mx-auto px-3 md:px-5 py-4 md:py-6 pb-20 md:pb-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[12px] mb-5" style={{ color: "var(--text-tertiary)" }} aria-label="Fil d'Ariane">
            <Link href="/" className="transition-opacity hover:opacity-70" style={{ color: "var(--text-tertiary)" }}>
              nid.local
            </Link>
            <span>/</span>
            <span style={{ color: "var(--text-secondary)" }}>Estimation de valeur</span>
          </nav>

          <div className="flex gap-5 items-start">
            {/* Main column */}
            <div className="flex-1 min-w-0 space-y-5">
              <div>
                <h1 className="text-[22px] font-bold leading-snug mb-2" style={{ color: "var(--text-primary)" }}>
                  Estimation de valeur
                </h1>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Estimez la valeur de votre propriete selon les donnees medianes du marche quebecois. Selectionnez votre
                  quartier, le type de propriete et ses caracteristiques pour obtenir une estimation personnalisee.
                </p>
              </div>

              {/* Estimation tool */}
              <div
                className="rounded-xl p-6"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <EstimationClient />
              </div>

              {/* How it works */}
              <div
                className="rounded-xl p-6 space-y-3"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Comment fonctionne l&apos;estimation
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      n: "1",
                      titre: "Selectionnez votre quartier",
                      texte: "Choisissez la ville et le quartier de votre propriete. Les donnees de marche specifiques a votre secteur sont utilisees comme base.",
                    },
                    {
                      n: "2",
                      titre: "Decrivez votre propriete",
                      texte: "Entrez le type, la superficie, le nombre de chambres et de salles de bain, l'annee de construction et l'etat general.",
                    },
                    {
                      n: "3",
                      titre: "Obtenez votre estimation",
                      texte: "L'outil calcule la valeur estimee avec une ventilation des ajustements appliques et une fourchette de prix.",
                    },
                  ].map((step) => (
                    <div key={step.n} className="flex gap-3">
                      <div
                        className="w-6 h-6 rounded-full text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5 text-white"
                        style={{ background: "var(--green)" }}
                      >
                        {step.n}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{step.titre}</p>
                        <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{step.texte}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Factors explained */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Facteurs d&apos;ajustement
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      titre: "Superficie",
                      texte: "La superficie est comparee a la moyenne pour le type de propriete (unifamiliale ~1 200 pi², condo ~800 pi², plex ~2 400 pi²). L'ajustement est proportionnel a l'ecart.",
                      couleur: "var(--blue-bg)",
                      textColor: "var(--blue-text)",
                    },
                    {
                      titre: "Chambres et salles de bain",
                      texte: "Chaque chambre supplementaire au-dela de 2 ajoute 3% a la valeur de base. Chaque salle de bain supplementaire au-dela de 1 ajoute 2%.",
                      couleur: "var(--green-light-bg)",
                      textColor: "var(--green-text)",
                    },
                    {
                      titre: "Annee de construction",
                      texte: "Les constructions recentes (moins de 5 ans) beneficient d'une prime de 5%. Les proprietes de plus de 60 ans subissent un rabais de 6%.",
                      couleur: "var(--amber-bg)",
                      textColor: "var(--amber-text)",
                    },
                    {
                      titre: "Etat general",
                      texte: "Excellent : +5%, Bon : aucun ajustement, Moyen : -5%, A renover : -15%. L'etat reflete la condition generale de la propriete.",
                      couleur: "var(--red-bg)",
                      textColor: "var(--red-text)",
                    },
                  ].map((rule) => (
                    <div key={rule.titre} className="flex gap-3 p-3 rounded-lg" style={{ background: rule.couleur }}>
                      <div className="flex-1">
                        <p className="text-[12px] font-semibold mb-0.5" style={{ color: rule.textColor }}>{rule.titre}</p>
                        <p className="text-[12px] leading-relaxed" style={{ color: rule.textColor, opacity: 0.85 }}>{rule.texte}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Questions frequentes
                </h2>
                <dl className="space-y-4">
                  {[
                    {
                      q: "Comment est calculee la valeur estimee?",
                      r: "L'estimation part du prix median du marche pour votre quartier et type de propriete, puis applique des ajustements bases sur la superficie, le nombre de chambres et de salles de bain, l'annee de construction et l'etat general. La fourchette affichee represente +/- 10% de la valeur estimee.",
                    },
                    {
                      q: "Est-ce que cette estimation remplace une evaluation professionnelle?",
                      r: "Non. Cette estimation est fournie a titre indicatif seulement. Pour une transaction immobiliere, une evaluation par un evaluateur agree ou une analyse comparative de marche par un courtier immobilier est fortement recommandee.",
                    },
                    {
                      q: "D'ou proviennent les donnees de marche?",
                      r: "Les prix medians utilises sont bases sur les donnees du marche immobilier quebecois disponibles dans notre section Donnees de marche. Ils couvrent plus de 50 quartiers a travers les principales villes du Quebec.",
                    },
                    {
                      q: "Mon quartier n'apparait pas dans la liste. Que faire?",
                      r: "Si votre quartier n'est pas disponible, selectionnez la ville la plus proche. L'outil utilisera les donnees moyennes disponibles pour cette ville. Pour une estimation plus precise, consultez un courtier immobilier local.",
                    },
                  ].map((item) => (
                    <div key={item.q} className="pb-4" style={{ borderBottom: "0.5px solid var(--border)" }}>
                      <dt className="text-[13px] font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                        {item.q}
                      </dt>
                      <dd className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {item.r}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* CTA */}
              <div
                className="rounded-xl p-6 text-center space-y-3"
                style={{ background: "var(--green-light-bg)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--green-text)" }}>
                  Vous connaissez maintenant la valeur estimee de votre propriete
                </h2>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--green-text)", opacity: 0.85 }}>
                  Calculez votre paiement hypothecaire, explorez les annonces ou echangez avec la communaute.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Link
                    href="/calculatrice-hypothecaire"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: "var(--green)" }}
                  >
                    Calculatrice hypothecaire →
                  </Link>
                  <Link
                    href="/annonces"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-80"
                    style={{ background: "var(--bg-card)", color: "var(--green-text)", border: "0.5px solid var(--border)" }}
                  >
                    Voir les annonces
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden md:flex flex-col gap-3 w-[240px] shrink-0">
              <Link
                href="/"
                className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: "var(--green)" }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Voir les discussions
              </Link>

              {popularPosts.length > 0 && (
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
                    <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                      Discussions populaires
                    </h3>
                  </div>
                  <ul>
                    {popularPosts.map((post, i) => (
                      <li key={post.id} style={{ borderBottom: i < popularPosts.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                        <Link href={`/post/${post.id}`} className="flex flex-col gap-1 px-4 py-3 transition-colors hover-bg">
                          <span className="text-[12px] font-medium leading-snug line-clamp-2" style={{ color: "var(--text-primary)" }}>
                            {post.titre}
                          </span>
                          <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                            {post.quartier.nom} · {post.nbVotes} vote{post.nbVotes !== 1 ? "s" : ""}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="px-4 py-2.5">
                    <Link href="/" className="text-[12px] font-medium transition-opacity hover:opacity-70" style={{ color: "var(--green)" }}>
                      Toutes les discussions →
                    </Link>
                  </div>
                </div>
              )}

              <div
                className="rounded-xl overflow-hidden"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                    Ressources utiles
                  </h3>
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

              {/* About the tool */}
              <div
                className="rounded-xl p-4 space-y-2"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                  A propos de l&apos;outil
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  L&apos;estimation utilise les prix medians du marche par quartier et applique des ajustements bases sur les
                  caracteristiques de votre propriete.
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Pour une evaluation officielle, consultez un <strong>evaluateur agree</strong> ou un <strong>courtier immobilier</strong>.
                </p>
              </div>

              <p className="text-[11px] text-center px-2" style={{ color: "var(--text-tertiary)" }}>
                © 2026 nid.local — Fait au Quebec
              </p>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
