import Link from "next/link";
import { Header } from "@/components/Header";
import { CommunityCTA } from "@/components/CommunityCTA";
import { prisma } from "@/lib/prisma";
import { dbPostToAppPost, ressourcesUtiles } from "@/lib/data";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";
const PAGE_URL = `${BASE_URL}/frais-achat`;

export const metadata: Metadata = {
  title: "Frais d\u2019achat d\u2019une maison au Qu\u00e9bec 2026 \u2014 Liste compl\u00e8te et montants",
  description:
    "Tous les frais \u00e0 pr\u00e9voir lors de l\u2019achat d\u2019une propri\u00e9t\u00e9 au Qu\u00e9bec : notaire, inspection, taxe de bienvenue, assurance, d\u00e9m\u00e9nagement. Montants estimatifs et conseils pour \u00e9viter les surprises.",
  keywords: [
    "frais achat maison qu\u00e9bec",
    "frais de notaire achat maison qu\u00e9bec",
    "inspection pr\u00e9achat prix",
    "co\u00fbt achat maison",
    "frais cach\u00e9s achat maison",
    "taxe de bienvenue",
    "assurance titre",
    "frais d\u00e9m\u00e9nagement",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Frais d\u2019achat d\u2019une maison au Qu\u00e9bec 2026 \u2014 Liste compl\u00e8te et montants",
    description:
      "Tous les frais \u00e0 pr\u00e9voir lors de l\u2019achat d\u2019une propri\u00e9t\u00e9 au Qu\u00e9bec : notaire, inspection, taxe de bienvenue, assurance, d\u00e9m\u00e9nagement. Montants estimatifs et conseils.",
    url: PAGE_URL,
    siteName: "nid.local",
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frais d\u2019achat d\u2019une maison au Qu\u00e9bec 2026 \u2014 Liste compl\u00e8te",
    description:
      "Notaire, inspection, taxe de bienvenue, assurance titre, d\u00e9m\u00e9nagement\u2026 Tous les frais \u00e0 pr\u00e9voir pour acheter une propri\u00e9t\u00e9 au Qu\u00e9bec.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "nid.local", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Frais d\u2019achat", item: PAGE_URL },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Combien co\u00fbte un notaire pour l\u2019achat d\u2019une maison au Qu\u00e9bec?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les frais de notaire pour un achat immobilier au Qu\u00e9bec varient g\u00e9n\u00e9ralement entre 1\u00a0500\u00a0$ et 2\u00a0500\u00a0$. Ce montant couvre l\u2019examen des titres de propri\u00e9t\u00e9, la publication de l\u2019acte de vente au Registre foncier et, si applicable, la radiation de l\u2019ancienne hypoth\u00e8que. Les honoraires peuvent varier selon la complexit\u00e9 de la transaction.",
          },
        },
        {
          "@type": "Question",
          name: "L\u2019inspection pr\u00e9achat est-elle obligatoire au Qu\u00e9bec?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "L\u2019inspection pr\u00e9achat n\u2019est pas l\u00e9galement obligatoire au Qu\u00e9bec, mais elle est fortement recommand\u00e9e. Elle co\u00fbte entre 500\u00a0$ et 800\u00a0$ et permet de d\u00e9tecter des probl\u00e8mes de structure, toiture, plomberie ou \u00e9lectricit\u00e9 avant de finaliser l\u2019achat. Sans inspection, l\u2019acheteur assume tous les risques de vices cach\u00e9s.",
          },
        },
        {
          "@type": "Question",
          name: "Quel pourcentage du prix d\u2019achat pr\u00e9voir en frais suppl\u00e9mentaires?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "En r\u00e8gle g\u00e9n\u00e9rale, il faut pr\u00e9voir entre 3\u00a0% et 5\u00a0% du prix d\u2019achat en frais suppl\u00e9mentaires. Pour une maison \u00e0 450\u00a0000\u00a0$, cela repr\u00e9sente environ 17\u00a0000\u00a0$ \u00e0 25\u00a0000\u00a0$ en frais de notaire, inspection, taxe de bienvenue, assurances, d\u00e9m\u00e9nagement et ajustements de taxes.",
          },
        },
        {
          "@type": "Question",
          name: "Qui paie le certificat de localisation lors d\u2019un achat?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Au Qu\u00e9bec, c\u2019est g\u00e9n\u00e9ralement le vendeur qui fournit le certificat de localisation \u00e0 jour. Cependant, cette obligation doit \u00eatre pr\u00e9cis\u00e9e dans la promesse d\u2019achat. Si le certificat a plus de 10\u00a0ans ou si des travaux ont \u00e9t\u00e9 effectu\u00e9s, un nouveau certificat (1\u00a0500\u00a0$ \u00e0 2\u00a0000\u00a0$) sera n\u00e9cessaire.",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on inclure les frais d\u2019achat dans l\u2019hypoth\u00e8que?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non, les frais d\u2019achat (notaire, taxe de bienvenue, inspection, etc.) ne peuvent g\u00e9n\u00e9ralement pas \u00eatre financ\u00e9s par l\u2019hypoth\u00e8que au Qu\u00e9bec. Ces montants doivent \u00eatre pay\u00e9s comptant au moment de la transaction ou dans les semaines suivant l\u2019achat. Il est donc essentiel de les pr\u00e9voir dans son budget.",
          },
        },
      ],
    },
  ],
};

