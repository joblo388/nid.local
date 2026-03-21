import Link from "next/link";
import { Quartier } from "@/lib/types";

const categorieLabels: Record<string, string> = {
  vente: "Vente",
  location: "Location",
  question: "Question",
  renovation: "Rénovation",
  voisinage: "Voisinage",
  alerte: "Alerte",
};

const categorieColors: Record<string, string> = {
  vente: "bg-blue-100 text-blue-800",
  location: "bg-green-100 text-green-800",
  question: "bg-slate-100 text-slate-700",
  renovation: "bg-amber-100 text-amber-800",
  voisinage: "bg-purple-100 text-purple-800",
  alerte: "bg-red-100 text-red-800",
};

export function QuartierBadge({ quartier }: { quartier: Quartier }) {
  return (
    <Link
      href={`/quartier/${quartier.slug}`}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900"
    >
      <span className={`w-2 h-2 rounded-full ${quartier.couleur}`} />
      {quartier.nom}
    </Link>
  );
}

export function CategorieBadge({ categorie }: { categorie: string }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
        categorieColors[categorie] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {categorieLabels[categorie] ?? categorie}
    </span>
  );
}
