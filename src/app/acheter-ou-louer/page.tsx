import Link from "next/link";
import { Header } from "@/components/Header";
import { AcheterOuLouer } from "./AcheterOuLouer";
import { prisma } from "@/lib/prisma";
import { dbPostToAppPost, ressourcesUtiles } from "@/lib/data";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";
const PAGE_URL = `${BASE_URL}/acheter-ou-louer`;

export const metadata: Metadata = {
  title: "Acheter ou louer au Québec en 2026 — Comparateur gratuit",
  description:
    "Comparez gratuitement le coût réel d'acheter versus louer au Québec sur votre horizon de temps. Hypothèque, taxes, appréciation, épargne — tous les facteurs sont pris en compte.",
  keywords: [
    "acheter ou louer québec", "acheter ou louer montréal", "comparateur acheter louer",
    "calculateur acheter vs louer", "coût achat vs location québec", "vaut-il mieux acheter ou louer",
    "immobilier québec acheter louer 2026", "simulateur achat location",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Acheter ou louer au Québec en 2026 — Comparateur gratuit",
    description: "Comparez le coût réel d'acheter vs louer au Québec. Hypothèque, taxes, appréciation et épargne inclus.",
    url: PAGE_URL,
    siteName: "nid.local",
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Acheter ou louer au Québec en 2026?",
    description: "Comparateur gratuit — coût réel sur votre horizon de temps, avec tous les facteurs financiers.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "nid.local", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Acheter ou louer?", item: PAGE_URL },
      ],
    },
    {
      "@type": "WebApplication",
      name: "Acheter ou louer au Québec — nid.local",
      url: PAGE_URL,
      description: "Comparez le coût réel d'acheter versus louer au Québec. Prise en compte de l'hypothèque, taxes, appréciation, coût d'opportunité et épargne du locataire.",
      applicationCategory: "FinanceApplication",
      operatingSystem: "All",
      inLanguage: "fr-CA",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Vaut-il mieux acheter ou louer au Québec en 2026?", acceptedAnswer: { "@type": "Answer", text: "La réponse dépend de votre situation : horizon de temps, mise de fonds disponible, loyer actuel, taux hypothécaire et appréciation immobilière dans votre quartier. En règle générale, acheter devient plus avantageux après 5-7 ans grâce à l'appréciation. Notre comparateur calcule le coût net réel sur votre horizon en tenant compte de tous les facteurs." } },
        { "@type": "Question", name: "Quels facteurs influencent la décision acheter vs louer?", acceptedAnswer: { "@type": "Answer", text: "Les principaux facteurs sont : le prix d'achat, la mise de fonds, le taux hypothécaire, les taxes municipales, l'entretien, l'appréciation immobilière, le loyer équivalent, les hausses de loyer, et le rendement de l'épargne du locataire. Le coût d'opportunité de la mise de fonds (rendement que vous auriez eu en plaçant cet argent ailleurs) est souvent négligé mais crucial." } },
        { "@type": "Question", name: "Qu'est-ce que le coût d'opportunité de la mise de fonds?", acceptedAnswer: { "@type": "Answer", text: "C'est le rendement que vous auriez obtenu en investissant votre mise de fonds ailleurs (bourse, obligations, etc.) plutôt que dans l'immobilier. Par exemple, une mise de fonds de 100 000 $ placée à 4% génère 4 000 $ par an. Notre comparateur intègre ce coût dans l'analyse d'achat pour une comparaison juste." } },
        { "@type": "Question", name: "Après combien d'années acheter devient-il plus avantageux?", acceptedAnswer: { "@type": "Answer", text: "Au Québec, avec une appréciation de 3% par an et les conditions de marché de 2026, acheter devient généralement plus avantageux après 4 à 7 ans. Ce seuil varie selon le ratio prix/loyer de votre marché local. Utilisez le curseur d'horizon dans notre comparateur pour trouver votre point d'équilibre." } },
        { "@type": "Question", name: "Comment l'épargne du locataire est-elle calculée?", acceptedAnswer: { "@type": "Answer", text: "Si le coût mensuel d'achat est supérieur au loyer, le locataire peut placer la différence chaque mois. Notre comparateur calcule la valeur future de cette épargne mensuelle au taux de rendement que vous indiquez (par défaut 4%). Cette épargne accumulée est déduite du coût total de la location." } },
      ],
    },
  ],
};

const ressources = ressourcesUtiles;