const fraisAchat = [
  {
    lettre: "a",
    titre: "Notaire",
    montant: "1\u00a0500\u00a0$ \u00e0 2\u00a0500\u00a0$",
    description: "Examen des titres de propri\u00e9t\u00e9, publication de l\u2019acte de vente au Registre foncier et radiation de l\u2019ancienne hypoth\u00e8que si applicable.",
    couleur: "var(--blue-bg)",
    textColor: "var(--blue-text)",
  },
  {
    lettre: "b",
    titre: "Inspection pr\u00e9achat",
    montant: "500\u00a0$ \u00e0 800\u00a0$",
    description: "Recommand\u00e9e m\u00eame si non obligatoire. Couvre la structure, la toiture, la plomberie et l\u2019\u00e9lectricit\u00e9. Un investissement qui peut vous \u00e9viter des milliers de dollars en r\u00e9parations.",
    couleur: "var(--green-light-bg)",
    textColor: "var(--green-text)",
  },
  {
    lettre: "c",
    titre: "Taxe de bienvenue (droits de mutation)",
    montant: "Variable",
    description: "Calcul\u00e9e par tranches progressives sur le plus \u00e9lev\u00e9 entre le prix d\u2019achat et l\u2019\u00e9valuation municipale.",
    lien: { href: "/taxe-bienvenue", label: "Calculer la taxe de bienvenue \u2192" },
    couleur: "var(--amber-bg)",
    textColor: "var(--amber-text)",
  },
  {
    lettre: "d",
    titre: "Assurance habitation",
    montant: "800\u00a0$ \u00e0 2\u00a0000\u00a0$/an",
    description: "Obligatoire si vous avez une hypoth\u00e8que. Couvre les dommages \u00e0 la propri\u00e9t\u00e9, le vol et la responsabilit\u00e9 civile. Magasinez plusieurs assureurs pour obtenir le meilleur taux.",
    couleur: "var(--blue-bg)",
    textColor: "var(--blue-text)",
  },
  {
    lettre: "e",
    titre: "Assurance titre",
    montant: "250\u00a0$ \u00e0 400\u00a0$ (une fois)",
    description: "Prot\u00e8ge contre les vices de titre cach\u00e9s, les empi\u00e9tements non d\u00e9clar\u00e9s et les erreurs dans les registres fonciers. Prime unique pay\u00e9e \u00e0 l\u2019achat.",
    couleur: "var(--green-light-bg)",
    textColor: "var(--green-text)",
  },
  {
    lettre: "f",
    titre: "Certificat de localisation",
    montant: "1\u00a0500\u00a0$ \u00e0 2\u00a0000\u00a0$",
    description: "Souvent pay\u00e9 par le vendeur, mais \u00e0 v\u00e9rifier dans la promesse d\u2019achat. N\u00e9cessaire si le certificat existant a plus de 10\u00a0ans ou si des travaux ont \u00e9t\u00e9 effectu\u00e9s.",
    couleur: "var(--amber-bg)",
    textColor: "var(--amber-text)",
  },
  {
    lettre: "g",
    titre: "D\u00e9m\u00e9nagement",
    montant: "500\u00a0$ \u00e0 3\u00a0000\u00a0$",
    description: "Varie selon la distance, le volume de biens et la p\u00e9riode de l\u2019ann\u00e9e. Les d\u00e9m\u00e9nagements en juillet co\u00fbtent g\u00e9n\u00e9ralement plus cher.",
    couleur: "var(--blue-bg)",
    textColor: "var(--blue-text)",
  },
  {
    lettre: "h",
    titre: "Ajustements de taxes",
    montant: "Variable",
    description: "Taxes municipales et scolaires prorat\u00e9es \u00e0 la date de prise de possession. Votre notaire calcule la r\u00e9partition entre vendeur et acheteur.",
    couleur: "var(--green-light-bg)",
    textColor: "var(--green-text)",
  },
  {
    lettre: "i",
    titre: "Raccordements et changements d\u2019adresse",
    montant: "100\u00a0$ \u00e0 300\u00a0$",
    description: "Transfert des services : Hydro-Qu\u00e9bec, internet, assurances, SAAQ, R\u00e9gie de l\u2019assurance maladie, institutions financi\u00e8res.",
    couleur: "var(--amber-bg)",
    textColor: "var(--amber-text)",
  },
  {
    lettre: "j",
    titre: "R\u00e9serve pour impr\u00e9vus",
    montant: "1\u00a0% \u00e0 3\u00a0% du prix d\u2019achat",
    description: "R\u00e9parations urgentes, ajustements post-achat, achats de mat\u00e9riel. Un coussin financier essentiel pour les premiers mois dans votre nouvelle propri\u00e9t\u00e9.",
    couleur: "var(--red-bg)",
    textColor: "var(--red-text)",
  },
];

