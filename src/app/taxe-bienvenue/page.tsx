import Link from "next/link";
import { Header } from "@/components/Header";
import { CommunityCTA } from "@/components/CommunityCTA";
import { TaxeBienvenueClient } from "./TaxeBienvenueClient";
import { prisma } from "@/lib/prisma";
import { dbPostToAppPost, ressourcesUtiles } from "@/lib/data";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";
const PAGE_URL = `${BASE_URL}/taxe-bienvenue`;

export const metadata: Metadata = {
  title: "Calculateur taxe de bienvenue Québec 2026 | Droits de mutation",
  description:
    "Calculez la taxe de bienvenue (droits de mutation immobilière) pour votre achat au Québec. Montréal, Laval, Québec et toutes les villes.",
  keywords: [
    "taxe de bienvenue",
    "droits de mutation",
    "calculateur",
    "Québec",
    "Montréal",
    "droits de mutation immobilière",
    "taxe de bienvenue Québec",
    "taxe de bienvenue Montréal",
    "taxe mutation immobilière",
    "calculateur taxe bienvenue",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Calculateur taxe de bienvenue Québec 2026 | Droits de mutation",
    description:
      "Calculez la taxe de bienvenue (droits de mutation immobilière) pour votre achat au Québec. Montréal, Laval, Québec et toutes les villes.",
    url: PAGE_URL,
    siteName: "nid.local",
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculateur taxe de bienvenue Québec 2026",
    description:
      "Calculez la taxe de bienvenue pour votre achat immobilier au Québec. Taux par tranche, surcharge Montréal, exemptions premier achat.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "nid.local", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Taxe de bienvenue", item: PAGE_URL },
      ],
    },
    {
      "@type": "WebApplication",
      name: "Calculateur de taxe de bienvenue Québec | nid.local",
      url: PAGE_URL,
      description:
        "Calculez les droits de mutation immobilière (taxe de bienvenue) pour votre achat au Québec. Taux par tranche, surcharge Montréal, exemptions premier acheteur.",
      applicationCategory: "FinanceApplication",
      operatingSystem: "All",
      inLanguage: "fr-CA",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Qu'est-ce que la taxe de bienvenue au Québec?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La taxe de bienvenue, officiellement appelée droits de mutation immobilière, est un impôt prélevé par les municipalités du Québec lors du transfert de propriété d'un immeuble. Elle est calculée sur la base de la plus élevée entre le prix d'achat et la valeur inscrite au rôle d'évaluation municipale. Cette taxe est payable une seule fois, lors de l'achat.",
          },
        },
        {
          "@type": "Question",
          name: "Comment est calculée la taxe de bienvenue?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La taxe de bienvenue est calculée par tranches progressives : 0,5% sur les premiers 58 900 $, 1,0% de 58 900 $ à 294 600 $, et 1,5% sur le montant excédant 294 600 $. À Montréal, des taux plus élevés s'appliquent au-delà de 500 000 $, avec une taxe supplémentaire de 0,5% à 1,5% selon le prix.",
          },
        },
        {
          "@type": "Question",
          name: "Y a-t-il des exemptions pour les premiers acheteurs?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Certaines municipalités du Québec offrent des programmes de remboursement partiel ou total de la taxe de bienvenue pour les premiers acheteurs. Ces programmes varient d'une ville à l'autre. Par exemple, certaines villes remboursent la taxe pour les propriétés en dessous d'un certain seuil de prix. Vérifiez auprès de votre municipalité pour connaître les conditions spécifiques.",
          },
        },
        {
          "@type": "Question",
          name: "Quand doit-on payer la taxe de bienvenue?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La taxe de bienvenue doit être payée dans les 90 jours suivant la réception du compte envoyé par la municipalité, qui est émis après l'enregistrement de l'acte de vente au Bureau de la publicité des droits. En cas de retard, des intérêts de pénalité s'appliquent. Le montant ne peut pas être financé dans l'hypothèque, il doit être payé séparément.",
          },
        },
      ],
    },
  ],
};

const ressources = ressourcesUtiles;

