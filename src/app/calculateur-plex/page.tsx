import Link from "next/link";
import { Header } from "@/components/Header";
import { CommunityCTA } from "@/components/CommunityCTA";
import { CalculateurPlex } from "./CalculateurPlex";
import { CalcActions } from "@/components/CalcActions";
import { prisma } from "@/lib/prisma";
import { dbPostToAppPost, ressourcesUtiles } from "@/lib/data";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";
const PAGE_URL = `${BASE_URL}/calculateur-plex`;

export const metadata: Metadata = {
  title: "Calculateur rentabilité plex Québec 2026 | MRB et cashflow",
  description:
    "Calculez gratuitement le MRB, cashflow mensuel, rendement sur mise de fonds et prise de valeur sur 5 ans pour un duplex, triplex ou quadruplex au Québec. Résultats instantanés.",
  keywords: [
    "calculateur plex", "MRB plex québec", "cashflow duplex", "rendement triplex",
    "calculateur rendement immobilier", "investissement plex montréal", "multiplicateur revenus bruts",
    "cashflow plex québec", "rendement immobilier duplex", "calculer MRB",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Calculateur rentabilité plex Québec 2026 | MRB et cashflow",
    description: "Calculez le MRB, cashflow et rendement sur mise de fonds pour un duplex, triplex ou quadruplex au Québec.",
    url: PAGE_URL,
    siteName: "nid.local",
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculateur rentabilité plex Québec 2026 | MRB et cashflow",
    description: "MRB, cashflow mensuel, rendement et projection 5 ans pour les plex au Québec. Gratuit et instantané.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "nid.local", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Calculateur plex", item: PAGE_URL },
      ],
    },
    {
      "@type": "WebApplication",
      name: "Calculateur plex Québec | nid.local",
      url: PAGE_URL,
      description: "Calculez le MRB, cashflow mensuel, rendement sur mise de fonds et prise de valeur sur 5 ans pour un duplex, triplex ou quadruplex au Québec.",
      applicationCategory: "FinanceApplication",
      operatingSystem: "All",
      inLanguage: "fr-CA",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Qu'est-ce que le MRB en immobilier?", acceptedAnswer: { "@type": "Answer", text: "Le MRB (Multiplicateur de Revenus Bruts) est le ratio entre le prix d'achat d'un immeuble à revenus et ses revenus locatifs annuels bruts. Par exemple, un duplex à 600 000 $ avec 36 000 $ de loyers annuels a un MRB de 16,7×. Un MRB sous 12× est considéré excellent au Québec, entre 12-15× acceptable, et au-dessus de 18× le rendement est limité." } },
        { "@type": "Question", name: "Comment calculer le cashflow d'un plex?", acceptedAnswer: { "@type": "Answer", text: "Le cashflow = Revenus locatifs mensuels - Paiement hypothécaire mensuel - Dépenses mensualisées (taxes, assurances, entretien). Un cashflow positif signifie que la propriété s'autofinance. Au Québec, avec les taux hypothécaires de 2026, un cashflow positif sur un plex nécessite généralement un MRB inférieur à 14×." } },
        { "@type": "Question", name: "Quel rendement viser pour un investissement plex au Québec?", acceptedAnswer: { "@type": "Answer", text: "Un rendement sur mise de fonds (cashflow annuel / mise de fonds) de 8-12% est considéré bon pour l'immobilier locatif au Québec. Ce rendement ne tient pas compte de la prise de valeur, qui ajoute historiquement environ 3% par an au Québec. Le rendement total (cashflow + appréciation) se situe souvent entre 12-20% par an." } },
        { "@type": "Question", name: "Quelle est la mise de fonds minimale pour un plex au Québec?", acceptedAnswer: { "@type": "Answer", text: "Pour un duplex occupé par le propriétaire, la mise de fonds minimale est de 5%. Pour un triplex ou quadruplex occupant, c'est 10%. Pour un immeuble non-occupant (investissement pur), la mise de fonds minimale est de 20%. Pour 5 logements et plus, le financement est commercial avec un minimum de 25% généralement." } },
        { "@type": "Question", name: "Comment l'appréciation immobilière est-elle calculée?", acceptedAnswer: { "@type": "Answer", text: "Notre calculateur utilise une appréciation annuelle de 3%, qui correspond à la moyenne historique au Québec sur les 20 dernières années. L'appréciation réelle varie selon le quartier, le type de propriété et les conditions du marché. À Montréal, certains quartiers comme Rosemont et Villeray ont connu des appréciations supérieures à 5% par an récemment." } },
      ],
    },
  ],
};

const ressources = ressourcesUtiles;