const exempleCalcul = [
  { poste: "Notaire", montantBas: "1\u00a0800\u00a0$", montantHaut: "2\u00a0200\u00a0$" },
  { poste: "Inspection pr\u00e9achat", montantBas: "600\u00a0$", montantHaut: "750\u00a0$" },
  { poste: "Taxe de bienvenue", montantBas: "4\u00a0500\u00a0$", montantHaut: "4\u00a0500\u00a0$" },
  { poste: "Assurance habitation (1\u00e8re ann\u00e9e)", montantBas: "1\u00a0200\u00a0$", montantHaut: "1\u00a0800\u00a0$" },
  { poste: "Assurance titre", montantBas: "300\u00a0$", montantHaut: "400\u00a0$" },
  { poste: "Certificat de localisation", montantBas: "0\u00a0$ (vendeur)", montantHaut: "1\u00a0800\u00a0$" },
  { poste: "D\u00e9m\u00e9nagement", montantBas: "800\u00a0$", montantHaut: "2\u00a0000\u00a0$" },
  { poste: "Ajustements de taxes", montantBas: "1\u00a0500\u00a0$", montantHaut: "3\u00a0000\u00a0$" },
  { poste: "Raccordements", montantBas: "100\u00a0$", montantHaut: "250\u00a0$" },
  { poste: "R\u00e9serve impr\u00e9vus (2\u00a0%)", montantBas: "4\u00a0500\u00a0$", montantHaut: "9\u00a0000\u00a0$" },
];

