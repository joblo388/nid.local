import { Ville, Quartier, Post, Categorie } from "./types";

// ─── Villes ───────────────────────────────────────────────────────────────────

export const villes: Ville[] = [
  { slug: "montreal",      nom: "Montréal",       region: "Grand Montréal" },
  { slug: "quebec",        nom: "Québec",          region: "Capitale-Nationale" },
  { slug: "laval",         nom: "Laval",           region: "Grand Montréal" },
  { slug: "longueuil",     nom: "Longueuil",       region: "Grand Montréal" },
  { slug: "sherbrooke",    nom: "Sherbrooke",      region: "Estrie" },
  { slug: "gatineau",      nom: "Gatineau",        region: "Outaouais" },
  { slug: "trois-rivieres",nom: "Trois-Rivières",  region: "Mauricie" },
  { slug: "saguenay",      nom: "Saguenay",        region: "Saguenay–Lac-Saint-Jean" },
  { slug: "levis",         nom: "Lévis",           region: "Chaudière-Appalaches" },
  { slug: "terrebonne",    nom: "Terrebonne",      region: "Lanaudière" },
  { slug: "rimouski",      nom: "Rimouski",        region: "Bas-Saint-Laurent" },
  { slug: "drummondville", nom: "Drummondville",   region: "Centre-du-Québec" },
];

// ─── Quartiers ────────────────────────────────────────────────────────────────

