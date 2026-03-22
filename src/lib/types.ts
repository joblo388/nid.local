export type Ville = {
  slug: string;
  nom: string;
  region: string;
};

export type Quartier = {
  slug: string;
  nom: string;
  villeSlug: string;
  couleur: string;
};

export type Categorie =
  | "vente"
  | "location"
  | "question"
  | "renovation"
  | "voisinage"
  | "alerte";

export type Post = {
  id: string;
  titre: string;
  contenu: string;
  auteur: string;
  quartier: Quartier;
  categorie: Categorie;
  creeLe: string;
  nbCommentaires: number;
  nbVotes: number;
  nbVues: number;
  epingle?: boolean;
  auteurId?: string | null;
};