const faqItems = [
  {
    q: "Combien co\u00fbte un notaire pour l\u2019achat d\u2019une maison au Qu\u00e9bec?",
    r: "Les frais de notaire pour un achat immobilier au Qu\u00e9bec varient g\u00e9n\u00e9ralement entre 1\u00a0500\u00a0$ et 2\u00a0500\u00a0$. Ce montant couvre l\u2019examen des titres de propri\u00e9t\u00e9, la publication de l\u2019acte de vente au Registre foncier et, si applicable, la radiation de l\u2019ancienne hypoth\u00e8que. Les honoraires peuvent varier selon la complexit\u00e9 de la transaction.",
  },
  {
    q: "L\u2019inspection pr\u00e9achat est-elle obligatoire au Qu\u00e9bec?",
    r: "L\u2019inspection pr\u00e9achat n\u2019est pas l\u00e9galement obligatoire au Qu\u00e9bec, mais elle est fortement recommand\u00e9e. Elle co\u00fbte entre 500\u00a0$ et 800\u00a0$ et permet de d\u00e9tecter des probl\u00e8mes de structure, toiture, plomberie ou \u00e9lectricit\u00e9 avant de finaliser l\u2019achat. Sans inspection, l\u2019acheteur assume tous les risques de vices cach\u00e9s.",
  },
  {
    q: "Quel pourcentage du prix d\u2019achat pr\u00e9voir en frais suppl\u00e9mentaires?",
    r: "En r\u00e8gle g\u00e9n\u00e9rale, il faut pr\u00e9voir entre 3\u00a0% et 5\u00a0% du prix d\u2019achat en frais suppl\u00e9mentaires. Pour une maison \u00e0 450\u00a0000\u00a0$, cela repr\u00e9sente environ 17\u00a0000\u00a0$ \u00e0 25\u00a0000\u00a0$ en frais de notaire, inspection, taxe de bienvenue, assurances, d\u00e9m\u00e9nagement et ajustements de taxes.",
  },
  {
    q: "Qui paie le certificat de localisation lors d\u2019un achat?",
    r: "Au Qu\u00e9bec, c\u2019est g\u00e9n\u00e9ralement le vendeur qui fournit le certificat de localisation \u00e0 jour. Cependant, cette obligation doit \u00eatre pr\u00e9cis\u00e9e dans la promesse d\u2019achat. Si le certificat a plus de 10\u00a0ans ou si des travaux ont \u00e9t\u00e9 effectu\u00e9s, un nouveau certificat (1\u00a0500\u00a0$ \u00e0 2\u00a0000\u00a0$) sera n\u00e9cessaire.",
  },
  {
    q: "Peut-on inclure les frais d\u2019achat dans l\u2019hypoth\u00e8que?",
    r: "Non, les frais d\u2019achat (notaire, taxe de bienvenue, inspection, etc.) ne peuvent g\u00e9n\u00e9ralement pas \u00eatre financ\u00e9s par l\u2019hypoth\u00e8que au Qu\u00e9bec. Ces montants doivent \u00eatre pay\u00e9s comptant au moment de la transaction ou dans les semaines suivant l\u2019achat. Il est donc essentiel de les pr\u00e9voir dans son budget.",
  },
];

const ressources = ressourcesUtiles;

