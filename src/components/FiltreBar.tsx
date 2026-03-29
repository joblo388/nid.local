"use client";

import { useState } from "react";
import Link from "next/link";
import { Categorie } from "@/lib/types";

const categories: { value: Categorie | "tous"; label: string }[] = [
  { value: "tous", label: "Tout" },
  { value: "vente", label: "Vente" },
  { value: "location", label: "Location" },
  { value: "question", label: "Questions" },
  { value: "renovation", label: "Conseils" },
  { value: "voisinage", label: "Voisinage" },
  { value: "construction", label: "Construction" },
  { value: "legal", label: "Légal" },
  { value: "financement", label: "Financement" },
  { value: "copropriete", label: "Condo" },
];

const tris = [
  { value: "recent", label: "Récents" },
  { value: "populaire", label: "Populaires" },
  { value: "commentaires", label: "Actifs" },
];

export function FiltreBar() {
  const [categorie, setCategorie] = useState<string>("tous");
  const [tri, setTri] = useState("recent");

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-1 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategorie(cat.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              categorie === cat.value
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1">
        {tris.map((t) => (
          <button
            key={t.value}
            onClick={() => setTri(t.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tri === t.value
                ? "text-slate-900 underline underline-offset-2"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
