import type { Metadata } from "next";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nidlocal.com";

export const metadata: Metadata = {
  title: "Répertoire de professionnels immobiliers Québec",
  description: "Trouvez un professionnel de confiance recommandé par la communauté. Courtiers, notaires, entrepreneurs, évaluateurs et plus.",
  keywords: ["courtier immobilier québec", "notaire immobilier", "entrepreneur rénovation", "évaluateur agréé", "répertoire professionnel immobilier"],
  alternates: { canonical: `${BASE_URL}/repertoire` },
  openGraph: { title: "Répertoire de professionnels immobiliers Québec", description: "Trouvez un professionnel de confiance recommandé par la communauté.", url: `${BASE_URL}/repertoire`, siteName: "nid.local", locale: "fr_CA", type: "website" },
  twitter: { card: "summary_large_image", title: "Répertoire de professionnels immobiliers Québec", description: "Courtiers, notaires, entrepreneurs recommandés par la communauté." },
};

export default function RepertoireLayout({ children }: { children: React.ReactNode }) {
  return children;
}