export default async function FraisAchatPage() {
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
            <span style={{ color: "var(--text-secondary)" }}>Frais d&apos;achat</span>
          </nav>

          <div className="flex gap-5 items-start">
            {/* Main column */}
            <div className="flex-1 min-w-0 space-y-5">
              {/* H1 + Intro */}
              <div>
                <h1 className="text-[22px] font-bold leading-snug mb-2" style={{ color: "var(--text-primary)" }}>
                  Frais d&apos;achat d&apos;une maison au Qu&eacute;bec &mdash; Liste compl&egrave;te 2026
                </h1>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Acheter une maison, c&apos;est plus que le prix affich&eacute;. Voici tous les frais &agrave; pr&eacute;voir pour &eacute;viter les mauvaises surprises.
                </p>
              </div>

              {/* Purchase costs cards */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Tous les frais &agrave; pr&eacute;voir lors de l&apos;achat
                </h2>
                <div className="space-y-3">
                  {fraisAchat.map((frais) => (
                    <div key={frais.lettre} className="flex gap-3 p-3 rounded-lg" style={{ background: frais.couleur }}>
                      <div
                        className="w-6 h-6 rounded-full text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                        style={{ color: frais.textColor, border: `0.5px solid ${frais.textColor}` }}
                      >
                        {frais.lettre}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5 flex-wrap gap-1">
                          <p className="text-[13px] font-semibold" style={{ color: frais.textColor }}>
                            {frais.titre}
                          </p>
                          <span className="text-[12px] font-bold" style={{ color: frais.textColor }}>
                            {frais.montant}
                          </span>
                        </div>
                        <p className="text-[12px] leading-relaxed" style={{ color: frais.textColor, opacity: 0.85 }}>
                          {frais.description}
                        </p>
                        {frais.lien && (
                          <Link
                            href={frais.lien.href}
                            className="inline-block mt-1 text-[12px] font-medium transition-opacity hover:opacity-70"
                            style={{ color: frais.textColor }}
                          >
                            {frais.lien.label}
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                  Les montants sont des estimations pour 2026 et peuvent varier selon la r&eacute;gion, le type de propri&eacute;t&eacute; et les professionnels choisis.
                </p>
              </div>

              {/* Exemple concret */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Exemple concret &mdash; Maison &agrave; 450&nbsp;000&nbsp;$
                </h2>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Voici une estimation r&eacute;aliste des frais pour l&apos;achat d&apos;une maison unifamiliale &agrave; 450&nbsp;000&nbsp;$ au Qu&eacute;bec.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr style={{ borderBottom: "0.5px solid var(--border)" }}>
                        <th className="text-left py-2 pr-3 font-semibold" style={{ color: "var(--text-primary)" }}>
                          Poste de d&eacute;pense
                        </th>
                        <th className="text-right py-2 px-3 font-semibold" style={{ color: "var(--text-primary)" }}>
                          Estimation basse
                        </th>
                        <th className="text-right py-2 pl-3 font-semibold" style={{ color: "var(--text-primary)" }}>
                          Estimation haute
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {exempleCalcul.map((ligne) => (
                        <tr key={ligne.poste} style={{ borderBottom: "0.5px solid var(--border)" }}>
                          <td className="py-2 pr-3" style={{ color: "var(--text-secondary)" }}>
                            {ligne.poste}
                          </td>
                          <td className="text-right py-2 px-3" style={{ color: "var(--text-secondary)" }}>
                            {ligne.montantBas}
                          </td>
                          <td className="text-right py-2 pl-3" style={{ color: "var(--text-secondary)" }}>
                            {ligne.montantHaut}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td className="py-3 pr-3 font-bold text-[13px]" style={{ color: "var(--text-primary)" }}>
                          Total estim&eacute;
                        </td>
                        <td className="text-right py-3 px-3 font-bold text-[13px]" style={{ color: "var(--green)" }}>
                          ~15&nbsp;300&nbsp;$
                        </td>
                        <td className="text-right py-3 pl-3 font-bold text-[13px]" style={{ color: "var(--green)" }}>
                          ~25&nbsp;700&nbsp;$
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="p-3 rounded-lg" style={{ background: "var(--amber-bg)" }}>
                  <p className="text-[12px] leading-relaxed" style={{ color: "var(--amber-text)" }}>
                    <strong>Conseil :</strong> Pr&eacute;voyez au minimum 3&nbsp;% &agrave; 5&nbsp;% du prix d&apos;achat en liquidit&eacute;s disponibles en plus de votre mise de fonds pour couvrir tous ces frais.
                  </p>
                </div>
              </div>

              {/* Liens vers nos calculatrices */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Liens vers nos calculatrices
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      titre: "Taxe de bienvenue",
                      description: "Calculez les droits de mutation pour votre achat",
                      href: "/taxe-bienvenue",
                      icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z",
                    },
                    {
                      titre: "Calculatrice hypoth\u00e9caire",
                      description: "Estimez vos paiements mensuels et le co\u00fbt total",
                      href: "/calculatrice-hypothecaire",
                      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                    },
                    {
                      titre: "Capacit\u00e9 d\u2019emprunt",
                      description: "Calculez votre budget maximal d\u2019achat",
                      href: "/capacite-emprunt",
                      icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
                    },
                  ].map((calc) => (
                    <Link
                      key={calc.href}
                      href={calc.href}
                      className="flex gap-3 p-3 rounded-lg transition-colors hover-bg"
                      style={{ border: "0.5px solid var(--border)" }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "var(--green-light-bg)" }}
                      >
                        <svg className="w-4 h-4" style={{ color: "var(--green)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={calc.icon} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
                          {calc.titre}
                        </p>
                        <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                          {calc.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Questions fr&eacute;quentes sur les frais d&apos;achat
                </h2>
                <dl className="space-y-4">
                  {faqItems.map((item) => (
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

              {/* CTA community */}
              <CommunityCTA
                contexte="general"
                titre="Des questions sur les frais d'achat? La communaut\u00e9 peut vous aider!"
              />
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
                      Toutes les discussions &rarr;
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

              {/* Note about the page */}
              <div
                className="rounded-xl p-4 space-y-2"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                  &Agrave; propos de cette page
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Les montants indiqu&eacute;s sont des estimations pour le march&eacute; qu&eacute;b&eacute;cois en 2026. Les frais r&eacute;els peuvent varier selon votre r&eacute;gion, le type de propri&eacute;t&eacute; et les professionnels choisis.
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Pour des montants pr&eacute;cis, consultez votre <strong>notaire</strong> et votre <strong>courtier hypoth&eacute;caire</strong>.
                </p>
              </div>

              <p className="text-[11px] text-center px-2" style={{ color: "var(--text-tertiary)" }}>
                &copy; 2026 nid.local &mdash; Fait au Qu&eacute;bec
              </p>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
