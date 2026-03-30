import Link from "next/link";

interface CommunityCTAProps {
  titre?: string;
  description?: string;
  contexte?: "hypotheque" | "plex" | "achat" | "estimation" | "donnees" | "quartiers" | "taxe" | "general";
}

const contextMessages: Record<string, { titre: string; description: string }> = {
  hypotheque: {
    titre: "Vous avez des questions sur votre hypothèque?",
    description: "Des milliers de Québécois partagent leur expérience sur nid.local. Taux négociés, choix de prêteur, renouvellement. Posez votre question et obtenez des réponses de vrais propriétaires.",
  },
  plex: {
    titre: "Vous analysez un plex? Demandez l'avis de la communauté!",
    description: "Investisseurs, propriétaires de duplex et triplex échangent chaque jour sur nid.local. Partagez vos chiffres, demandez un avis sur un MRB ou trouvez des astuces pour maximiser votre rendement.",
  },
  achat: {
    titre: "Acheter ou louer? La communauté a des opinions!",
    description: "Premiers acheteurs, locataires et propriétaires partagent leur expérience sur nid.local. Posez votre question et découvrez ce que d'autres dans votre situation ont décidé.",
  },
  estimation: {
    titre: "Besoin d'un deuxième avis sur la valeur de votre propriété?",
    description: "Courtiers, évaluateurs et propriétaires expérimentés sont actifs sur nid.local. Partagez votre estimation et obtenez des commentaires de gens qui connaissent votre quartier.",
  },
  donnees: {
    titre: "Vous analysez le marché? Discutez-en avec la communauté!",
    description: "Tendances, prédictions, quartiers en hausse : les membres de nid.local suivent le marché de près. Posez vos questions et échangez avec des passionnés d'immobilier québécois.",
  },
  quartiers: {
    titre: "Vous hésitez entre des quartiers? Demandez aux résidents!",
    description: "Rien ne vaut l'avis de quelqu'un qui habite le quartier. Sur nid.local, des résidents partagent leur quotidien (bruit, transport, écoles, ambiance). Posez votre question!",
  },
  taxe: {
    titre: "Des questions sur les frais d'achat? La communauté peut vous aider!",
    description: "Taxe de bienvenue, frais de notaire, inspection : les premiers acheteurs partagent leurs surprises et conseils sur nid.local. Évitez les mauvaises surprises grâce à l'entraide.",
  },
  general: {
    titre: "Rejoignez la communauté immobilière du Québec",
    description: "Acheteurs, vendeurs, locataires et investisseurs s'entraident chaque jour sur nid.local. Posez vos questions, partagez votre expérience et aidez d'autres Québécois dans leur projet immobilier.",
  },
};

export function CommunityCTA({ titre, description, contexte = "general" }: CommunityCTAProps) {
  const msg = contextMessages[contexte];
  const finalTitre = titre || msg.titre;
  const finalDesc = description || msg.description;

  return (
    <div
      className="rounded-xl p-6 space-y-4"
      style={{ background: "var(--green-light-bg)", border: "0.5px solid var(--border)" }}
    >
      <div className="text-center space-y-2">
        <h2 className="text-[16px] font-bold" style={{ color: "var(--green-text)" }}>
          {finalTitre}
        </h2>
        <p className="text-[13px] leading-relaxed max-w-lg mx-auto" style={{ color: "var(--green-text)", opacity: 0.85 }}>
          {finalDesc}
        </p>
      </div>

      {/* Stats sociales */}
      <div className="flex items-center justify-center gap-6 py-2">
        {[
          { label: "Gratuit", icon: "M5 13l4 4L19 7" },
          { label: "100% québécois", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
          { label: "Entraide anonyme", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <svg className="w-4 h-4" style={{ color: "var(--green-text)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="text-[12px] font-medium" style={{ color: "var(--green-text)" }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Boutons d'action */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link
          href="/nouveau-post"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--green)" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Poser ma question
        </Link>
        <Link
          href="/auth/inscription"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-80"
          style={{ background: "var(--bg-card)", color: "var(--green-text)", border: "0.5px solid var(--border)" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Créer mon compte gratuit
        </Link>
      </div>

      <p className="text-[11px] text-center" style={{ color: "var(--green-text)", opacity: 0.6 }}>
        Inscription en 30 secondes, aucune carte de crédit requise
      </p>
    </div>
  );
}
