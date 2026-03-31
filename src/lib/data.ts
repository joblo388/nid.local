import { Ville, Quartier, Post, Categorie } from "./types";

// ─── Villes ───────────────────────────────────────────────────────────────────

export const villes: Ville[] = [
  // ── Villes originales (12) ──────────────────────────────────────────────
  { slug: "montreal",       nom: "Montréal",        region: "Grand Montréal" },
  { slug: "quebec",         nom: "Québec",           region: "Capitale-Nationale" },
  { slug: "laval",          nom: "Laval",            region: "Grand Montréal" },
  { slug: "longueuil",      nom: "Longueuil",        region: "Grand Montréal" },
  { slug: "sherbrooke",     nom: "Sherbrooke",       region: "Estrie" },
  { slug: "gatineau",       nom: "Gatineau",         region: "Outaouais" },
  { slug: "trois-rivieres", nom: "Trois-Rivières",   region: "Mauricie" },
  { slug: "saguenay",       nom: "Saguenay",         region: "Saguenay–Lac-Saint-Jean" },
  { slug: "levis",          nom: "Lévis",            region: "Chaudière-Appalaches" },
  { slug: "terrebonne",     nom: "Terrebonne",       region: "Lanaudière" },
  { slug: "rimouski",       nom: "Rimouski",         region: "Bas-Saint-Laurent" },
  { slug: "drummondville",  nom: "Drummondville",    region: "Centre-du-Québec" },

  // ── Grand Montréal ─────────────────────────────────────────────────────
  { slug: "beloeil",                   nom: "Beloeil",                   region: "Grand Montréal" },
  { slug: "blainville",               nom: "Blainville",               region: "Grand Montréal" },
  { slug: "boisbriand",               nom: "Boisbriand",               region: "Grand Montréal" },
  { slug: "boucherville",             nom: "Boucherville",             region: "Grand Montréal" },
  { slug: "brossard",                 nom: "Brossard",                 region: "Grand Montréal" },
  { slug: "candiac",                  nom: "Candiac",                  region: "Grand Montréal" },
  { slug: "chambly",                  nom: "Chambly",                  region: "Grand Montréal" },
  { slug: "chateauguay",              nom: "Châteauguay",              region: "Grand Montréal" },
  { slug: "deux-montagnes",           nom: "Deux-Montagnes",           region: "Grand Montréal" },
  { slug: "la-prairie",               nom: "La Prairie",               region: "Grand Montréal" },
  { slug: "l-assomption",             nom: "L'Assomption",             region: "Grand Montréal" },
  { slug: "mascouche",                nom: "Mascouche",                region: "Grand Montréal" },
  { slug: "mirabel",                  nom: "Mirabel",                  region: "Grand Montréal" },
  { slug: "mont-saint-hilaire",       nom: "Mont-Saint-Hilaire",       region: "Grand Montréal" },
  { slug: "repentigny",               nom: "Repentigny",               region: "Grand Montréal" },
  { slug: "saint-bruno-de-montarville", nom: "Saint-Bruno-de-Montarville", region: "Grand Montréal" },
  { slug: "saint-constant",           nom: "Saint-Constant",           region: "Grand Montréal" },
  { slug: "saint-eustache",           nom: "Saint-Eustache",           region: "Grand Montréal" },
  { slug: "saint-hyacinthe",          nom: "Saint-Hyacinthe",          region: "Grand Montréal" },
  { slug: "saint-jerome",             nom: "Saint-Jérôme",             region: "Grand Montréal" },
  { slug: "saint-lambert",            nom: "Saint-Lambert",            region: "Grand Montréal" },
  { slug: "sainte-julie",             nom: "Sainte-Julie",             region: "Grand Montréal" },
  { slug: "sainte-therese",           nom: "Sainte-Thérèse",           region: "Grand Montréal" },
  { slug: "varennes",                 nom: "Varennes",                 region: "Grand Montréal" },
  { slug: "vaudreuil-dorion",         nom: "Vaudreuil-Dorion",         region: "Grand Montréal" },

  // ── Capitale-Nationale ──────────────────────────────────────────────────
  { slug: "beauport",                    nom: "Beauport",                    region: "Capitale-Nationale" },
  { slug: "charlesbourg",               nom: "Charlesbourg",               region: "Capitale-Nationale" },
  { slug: "l-ancienne-lorette",          nom: "L'Ancienne-Lorette",          region: "Capitale-Nationale" },
  { slug: "saint-augustin-de-desmaures", nom: "Saint-Augustin-de-Desmaures", region: "Capitale-Nationale" },
  { slug: "sainte-foy",                 nom: "Sainte-Foy",                 region: "Capitale-Nationale" },
  { slug: "stoneham",                   nom: "Stoneham",                   region: "Capitale-Nationale" },

  // ── Chaudière-Appalaches ────────────────────────────────────────────────
  { slug: "montmagny",      nom: "Montmagny",      region: "Chaudière-Appalaches" },
  { slug: "saint-georges",  nom: "Saint-Georges",  region: "Chaudière-Appalaches" },
  { slug: "sainte-marie",   nom: "Sainte-Marie",   region: "Chaudière-Appalaches" },
  { slug: "thetford-mines", nom: "Thetford Mines", region: "Chaudière-Appalaches" },

  // ── Estrie ──────────────────────────────────────────────────────────────
  { slug: "coaticook",    nom: "Coaticook",    region: "Estrie" },
  { slug: "lac-megantic", nom: "Lac-Mégantic", region: "Estrie" },
  { slug: "magog",        nom: "Magog",        region: "Estrie" },

  // ── Outaouais ───────────────────────────────────────────────────────────
  { slug: "aylmer",     nom: "Aylmer",     region: "Outaouais" },
  { slug: "buckingham", nom: "Buckingham", region: "Outaouais" },
  { slug: "chelsea",    nom: "Chelsea",    region: "Outaouais" },
  { slug: "hull",       nom: "Hull",       region: "Outaouais" },

  // ── Mauricie ────────────────────────────────────────────────────────────
  { slug: "la-tuque",    nom: "La Tuque",    region: "Mauricie" },
  { slug: "louiseville", nom: "Louiseville", region: "Mauricie" },
  { slug: "shawinigan",  nom: "Shawinigan",  region: "Mauricie" },

  // ── Saguenay–Lac-Saint-Jean ─────────────────────────────────────────────
  { slug: "alma",               nom: "Alma",               region: "Saguenay–Lac-Saint-Jean" },
  { slug: "dolbeau-mistassini", nom: "Dolbeau-Mistassini", region: "Saguenay–Lac-Saint-Jean" },
  { slug: "roberval",           nom: "Roberval",           region: "Saguenay–Lac-Saint-Jean" },

  // ── Lanaudière ──────────────────────────────────────────────────────────
  { slug: "joliette",              nom: "Joliette",              region: "Lanaudière" },
  { slug: "rawdon",                nom: "Rawdon",                region: "Lanaudière" },
  { slug: "saint-lin-laurentides", nom: "Saint-Lin-Laurentides", region: "Lanaudière" },

  // ── Laurentides ─────────────────────────────────────────────────────────
  { slug: "lachute",                  nom: "Lachute",                  region: "Laurentides" },
  { slug: "mont-laurier",             nom: "Mont-Laurier",             region: "Laurentides" },
  { slug: "mont-tremblant",           nom: "Mont-Tremblant",           region: "Laurentides" },
  { slug: "prevost",                  nom: "Prévost",                  region: "Laurentides" },
  { slug: "saint-sauveur",            nom: "Saint-Sauveur",            region: "Laurentides" },
  { slug: "sainte-adele",             nom: "Sainte-Adèle",             region: "Laurentides" },
  { slug: "sainte-agathe-des-monts",  nom: "Sainte-Agathe-des-Monts",  region: "Laurentides" },

  // ── Montérégie ──────────────────────────────────────────────────────────
  { slug: "cowansville",               nom: "Cowansville",               region: "Montérégie" },
  { slug: "granby",                     nom: "Granby",                     region: "Montérégie" },
  { slug: "saint-jean-sur-richelieu", nom: "Saint-Jean-sur-Richelieu", region: "Montérégie" },
  { slug: "salaberry-de-valleyfield",   nom: "Salaberry-de-Valleyfield",   region: "Montérégie" },
  { slug: "sorel-tracy",               nom: "Sorel-Tracy",               region: "Montérégie" },

  // ── Centre-du-Québec ────────────────────────────────────────────────────
  { slug: "becancour",     nom: "Bécancour",     region: "Centre-du-Québec" },
  { slug: "plessisville",  nom: "Plessisville",  region: "Centre-du-Québec" },
  { slug: "victoriaville", nom: "Victoriaville", region: "Centre-du-Québec" },

  // ── Bas-Saint-Laurent ───────────────────────────────────────────────────
  { slug: "amqui",            nom: "Amqui",            region: "Bas-Saint-Laurent" },
  { slug: "matane",           nom: "Matane",           region: "Bas-Saint-Laurent" },
  { slug: "riviere-du-loup",  nom: "Rivière-du-Loup",  region: "Bas-Saint-Laurent" },

  // ── Gaspésie ────────────────────────────────────────────────────────────
  { slug: "carleton-sur-mer", nom: "Carleton-sur-Mer", region: "Gaspésie" },
  { slug: "gaspe",            nom: "Gaspé",            region: "Gaspésie" },
  { slug: "new-richmond",     nom: "New Richmond",     region: "Gaspésie" },
  { slug: "perce",            nom: "Percé",            region: "Gaspésie" },

  // ── Côte-Nord ───────────────────────────────────────────────────────────
  { slug: "baie-comeau",        nom: "Baie-Comeau",        region: "Côte-Nord" },
  { slug: "havre-saint-pierre", nom: "Havre-Saint-Pierre", region: "Côte-Nord" },
  { slug: "sept-iles",          nom: "Sept-Îles",          region: "Côte-Nord" },

  // ── Abitibi-Témiscamingue ───────────────────────────────────────────────
  { slug: "amos",           nom: "Amos",           region: "Abitibi-Témiscamingue" },
  { slug: "la-sarre",       nom: "La Sarre",       region: "Abitibi-Témiscamingue" },
  { slug: "rouyn-noranda",  nom: "Rouyn-Noranda",  region: "Abitibi-Témiscamingue" },
  { slug: "val-d-or",       nom: "Val-d'Or",       region: "Abitibi-Témiscamingue" },

  // ── Nord-du-Québec ──────────────────────────────────────────────────────
  { slug: "chibougamau", nom: "Chibougamau", region: "Nord-du-Québec" },

  // ── Îles-de-la-Madeleine ───────────────────────────────────────────────
  { slug: "iles-de-la-madeleine", nom: "Îles-de-la-Madeleine", region: "Îles-de-la-Madeleine" },
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
  auteur?: { tag?: string | null } | null;
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
  { label: "Marketplace immobilier", href: "/annonces", description: "Vendez ou achetez une maison" },
  { label: "Données de marché", href: "/donnees-marche", description: "Prix médians et tendances par quartier" },
  { label: "Calculatrice hypothécaire", href: "/calculatrice-hypothecaire", description: "Estimez vos paiements mensuels" },
  { label: "Capacité d'emprunt", href: "/capacite-emprunt", description: "Calculez votre budget maximal" },
  { label: "Calculateur plex", href: "/calculateur-plex", description: "Analysez la rentabilité d'un plex" },
  { label: "Taxe de bienvenue", href: "/taxe-bienvenue", description: "Calculez vos droits de mutation" },
  { label: "Acheter ou louer?", href: "/acheter-ou-louer", description: "Comparez les deux scénarios" },
  { label: "Estimation de valeur", href: "/estimation", description: "Estimez la valeur de votre propriété" },
  { label: "Suggestions", href: "/suggestions", description: "Proposez des améliorations" },
  { label: "Répertoire professionnel", href: "/repertoire", description: "Trouvez un professionnel de confiance" },
  { label: "Comparer des quartiers", href: "/comparer-quartiers", description: "Comparez les quartiers côte à côte" },
  { label: "Guide premier achat", href: "/guide-premier-achat", description: "Tout savoir pour votre premier achat" },
  { label: "Premier acheteur", href: "/premier-acheteur", description: "RAP, CELIAPP et programmes d'aide" },
  { label: "Frais d'achat", href: "/frais-achat", description: "Tous les frais lors de l'achat d'une propriété" },
  { label: "Lexique immobilier", href: "/lexique", description: "Vocabulaire et termes immobiliers expliqués" },
  // { label: "Augmentation de loyer", href: "/calculateur-augmentation-loyer", description: "Calculez la hausse permise par le TAL" }, // Désactivé temporairement
  { label: "Droits du locataire", href: "/guide/droits-locataire-quebec", description: "Guide complet des droits des locataires" },
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
    auteurTag: p.auteur?.tag ?? null,
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
