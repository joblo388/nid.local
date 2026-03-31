import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { PostCard } from "@/components/PostCard";
import { prisma } from "@/lib/prisma";
import { dbPostToAppPost } from "@/lib/data";
import type { Metadata } from "next";

export const revalidate = 120;

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";

type CatInfo = {
  label: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
};

const CATEGORIES: Record<string, CatInfo> = {
  vente: {
    label: "Vente immobilière",
    description: "Maisons, condos, plex et terrains à vendre au Québec. Annonces publiées par des propriétaires et agents de votre quartier.",
    seoTitle: "Propriétés à vendre au Québec | Annonces immobilières | nid.local",
    seoDescription: "Trouvez des maisons, condos et plex à vendre au Québec. Annonces immobilières locales publiées par des propriétaires et membres de la communauté nid.local.",
    keywords: ["vente immobilière québec", "maison à vendre québec", "condo à vendre montréal", "plex à vendre", "annonces immobilières québec"],
  },
  location: {
    label: "Location",
    description: "Appartements, maisons et locaux à louer au Québec. Annonces de location directement des propriétaires.",
    seoTitle: "Appartements et logements à louer au Québec | nid.local",
    seoDescription: "Trouvez un appartement ou une maison à louer au Québec. Annonces de location directement des propriétaires sur nid.local.",
    keywords: ["appartement à louer québec", "logement à louer montréal", "location immobilière québec", "louer appartement québec"],
  },
  question: {
    label: "Questions & Conseils",
    description: "Posez vos questions sur l'immobilier québécois : achat, vente, location, rénovation, hypothèque et plus.",
    seoTitle: "Questions immobilières au Québec | Conseils de la communauté | nid.local",
    seoDescription: "Obtenez des réponses à vos questions sur l'immobilier au Québec. Conseils d'achat, de vente, de location et de rénovation par la communauté nid.local.",
    keywords: ["questions immobilier québec", "conseils achat maison québec", "forum immobilier québec", "aide immobilier québec"],
  },
  renovation: {
    label: "Rénovation & Conseils",
    description: "Conseils de rénovation, recommandations d'entrepreneurs et retours d'expérience de propriétaires québécois.",
    seoTitle: "Rénovation au Québec | Conseils et entrepreneurs recommandés | nid.local",
    seoDescription: "Conseils de rénovation résidentielle au Québec. Trouvez des entrepreneurs recommandés, des conseils de travaux et partagez vos expériences.",
    keywords: ["rénovation québec", "entrepreneur rénovation montréal", "travaux maison québec", "conseils rénovation résidentielle"],
  },
  voisinage: {
    label: "Voisinage",
    description: "Nouvelles de quartier, événements locaux, bonnes adresses et discussions de voisinage au Québec.",
    seoTitle: "Actualités de quartier au Québec | Voisinage & Communauté | nid.local",
    seoDescription: "Restez informé de ce qui se passe dans votre quartier. Nouvelles locales, événements, bonnes adresses et discussions de voisinage sur nid.local.",
    keywords: ["actualités quartier montréal", "voisinage québec", "communauté locale québec", "nouvelles quartier"],
  },
  construction: {
    label: "Construction",
    description: "Projets de construction neuve au Québec : maisons, condos, terrains, permis et démarches.",
    seoTitle: "Construction résidentielle au Québec | Projets et permis | nid.local",
    seoDescription: "Discussions sur la construction résidentielle au Québec. Projets neufs, permis de construire, terrains et démarches sur nid.local.",
    keywords: ["construction maison québec", "permis construction montréal", "terrain à bâtir québec", "construction neuve"],
  },
  legal: {
    label: "Légal",
    description: "Questions juridiques en immobilier au Québec : baux, droits des locataires, vice caché, servitudes et litiges.",
    seoTitle: "Questions juridiques immobilières au Québec | nid.local",
    seoDescription: "Conseils juridiques en immobilier au Québec. Baux, droits des locataires, vices cachés, servitudes et litiges sur nid.local.",
    keywords: ["droit immobilier québec", "vice caché québec", "bail québec", "droits locataire québec", "litige immobilier"],
  },
  financement: {
    label: "Financement",
    description: "Hypothèques, financement immobilier et crédit au Québec : taux, mise de fonds, SCHL et stratégies.",
    seoTitle: "Financement immobilier au Québec | Hypothèques et crédit | nid.local",
    seoDescription: "Discussions sur le financement immobilier au Québec. Taux hypothécaires, mise de fonds, SCHL et stratégies de financement sur nid.local.",
    keywords: ["hypothèque québec", "taux hypothécaire montréal", "mise de fonds québec", "financement immobilier", "SCHL"],
  },
  copropriete: {
    label: "Condo",
    description: "Vie en copropriété au Québec : syndicats, charges, règlements, assemblées et gestion d'immeubles.",
    seoTitle: "Condo au Québec | Syndicats et gestion | nid.local",
    seoDescription: "Discussions sur la vie en copropriété au Québec. Syndicats, charges de condo, règlements et gestion d'immeubles sur nid.local.",
    keywords: ["copropriété québec", "syndicat condo montréal", "charges condo québec", "gestion copropriété"],
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES[slug];
  if (!cat) return {};
  return {
    title: cat.seoTitle,
    description: cat.seoDescription,
    keywords: cat.keywords,
    alternates: { canonical: `${BASE_URL}/categorie/${slug}` },
    openGraph: {
      title: cat.seoTitle,
      description: cat.seoDescription,
      url: `${BASE_URL}/categorie/${slug}`,
      siteName: "nid.local",
      locale: "fr_CA",
      type: "website",
    },
  };
}

export default async function CategoriePage({ params }: Props) {
  const { slug } = await params;
  const cat = CATEGORIES[slug];
  if (!cat) notFound();

  const dbPosts = await prisma.post.findMany({
    where: { categorie: slug },
    orderBy: [{ epingle: "desc" }, { nbVotes: "desc" }],
    take: 30,
    include: { auteur: { select: { tag: true } } },
  });
  const posts = dbPosts.map(dbPostToAppPost);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[1100px] mx-auto px-5 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[12px] mb-5" style={{ color: "var(--text-tertiary)" }}>
          <Link href="/" className="transition-opacity hover:opacity-70" style={{ color: "var(--text-tertiary)" }}>nid.local</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>{cat.label}</span>
        </nav>

        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0">
            <h1 className="text-[22px] font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              {cat.label} au Québec
            </h1>
            <p className="text-[13px] mb-5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {cat.description}
            </p>

            {posts.length === 0 ? (
              <div className="rounded-xl p-8 text-center" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
                  Aucune discussion dans cette catégorie pour l&apos;instant.
                </p>
                <Link href="/nouveau-post"
                  className="mt-3 inline-block text-[13px] font-semibold text-white px-4 py-2 rounded-lg"
                  style={{ background: "var(--green)" }}>
                  Être le premier à publier
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </main>
    </div>
  );
}