export default async function AcheterOuLouerPage() {
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
        <main className="max-w-[1100px] mx-auto px-5 py-6">
          <nav className="flex items-center gap-1.5 text-[12px] mb-5" style={{ color: "var(--text-tertiary)" }}>
            <Link href="/" className="transition-opacity hover:opacity-70" style={{ color: "var(--text-tertiary)" }}>nid.local</Link>
            <span>/</span>
            <span style={{ color: "var(--text-secondary)" }}>Acheter ou louer?</span>
          </nav>

          <div className="flex gap-5 items-start">
            <div className="flex-1 min-w-0 space-y-5">
              <div>
                <h1 className="text-[22px] font-bold leading-snug mb-2" style={{ color: "var(--text-primary)" }}>
                  Acheter ou louer au Québec?
                </h1>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Comparez le coût réel d&apos;acheter versus louer sur votre horizon de temps. Hypothèque, taxes, appréciation, coût d&apos;opportunité et épargne du locataire — tous les facteurs sont pris en compte.
                </p>
              </div>

              <div className="rounded-xl p-6" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                <AcheterOuLouer />
              </div>

              {/* How it works */}
              <div className="rounded-xl p-6 space-y-3" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>Comment fonctionne le comparateur</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { n: "1", titre: "Entrez vos chiffres", texte: "Prix d'achat, mise de fonds, loyer actuel et dépenses. Les valeurs par défaut reflètent le marché montréalais de 2026." },
                    { n: "2", titre: "Ajustez l'horizon", texte: "Utilisez le curseur pour voir comment le résultat change selon la durée. Acheter est souvent plus avantageux après 5-7 ans." },
                    { n: "3", titre: "Analysez le verdict", texte: "Le comparateur tient compte de tous les coûts cachés : intérêts, taxes, coût d'opportunité, épargne du locataire et appréciation." },
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

              {/* Key factors */}
              <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>Les facteurs clés de la décision</h2>
                <div className="space-y-3">
                  {[
                    { titre: "Appréciation immobilière", texte: "Au Québec, l'immobilier s'apprécie en moyenne de 3% par an. C'est le facteur qui fait pencher la balance vers l'achat à long terme. Certains quartiers de Montréal ont connu des hausses supérieures à 5%.", couleur: "var(--green-light-bg)", textColor: "var(--green-text)" },
                    { titre: "Coût d'opportunité", texte: "Votre mise de fonds placée en bourse ou en obligations générerait un rendement. Ce coût caché de l'achat est souvent négligé mais peut représenter des milliers de dollars par an.", couleur: "var(--blue-bg)", textColor: "var(--blue-text)" },
                    { titre: "Hausse des loyers", texte: "Au Québec, les hausses sont encadrées par le TAL mais atteignent 3-5% par an en 2026. Sur 10 ans, un loyer de 2 200 $ peut devenir 2 960 $ avec 3% de hausse annuelle.", couleur: "var(--amber-bg)", textColor: "var(--amber-text)" },
                    { titre: "Horizon de temps", texte: "Les frais d'achat (notaire, taxe de bienvenue, déménagement) sont absorbés sur la durée. Si vous prévoyez rester moins de 3-4 ans, louer est presque toujours plus avantageux.", couleur: "var(--bg-secondary)", textColor: "var(--text-secondary)" },
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
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>Questions fréquentes</h2>
                <dl className="space-y-4">
                  {[
                    { q: "Vaut-il mieux acheter ou louer au Québec en 2026?", r: "Ça dépend de votre horizon. Acheter devient généralement plus avantageux après 5-7 ans grâce à l'appréciation. Utilisez le curseur d'horizon pour trouver votre point d'équilibre." },
                    { q: "Qu'est-ce que le coût d'opportunité de la mise de fonds?", r: "C'est le rendement que vous auriez eu en plaçant votre mise de fonds ailleurs. 100 000 $ à 4% = 4 000 $/an manqués. Ce coût est intégré dans l'analyse d'achat." },
                    { q: "Comment l'épargne du locataire est-elle calculée?", r: "Si l'achat coûte plus cher mensuellement, le locataire place la différence au taux de rendement indiqué. Cette épargne accumulée est déduite du coût de la location." },
                    { q: "Pourquoi le résultat change-t-il autant selon l'horizon?", r: "À court terme, les frais fixes de l'achat (intérêts élevés, taxes) dominent. À long terme, l'appréciation immobilière et le remboursement du capital font pencher la balance vers l'achat." },
                    { q: "Les frais de notaire et taxe de bienvenue sont-ils inclus?", r: "Non, ces frais ponctuels ne sont pas inclus dans ce comparateur. Ajoutez environ 2-3% du prix d'achat pour avoir une vue complète (notaire ~1 500 $, taxe de bienvenue variable selon la municipalité)." },
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
                <h2 className="text-[15px] font-bold" style={{ color: "var(--green-text)" }}>
                  Prêt à passer à l&apos;action?
                </h2>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--green-text)", opacity: 0.85 }}>
                  Parcourez les annonces immobilières publiées par des propriétaires sur nid.local, ou posez vos questions à la communauté.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Link href="/annonces" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "var(--green)" }}>
                    Voir les annonces →
                  </Link>
                  <Link href="/calculatrice-hypothecaire" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-80" style={{ background: "var(--bg-card)", color: "var(--green-text)", border: "0.5px solid var(--border)" }}>
                    Calculatrice hypothécaire
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden md:flex flex-col gap-3 w-[240px] shrink-0">
              <Link href="/annonces" className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2" style={{ background: "var(--green)" }}>
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
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>À propos</p>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Ce comparateur tient compte des intérêts (composition semestrielle canadienne), taxes, entretien, appréciation, coût d&apos;opportunité et épargne du locataire.
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Pour une analyse personnalisée, consultez un <strong>planificateur financier</strong>.
                </p>
              </div>

              <p className="text-[11px] text-center px-2" style={{ color: "var(--text-tertiary)" }}>© 2026 nid.local — Fait au Québec</p>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