export default async function TaxeBienvenuePage() {
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
            <span style={{ color: "var(--text-secondary)" }}>Taxe de bienvenue</span>
          </nav>

          <div className="flex gap-5 items-start">
            {/* Main column */}
            <div className="flex-1 min-w-0 space-y-5">
              <div>
                <h1 className="text-[22px] font-bold leading-snug mb-2" style={{ color: "var(--text-primary)" }}>
                  Calculateur de taxe de bienvenue Québec
                </h1>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Calculez les droits de mutation immobilière pour votre achat au Québec. Taux par tranche, surcharge
                  Montréal et exemptions pour premiers acheteurs inclus.
                </p>
              </div>

              {/* Calculator */}
              <div
                className="rounded-xl p-6"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <TaxeBienvenueClient />
              </div>

              {/* How it works */}
              <div
                className="rounded-xl p-6 space-y-3"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Comment fonctionne la taxe de bienvenue?
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      n: "1",
                      titre: "Base de calcul",
                      texte: "La taxe est calculée sur le montant le plus élevé entre le prix d'achat et la valeur au rôle d'évaluation municipale multipliée par le facteur comparatif.",
                    },
                    {
                      n: "2",
                      titre: "Taux par tranche",
                      texte: "Les taux sont progressifs : 0,5% sur les premiers 58 900 $, puis 1,0% et 1,5% sur les tranches suivantes. Montréal applique des taux plus élevés au-delà de 500 000 $.",
                    },
                    {
                      n: "3",
                      titre: "Paiement unique",
                      texte: "La taxe est payable une seule fois dans les 90 jours suivant la réception du compte. Elle ne peut pas être ajoutée à votre hypothèque.",
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

              {/* Rates table */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Barèmes des droits de mutation au Québec 2026
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      titre: "Taux de base (toutes les villes)",
                      texte: "0,5% sur les premiers 58 900 $, 1,0% de 58 900 $ à 294 600 $, 1,5% au-delà de 294 600 $.",
                      couleur: "var(--blue-bg)",
                      textColor: "var(--blue-text)",
                    },
                    {
                      titre: "Taux Montréal (au-delà de 500 000 $)",
                      texte: "2,0% de 500 000 $ à 1 000 000 $, 2,5% au-delà de 1 000 000 $. Ces taux remplacent le 1,5% de base.",
                      couleur: "var(--amber-bg)",
                      textColor: "var(--amber-text)",
                    },
                    {
                      titre: "Taxe supplémentaire de Montréal",
                      texte: "En plus des droits de base, Montréal prélève une surtaxe : 0,5% de 500 000 $ à 1 000 000 $, 1,0% de 1 M$ à 2 M$, 1,5% au-delà de 2 M$.",
                      couleur: "var(--red-bg)",
                      textColor: "var(--red-text)",
                    },
                    {
                      titre: "Exemptions possibles",
                      texte: "Certaines municipalités offrent un remboursement de la taxe pour les premiers acheteurs. Le transfert entre conjoints et certains liens de parenté directs peuvent aussi être exemptés.",
                      couleur: "var(--green-light-bg)",
                      textColor: "var(--green-text)",
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
                <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                  Ces barèmes sont à titre informatif. Consultez votre notaire pour les montants exacts applicables à votre transaction.
                </p>
              </div>

              {/* FAQ */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Questions fréquentes sur la taxe de bienvenue
                </h2>
                <dl className="space-y-4">
                  {[
                    {
                      q: "Qu'est-ce que la taxe de bienvenue au Québec?",
                      r: "La taxe de bienvenue, officiellement appelée droits de mutation immobilière, est un impôt prélevé par les municipalités lors du transfert de propriété d'un immeuble. Elle est calculée sur la base de la plus élevée entre le prix d'achat et la valeur inscrite au rôle d'évaluation municipale. Cette taxe est payable une seule fois, lors de l'achat.",
                    },
                    {
                      q: "Comment est calculée la taxe de bienvenue?",
                      r: "La taxe est calculée par tranches progressives : 0,5% sur les premiers 58 900 $, 1,0% de 58 900 $ à 294 600 $, et 1,5% sur le montant excédant 294 600 $. À Montréal, des taux plus élevés s'appliquent au-delà de 500 000 $, avec une taxe supplémentaire de 0,5% à 1,5% selon le prix.",
                    },
                    {
                      q: "Y a-t-il des exemptions pour les premiers acheteurs?",
                      r: "Certaines municipalités offrent un remboursement partiel ou total de la taxe de bienvenue pour les premiers acheteurs. Ces programmes varient d'une ville à l'autre. De plus, les transferts entre conjoints et certains liens de parenté directs peuvent être exemptés de la taxe.",
                    },
                    {
                      q: "Quand doit-on payer la taxe de bienvenue?",
                      r: "La taxe doit être payée dans les 90 jours suivant la réception du compte envoyé par la municipalité, après l'enregistrement de l'acte de vente. Le montant ne peut pas être financé dans l'hypothèque, il doit être payé séparément. En cas de retard, des intérêts de pénalité s'appliquent.",
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

              {/* Outils connexes */}
              <div className="rounded-xl p-6 space-y-3" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>Outils connexes</h2>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { href: "/frais-achat", label: "Frais d\u2019achat", desc: "Liste compl\u00e8te des frais \u00e0 pr\u00e9voir lors de l\u2019achat d\u2019une propri\u00e9t\u00e9." },
                    { href: "/calculatrice-hypothecaire", label: "Calculatrice hypoth\u00e9caire", desc: "Estimez votre paiement mensuel et la prime SCHL." },
                    { href: "/premier-acheteur", label: "Guide premier acheteur", desc: "CELIAPP, RAP et aide financi\u00e8re pour votre premier achat." },
                  ].map((tool) => (
                    <Link key={tool.href} href={tool.href} className="p-3 rounded-lg transition-colors hover-bg" style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)" }}>
                      <p className="text-[13px] font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{tool.label}</p>
                      <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{tool.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA community */}
              <CommunityCTA contexte="taxe" />
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

              {/* Sticky note about the tool */}
              <div
                className="rounded-xl p-4 space-y-2"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                  À propos de l&apos;outil
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Les calculs sont basés sur les barèmes de droits de mutation immobilière du Québec en vigueur en 2026.
                  La taxe supplémentaire de Montréal est incluse automatiquement.
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Pour le montant exact, consultez votre <strong>notaire</strong>.
                </p>
              </div>

              <p className="text-[11px] text-center px-2" style={{ color: "var(--text-tertiary)" }}>
                &copy; 2026 nid.local | Fait au Québec
              </p>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