export default async function CalculateurPlexPage() {
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
          <span style={{ color: "var(--text-secondary)" }}>Calculateur plex</span>
        </nav>

        <div className="flex gap-5 items-start">
          {/* Main */}
          <div className="flex-1 min-w-0 space-y-5">
            <div>
              <h1 className="text-[22px] font-bold leading-snug mb-2" style={{ color: "var(--text-primary)" }}>
                Calculateur de rendement plex
              </h1>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Estimez le MRB, cashflow mensuel, rendement sur mise de fonds et prise de valeur sur 5 ans pour un duplex, triplex ou quadruplex au Québec.
              </p>
            </div>

            {/* Calculator */}
            <div className="rounded-xl p-6" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
              <CalculateurPlex />
              <CalcActions />
            </div>

            {/* How to use */}
            <div className="rounded-xl p-6 space-y-3" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
              <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>Comment utiliser ce calculateur</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { n: "1", titre: "Entrez le prix et la mise de fonds", texte: "Le taux hypothécaire et l'amortissement déterminent votre paiement mensuel selon les règles canadiennes (composition semestrielle)." },
                  { n: "2", titre: "Ajoutez les revenus locatifs", texte: "Entrez le loyer de chaque unité. Les unités 3 et 4 sont optionnelles pour les duplex." },
                  { n: "3", titre: "Analysez le rendement", texte: "Le MRB, le cashflow mensuel, le rendement sur mise de fonds et la projection sur 5 ans sont calculés instantanément." },
                ].map((step) => (
                  <div key={step.n} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5 text-white" style={{ background: "var(--green)" }}>{step.n}</div>
                    <div>
                      <p className="text-[13px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{step.titre}</p>
                      <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{step.texte}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key concepts */}
            <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
              <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>Comprendre les indicateurs</h2>
              <div className="space-y-3">
                {[
                  { titre: "MRB (Multiplicateur de Revenus Bruts)", texte: "Le MRB = Prix / Revenus annuels bruts. Un MRB sous 12× est excellent, entre 12-15× acceptable, au-dessus de 18× le rendement est limité. C'est le premier indicateur regardé par les investisseurs.", couleur: "var(--green-light-bg)", textColor: "var(--green-text)" },
                  { titre: "Cashflow", texte: "Le cashflow = Revenus locatifs - Hypothèque - Dépenses. Un cashflow positif signifie que la propriété s'autofinance. Un cashflow négatif veut dire que vous devrez injecter de l'argent chaque mois.", couleur: "var(--blue-bg)", textColor: "var(--blue-text)" },
                  { titre: "Rendement sur mise de fonds", texte: "Le cashflow annuel divisé par la mise de fonds initiale. Permet de comparer le rendement avec d'autres investissements. Un rendement de 8-12% est considéré bon pour l'immobilier.", couleur: "var(--amber-bg)", textColor: "var(--amber-text)" },
                  { titre: "Projection sur 5 ans", texte: "Basée sur une appréciation annuelle de 3% (moyenne historique au Québec) et des loyers stables. Le retour total combine le gain en valeur et le cashflow cumulé.", couleur: "var(--bg-secondary)", textColor: "var(--text-secondary)" },
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
            <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
              <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>Questions fréquentes sur l&apos;investissement plex</h2>
              <dl className="space-y-4">
                {[
                  { q: "Qu'est-ce que le MRB en immobilier?", r: "Le MRB (Multiplicateur de Revenus Bruts) est le ratio entre le prix d'achat et les revenus locatifs annuels bruts. Un MRB sous 12× est excellent au Québec, entre 12-15× acceptable, au-dessus de 18× le rendement est limité." },
                  { q: "Comment calculer le cashflow d'un plex?", r: "Cashflow = Revenus locatifs - Hypothèque - Dépenses (taxes, assurances, entretien). Un cashflow positif signifie que la propriété s'autofinance." },
                  { q: "Quel rendement viser pour un plex au Québec?", r: "Un rendement sur mise de fonds de 8-12% est considéré bon. Ce rendement ne tient pas compte de la prise de valeur, qui ajoute historiquement environ 3% par an au Québec." },
                  { q: "Quelle mise de fonds pour un plex?", r: "Duplex occupant : 5% minimum. Triplex/quadruplex occupant : 10%. Non-occupant : 20%. 5+ logements : financement commercial, généralement 25%." },
                  { q: "L'appréciation de 3% est-elle réaliste?", r: "3% correspond à la moyenne historique au Québec sur 20 ans. Certains quartiers de Montréal (Rosemont, Villeray) ont connu des appréciations supérieures à 5% par an récemment." },
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
                  { href: "/calculatrice-hypothecaire", label: "Calculatrice hypoth\u00e9caire", desc: "Calculez votre paiement mensuel et la prime SCHL." },
                  { href: "/donnees-marche", label: "Donn\u00e9es de march\u00e9", desc: "Prix m\u00e9dians et tendances par ville et quartier au Qu\u00e9bec." },
                  { href: "/estimation", label: "Estimation de valeur", desc: "Estimez la valeur marchande d\u2019une propri\u00e9t\u00e9 dans votre quartier." },
                ].map((tool) => (
                  <Link key={tool.href} href={tool.href} className="p-3 rounded-lg transition-colors hover-bg" style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)" }}>
                    <p className="text-[13px] font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{tool.label}</p>
                    <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{tool.desc}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <CommunityCTA contexte="plex" />
          </div>

          {/* Sidebar */}
          <aside className="hidden md:flex flex-col gap-3 w-[240px] shrink-0">
            <Link href="/annonces" className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2" style={{ background: "var(--green)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
              Voir les annonces
            </Link>

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
                        <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{post.quartier.nom} · {post.nbVotes} vote{post.nbVotes !== 1 ? "s" : ""}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
              <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Ressources utiles</h3>
              </div>
              <ul>
                {ressources.map((r, i) => (
                  <li key={r.label} style={{ borderBottom: i < ressources.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                    <Link href={r.href} className="flex items-center justify-between px-4 py-2.5 transition-colors hover-bg">
                      <span className="text-[13px]" style={{ color: "var(--text-primary)" }}>{r.label}</span>
                      <svg className="w-3 h-3 shrink-0" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>À propos de l&apos;outil</p>
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Les calculs utilisent la composition semestrielle canadienne. L&apos;appréciation est estimée à 3% par an (moyenne historique québécoise).
              </p>
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Pour une analyse personnalisée, consultez un <strong>courtier immobilier</strong>.
              </p>
            </div>

            <p className="text-[11px] text-center px-2" style={{ color: "var(--text-tertiary)" }}>© 2026 nid.local | Fait au Québec</p>
          </aside>
        </div>
      </main>
    </div>
    </>
  );
}