export const quartiers: Quartier[] = [
  // ── Montréal ────────────────────────────────────────────────────────────
  { slug: "plateau-mont-royal",   nom: "Plateau-Mont-Royal",        villeSlug: "montreal", couleur: "bg-rose-500" },
  { slug: "rosemont",             nom: "Rosemont–La Petite-Patrie", villeSlug: "montreal", couleur: "bg-orange-500" },
  { slug: "verdun",               nom: "Verdun",                    villeSlug: "montreal", couleur: "bg-teal-500" },
  { slug: "hochelaga",            nom: "Hochelaga-Maisonneuve",     villeSlug: "montreal", couleur: "bg-purple-500" },
  { slug: "griffintown",          nom: "Griffintown",               villeSlug: "montreal", couleur: "bg-blue-500" },
  { slug: "mile-end",             nom: "Mile End",                  villeSlug: "montreal", couleur: "bg-pink-500" },
  { slug: "outremont",            nom: "Outremont",                 villeSlug: "montreal", couleur: "bg-emerald-500" },
  { slug: "villeray",             nom: "Villeray",                  villeSlug: "montreal", couleur: "bg-amber-500" },
  { slug: "saint-henri",          nom: "Saint-Henri",               villeSlug: "montreal", couleur: "bg-cyan-600" },
  { slug: "cote-des-neiges",      nom: "Côte-des-Neiges",           villeSlug: "montreal", couleur: "bg-lime-600" },
  { slug: "notre-dame-de-grace",  nom: "Notre-Dame-de-Grâce",       villeSlug: "montreal", couleur: "bg-violet-500" },
  { slug: "petite-bourgogne",     nom: "Petite-Bourgogne",          villeSlug: "montreal", couleur: "bg-red-400" },
  { slug: "vieux-montreal",       nom: "Vieux-Montréal",            villeSlug: "montreal", couleur: "bg-stone-500" },
  { slug: "pointe-saint-charles", nom: "Pointe-Saint-Charles",      villeSlug: "montreal", couleur: "bg-sky-500" },
  { slug: "lachine",              nom: "Lachine",                   villeSlug: "montreal", couleur: "bg-fuchsia-500" },
  { slug: "lasalle",              nom: "LaSalle",                   villeSlug: "montreal", couleur: "bg-yellow-600" },
  { slug: "anjou",                nom: "Anjou",                     villeSlug: "montreal", couleur: "bg-green-600" },
  { slug: "saint-leonard",        nom: "Saint-Léonard",             villeSlug: "montreal", couleur: "bg-blue-600" },
  { slug: "montreal-nord",        nom: "Montréal-Nord",             villeSlug: "montreal", couleur: "bg-orange-600" },
  { slug: "riviere-des-prairies", nom: "Rivière-des-Prairies",      villeSlug: "montreal", couleur: "bg-teal-600" },
  { slug: "saint-laurent",        nom: "Saint-Laurent",             villeSlug: "montreal", couleur: "bg-rose-600" },
  { slug: "dollard-des-ormeaux",  nom: "Dollard-des-Ormeaux",       villeSlug: "montreal", couleur: "bg-purple-600" },
  { slug: "mont-royal",           nom: "Mont-Royal",                villeSlug: "montreal", couleur: "bg-indigo-400" },
  { slug: "westmount",            nom: "Westmount",                 villeSlug: "montreal", couleur: "bg-slate-500" },

  // ── Québec ──────────────────────────────────────────────────────────────
  { slug: "saint-sauveur-qc",     nom: "Saint-Sauveur",             villeSlug: "quebec",   couleur: "bg-green-500" },
  { slug: "limoilou",             nom: "Limoilou",                  villeSlug: "quebec",   couleur: "bg-yellow-500" },
  { slug: "vieux-port-qc",        nom: "Vieux-Port",                villeSlug: "quebec",   couleur: "bg-red-500" },
  { slug: "saint-roch",           nom: "Saint-Roch",                villeSlug: "quebec",   couleur: "bg-indigo-500" },
  { slug: "haute-ville",          nom: "Haute-Ville",               villeSlug: "quebec",   couleur: "bg-amber-600" },
  { slug: "sainte-foy",           nom: "Sainte-Foy",                villeSlug: "quebec",   couleur: "bg-teal-600" },
  { slug: "charlesbourg",         nom: "Charlesbourg",              villeSlug: "quebec",   couleur: "bg-blue-600" },
  { slug: "beauport",             nom: "Beauport",                  villeSlug: "quebec",   couleur: "bg-emerald-600" },

  // ── Laval ───────────────────────────────────────────────────────────────
  { slug: "chomedey",             nom: "Chomedey",                  villeSlug: "laval",    couleur: "bg-blue-400" },
  { slug: "sainte-rose",          nom: "Sainte-Rose",               villeSlug: "laval",    couleur: "bg-rose-400" },
  { slug: "vimont",               nom: "Vimont",                    villeSlug: "laval",    couleur: "bg-purple-400" },
  { slug: "auteuil",              nom: "Auteuil",                   villeSlug: "laval",    couleur: "bg-orange-400" },
  { slug: "duvernay",             nom: "Duvernay",                  villeSlug: "laval",    couleur: "bg-green-400" },
  { slug: "fabreville",           nom: "Fabreville",                villeSlug: "laval",    couleur: "bg-cyan-400" },

  // ── Longueuil ───────────────────────────────────────────────────────────
  { slug: "vieux-longueuil",      nom: "Vieux-Longueuil",           villeSlug: "longueuil",couleur: "bg-indigo-500" },
  { slug: "saint-hubert",         nom: "Saint-Hubert",              villeSlug: "longueuil",couleur: "bg-teal-400" },
  { slug: "greenfield-park",      nom: "Greenfield Park",           villeSlug: "longueuil",couleur: "bg-emerald-400" },
  { slug: "brossard",             nom: "Brossard",                  villeSlug: "longueuil",couleur: "bg-violet-400" },

  // ── Sherbrooke ──────────────────────────────────────────────────────────
  { slug: "fleurimont",           nom: "Fleurimont",                villeSlug: "sherbrooke",couleur: "bg-violet-500" },
  { slug: "jacques-cartier-shbk", nom: "Jacques-Cartier",           villeSlug: "sherbrooke",couleur: "bg-amber-500" },
  { slug: "mont-bellevue",        nom: "Mont-Bellevue",             villeSlug: "sherbrooke",couleur: "bg-cyan-500" },
  { slug: "rock-forest",          nom: "Rock Forest",               villeSlug: "sherbrooke",couleur: "bg-green-500" },

  // ── Gatineau ────────────────────────────────────────────────────────────
  { slug: "hull",                 nom: "Hull",                      villeSlug: "gatineau", couleur: "bg-red-400" },
  { slug: "aylmer",               nom: "Aylmer",                    villeSlug: "gatineau", couleur: "bg-blue-400" },
  { slug: "gatineau-secteur",     nom: "Gatineau (secteur)",        villeSlug: "gatineau", couleur: "bg-orange-500" },
  { slug: "buckingham",           nom: "Buckingham",                villeSlug: "gatineau", couleur: "bg-lime-500" },

  // ── Villes sans sous-quartiers ──────────────────────────────────────────
  { slug: "trois-rivieres",       nom: "Trois-Rivières",            villeSlug: "trois-rivieres", couleur: "bg-blue-600" },
  { slug: "saguenay",             nom: "Saguenay",                  villeSlug: "saguenay",       couleur: "bg-indigo-600" },
  { slug: "levis",                nom: "Lévis",                     villeSlug: "levis",          couleur: "bg-teal-600" },
  { slug: "terrebonne",           nom: "Terrebonne",                villeSlug: "terrebonne",     couleur: "bg-green-600" },
  { slug: "rimouski",             nom: "Rimouski",                  villeSlug: "rimouski",       couleur: "bg-amber-600" },
  { slug: "drummondville",        nom: "Drummondville",             villeSlug: "drummondville",  couleur: "bg-rose-600" },
];

