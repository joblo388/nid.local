"use client";

import { useState } from "react";
import { Categorie } from "@/lib/types";
import { useLocale } from "@/lib/useLocale";

const categoryValues: (Categorie | "tous")[] = [
  "tous", "vente", "location", "question", "renovation",
  "voisinage", "construction", "legal", "financement", "copropriete",
];

const categoryKeys: Record<string, string> = {
  tous: "home.tout",
  vente: "cat.vente", location: "cat.location", question: "cat.question",
  renovation: "cat.renovation", voisinage: "cat.voisinage",
  construction: "cat.construction", legal: "cat.legal",
  financement: "cat.financement", copropriete: "cat.condo",
};

const triValues = ["recent", "populaire", "commentaires"] as const;
const triKeys: Record<string, string> = {
  recent: "home.recents",
  populaire: "home.populaires",
  commentaires: "home.actifs",
};

export function FiltreBar() {
  const [categorie, setCategorie] = useState<string>("tous");
  const [tri, setTri] = useState("recent");
  const { t } = useLocale();

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-1 flex-wrap">
        {categoryValues.map((val) => (
          <button
            key={val}
            onClick={() => setCategorie(val)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              categorie === val
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            {t(categoryKeys[val])}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1">
        {triValues.map((val) => (
          <button
            key={val}
            onClick={() => setTri(val)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tri === val
                ? "text-slate-900 underline underline-offset-2"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {t(triKeys[val])}
          </button>
        ))}
      </div>
    </div>
  );
}