// Lookup helpers
export const villeBySlug = Object.fromEntries(villes.map((v) => [v.slug, v]));
export const quartierBySlug = Object.fromEntries(quartiers.map((q) => [q.slug, q]));
export const quartiersDeVille = (villeSlug: string) =>
  quartiers.filter((q) => q.villeSlug === villeSlug);

// ─── Conversion DB → App ───────────────────────────────────────────────────────

type DbPost = {
  id: string;
  titre: string;
  contenu: string;
  auteurNom: string;
  auteurId?: string | null;
  quartierSlug: string;
  villeSlug: string;
  categorie: string;
  imageUrl?: string | null;
  nbCommentaires: number;
  nbVotes: number;
  nbVues: number;
  epingle: boolean;
  creeLe: Date;
};

// ─── Ressources utiles (source unique pour tout le site) ──────────────────────

export const ressourcesUtiles = [
  { label: "Marketplace immobilier", href: "/annonces" },
  { label: "Données de marché", href: "/donnees-marche" },
  { label: "Calculatrice hypothécaire", href: "/calculatrice-hypothecaire" },
  { label: "Capacité d'emprunt", href: "/capacite-emprunt" },
  { label: "Calculateur plex", href: "/calculateur-plex" },
  { label: "Acheter ou louer?", href: "/acheter-ou-louer" },
  { label: "Suggestions", href: "/suggestions" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function dbPostToAppPost(p: DbPost): Post {
  const quartier: Quartier = quartierBySlug[p.quartierSlug] ?? {
    slug: p.quartierSlug,
    nom: p.quartierSlug,
    villeSlug: p.villeSlug,
    couleur: "bg-gray-400",
  };
  return {
    id: p.id,
    titre: p.titre,
    contenu: p.contenu,
    auteur: p.auteurNom,
    auteurId: p.auteurId ?? null,
    quartier,
    categorie: p.categorie as Categorie,
    creeLe: p.creeLe.toISOString(),
    nbCommentaires: p.nbCommentaires,
    nbVotes: p.nbVotes,
    nbVues: p.nbVues,
    epingle: p.epingle,
    imageUrl: p.imageUrl ?? null,
  };
}
