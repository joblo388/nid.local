// Données de marché partagées — source unique pour /donnees-marche et /donnees-marche/[ville]

export type MarketData = {
  uni: string;
  condo: string;
  plex: string;
  delai: string;
  tendance: string;
  marche: string;
};

export const MARKET: Record<string, MarketData> = {
  // Montréal
  "plateau-mont-royal": { uni: "985 000 $", condo: "495 000 $", plex: "1 425 000 $", delai: "55 j", tendance: "+4,2%", marche: "equilibre" },
  "rosemont": { uni: "825 000 $", condo: "425 000 $", plex: "1 185 000 $", delai: "52 j", tendance: "+5,9%", marche: "vendeur" },
  "villeray": { uni: "645 000 $", condo: "345 000 $", plex: "925 000 $", delai: "48 j", tendance: "+7,3%", marche: "vendeur" },
  "griffintown": { uni: "695 000 $", condo: "395 000 $", plex: "985 000 $", delai: "44 j", tendance: "+8,5%", marche: "vendeur" },
  "saint-henri": { uni: "695 000 $", condo: "395 000 $", plex: "985 000 $", delai: "44 j", tendance: "+8,5%", marche: "vendeur" },
  "hochelaga": { uni: "565 000 $", condo: "325 000 $", plex: "825 000 $", delai: "50 j", tendance: "+9,2%", marche: "vendeur" },
  "cote-des-neiges": { uni: "795 000 $", condo: "425 000 $", plex: "1 125 000 $", delai: "57 j", tendance: "+5,5%", marche: "equilibre" },
  "notre-dame-de-grace": { uni: "795 000 $", condo: "425 000 $", plex: "1 125 000 $", delai: "57 j", tendance: "+5,5%", marche: "equilibre" },
  "outremont": { uni: "1 485 000 $", condo: "625 000 $", plex: "2 125 000 $", delai: "72 j", tendance: "+2,1%", marche: "equilibre" },
  "vieux-montreal": { uni: "—", condo: "525 000 $", plex: "—", delai: "76 j", tendance: "+4,5%", marche: "acheteur" },
  "verdun": { uni: "625 000 $", condo: "365 000 $", plex: "895 000 $", delai: "46 j", tendance: "+7,8%", marche: "vendeur" },
  "mile-end": { uni: "925 000 $", condo: "475 000 $", plex: "1 350 000 $", delai: "54 j", tendance: "+5,1%", marche: "equilibre" },
  "petite-bourgogne": { uni: "675 000 $", condo: "385 000 $", plex: "965 000 $", delai: "45 j", tendance: "+7,9%", marche: "vendeur" },
  "pointe-saint-charles": { uni: "595 000 $", condo: "345 000 $", plex: "855 000 $", delai: "46 j", tendance: "+8,2%", marche: "vendeur" },
  "saint-laurent": { uni: "685 000 $", condo: "365 000 $", plex: "925 000 $", delai: "51 j", tendance: "+6,5%", marche: "vendeur" },
  "montreal-nord": { uni: "425 000 $", condo: "265 000 $", plex: "625 000 $", delai: "43 j", tendance: "+8,9%", marche: "vendeur" },
  "anjou": { uni: "485 000 $", condo: "295 000 $", plex: "695 000 $", delai: "47 j", tendance: "+4,8%", marche: "equilibre" },
  "saint-leonard": { uni: "525 000 $", condo: "315 000 $", plex: "745 000 $", delai: "50 j", tendance: "+5,2%", marche: "equilibre" },
  "lasalle": { uni: "545 000 $", condo: "325 000 $", plex: "795 000 $", delai: "48 j", tendance: "+6,8%", marche: "vendeur" },
  "lachine": { uni: "525 000 $", condo: "315 000 $", plex: "765 000 $", delai: "46 j", tendance: "+7,1%", marche: "vendeur" },
  "riviere-des-prairies": { uni: "465 000 $", condo: "285 000 $", plex: "685 000 $", delai: "52 j", tendance: "+6,4%", marche: "vendeur" },
  "dollard-des-ormeaux": { uni: "595 000 $", condo: "335 000 $", plex: "—", delai: "54 j", tendance: "+5,7%", marche: "equilibre" },
  "mont-royal": { uni: "1 250 000 $", condo: "545 000 $", plex: "—", delai: "65 j", tendance: "+3,2%", marche: "equilibre" },
  "westmount": { uni: "1 650 000 $", condo: "685 000 $", plex: "—", delai: "70 j", tendance: "+2,8%", marche: "equilibre" },
  // Québec
  "saint-sauveur-qc": { uni: "425 000 $", condo: "195 000 $", plex: "—", delai: "32 j", tendance: "+14%", marche: "vendeur" },
  "limoilou": { uni: "455 000 $", condo: "205 000 $", plex: "—", delai: "30 j", tendance: "+15%", marche: "vendeur" },
  "vieux-port-qc": { uni: "—", condo: "265 000 $", plex: "—", delai: "38 j", tendance: "+10%", marche: "vendeur" },
  "saint-roch": { uni: "475 000 $", condo: "225 000 $", plex: "—", delai: "31 j", tendance: "+13%", marche: "vendeur" },
  "haute-ville": { uni: "525 000 $", condo: "245 000 $", plex: "—", delai: "34 j", tendance: "+12%", marche: "vendeur" },
  "sainte-foy": { uni: "575 000 $", condo: "255 000 $", plex: "—", delai: "31 j", tendance: "+13%", marche: "vendeur" },
  "charlesbourg": { uni: "485 000 $", condo: "215 000 $", plex: "—", delai: "32 j", tendance: "+13%", marche: "vendeur" },
  "beauport": { uni: "495 000 $", condo: "220 000 $", plex: "—", delai: "33 j", tendance: "+14%", marche: "vendeur" },
  // Laval
  "chomedey": { uni: "575 000 $", condo: "360 000 $", plex: "835 000 $", delai: "44 j", tendance: "+6,8%", marche: "vendeur" },
  "sainte-rose": { uni: "620 000 $", condo: "390 000 $", plex: "—", delai: "47 j", tendance: "+6,9%", marche: "vendeur" },
  "vimont": { uni: "565 000 $", condo: "370 000 $", plex: "—", delai: "43 j", tendance: "+7,5%", marche: "vendeur" },
  "auteuil": { uni: "555 000 $", condo: "365 000 $", plex: "—", delai: "44 j", tendance: "+7,1%", marche: "vendeur" },
  "duvernay": { uni: "545 000 $", condo: "355 000 $", plex: "—", delai: "43 j", tendance: "+7,3%", marche: "vendeur" },
  "fabreville": { uni: "560 000 $", condo: "360 000 $", plex: "—", delai: "45 j", tendance: "+6,9%", marche: "vendeur" },
  // Longueuil
  "vieux-longueuil": { uni: "525 000 $", condo: "335 000 $", plex: "775 000 $", delai: "44 j", tendance: "+7,1%", marche: "vendeur" },
  "saint-hubert": { uni: "565 000 $", condo: "355 000 $", plex: "—", delai: "43 j", tendance: "+7,8%", marche: "vendeur" },
  "greenfield-park": { uni: "535 000 $", condo: "340 000 $", plex: "—", delai: "45 j", tendance: "+6,9%", marche: "vendeur" },
  "brossard": { uni: "625 000 $", condo: "395 000 $", plex: "895 000 $", delai: "41 j", tendance: "+7,4%", marche: "vendeur" },
  // Sherbrooke
  "fleurimont": { uni: "455 000 $", condo: "290 000 $", plex: "—", delai: "45 j", tendance: "+7,5%", marche: "vendeur" },
  "jacques-cartier-shbk": { uni: "465 000 $", condo: "300 000 $", plex: "—", delai: "46 j", tendance: "+7%", marche: "vendeur" },
  "mont-bellevue": { uni: "475 000 $", condo: "305 000 $", plex: "—", delai: "47 j", tendance: "+6,8%", marche: "vendeur" },
  "rock-forest": { uni: "485 000 $", condo: "310 000 $", plex: "—", delai: "46 j", tendance: "+6,8%", marche: "vendeur" },
  // Gatineau
  "hull": { uni: "545 000 $", condo: "295 000 $", plex: "—", delai: "44 j", tendance: "+1,8%", marche: "equilibre" },
  "aylmer": { uni: "575 000 $", condo: "305 000 $", plex: "—", delai: "43 j", tendance: "+2,5%", marche: "equilibre" },
  "gatineau-secteur": { uni: "565 000 $", condo: "300 000 $", plex: "—", delai: "42 j", tendance: "+2%", marche: "equilibre" },
  "buckingham": { uni: "465 000 $", condo: "265 000 $", plex: "—", delai: "52 j", tendance: "+2,2%", marche: "equilibre" },
  // Villes sans sous-quartiers
  "trois-rivieres": { uni: "460 000 $", condo: "270 000 $", plex: "—", delai: "48 j", tendance: "+10%", marche: "vendeur" },
  "saguenay": { uni: "285 000 $", condo: "165 000 $", plex: "195 000 $", delai: "52 j", tendance: "+12%", marche: "vendeur" },
  "levis": { uni: "495 000 $", condo: "225 000 $", plex: "—", delai: "35 j", tendance: "+12%", marche: "vendeur" },
  "terrebonne": { uni: "495 000 $", condo: "325 000 $", plex: "—", delai: "46 j", tendance: "+8,1%", marche: "vendeur" },
  "rimouski": { uni: "295 000 $", condo: "185 000 $", plex: "—", delai: "55 j", tendance: "+9,5%", marche: "vendeur" },
  "drummondville": { uni: "365 000 $", condo: "240 000 $", plex: "—", delai: "50 j", tendance: "+10,2%", marche: "vendeur" },
};

// Villes qui ont des données de marché (avec quartiers ou en standalone)
export type CityInfo = {
  slug: string;
  nom: string;
  region: string;
  description: string;
  faq: { q: string; r: string }[];
};

export const CITY_SEO: Record<string, CityInfo> = {
  montreal: {
    slug: "montreal", nom: "Montréal", region: "Grand Montréal",
    description: "Prix médians des maisons, condos et plex par arrondissement de Montréal. 24 quartiers couverts avec tendances, délais de vente et conditions de marché.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Montréal en 2026?", r: "Le prix médian d'une unifamiliale à Montréal varie de 425 000 $ (Montréal-Nord) à 1 650 000 $ (Westmount). Pour un condo, les prix vont de 265 000 $ à 685 000 $ selon l'arrondissement. Les quartiers les plus abordables sont Montréal-Nord, Rivière-des-Prairies et Anjou." },
      { q: "Quels quartiers de Montréal augmentent le plus en 2026?", r: "Hochelaga-Maisonneuve (+9,2%), Montréal-Nord (+8,9%), Griffintown/Saint-Henri (+8,5%) et Pointe-Saint-Charles (+8,2%) connaissent les plus fortes hausses. Ces quartiers restent parmi les plus abordables de l'île." },
      { q: "Est-ce un marché acheteur ou vendeur à Montréal?", r: "La situation varie par arrondissement. Les quartiers abordables (Hochelaga, Verdun, Villeray) sont en marché vendeur avec une forte demande. Les secteurs plus chers (Outremont, Vieux-Montréal, Westmount) sont en marché équilibré ou acheteur." },
      { q: "Combien de temps faut-il pour vendre à Montréal?", r: "Le délai moyen de vente à Montréal est de 43 à 76 jours selon le quartier. Les secteurs les plus rapides sont Montréal-Nord (43 j) et Griffintown (44 j). Le Vieux-Montréal est le plus lent (76 j)." },
    ],
  },
  quebec: {
    slug: "quebec", nom: "Québec", region: "Capitale-Nationale",
    description: "Prix médians des propriétés par quartier de la ville de Québec. Marché très dynamique avec des hausses de 10% à 15% en 2026.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Québec en 2026?", r: "Le prix médian d'une unifamiliale à Québec varie de 425 000 $ (Saint-Sauveur) à 575 000 $ (Sainte-Foy). Les condos sont très abordables, de 195 000 $ à 265 000 $ selon le quartier." },
      { q: "Le marché immobilier de Québec est-il en hausse?", r: "Oui, Québec connaît les plus fortes hausses au Québec en 2026, avec des augmentations de +10% à +15% selon les quartiers. Limoilou mène avec +15%. Le marché est fortement vendeur dans tous les quartiers." },
      { q: "Quels sont les quartiers les plus abordables à Québec?", r: "Saint-Sauveur (unifamiliale 425 000 $, condo 195 000 $) et Limoilou (455 000 $, 205 000 $) sont les plus abordables. Sainte-Foy et Haute-Ville sont les plus chers." },
    ],
  },
  laval: {
    slug: "laval", nom: "Laval", region: "Grand Montréal",
    description: "Prix médians par secteur de Laval. Marché vendeur dynamique avec des hausses de 6,8% à 7,5% en 2026.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Laval en 2026?", r: "Les prix d'une unifamiliale à Laval varient de 545 000 $ (Duvernay) à 620 000 $ (Sainte-Rose). Les condos se situent entre 355 000 $ et 390 000 $. Laval reste plus abordable que Montréal tout en offrant un bon accès au centre-ville." },
      { q: "Le marché de Laval est-il en hausse?", r: "Oui, tous les secteurs de Laval sont en marché vendeur avec des hausses de +6,8% à +7,5%. Vimont mène avec +7,5%. Les délais de vente sont rapides (43 à 47 jours)." },
    ],
  },
  longueuil: {
    slug: "longueuil", nom: "Longueuil", region: "Grand Montréal",
    description: "Prix médians par secteur de Longueuil et Rive-Sud. Marché vendeur avec des hausses de 6,9% à 7,8%.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Longueuil en 2026?", r: "Les prix d'une unifamiliale varient de 525 000 $ (Vieux-Longueuil) à 625 000 $ (Brossard). Brossard est le secteur le plus recherché avec un accès facile au REM." },
      { q: "Brossard est-il un bon investissement?", r: "Brossard connaît une hausse de +7,4% et offre des plex autour de 895 000 $. L'arrivée du REM et la proximité du DIX30 en font un secteur en forte demande." },
    ],
  },
  sherbrooke: {
    slug: "sherbrooke", nom: "Sherbrooke", region: "Estrie",
    description: "Prix médians des propriétés par secteur de Sherbrooke. Marché vendeur abordable avec des hausses de 6,8% à 7,5%.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Sherbrooke en 2026?", r: "Les prix d'une unifamiliale à Sherbrooke varient de 455 000 $ (Fleurimont) à 485 000 $ (Rock Forest). Les condos se situent entre 290 000 $ et 310 000 $. Sherbrooke reste parmi les villes les plus abordables au Québec." },
      { q: "Le marché de Sherbrooke est-il intéressant pour les premiers acheteurs?", r: "Oui, Sherbrooke offre des prix nettement inférieurs à Montréal et un marché vendeur dynamique (+6,8% à +7,5%). La ville universitaire attire une demande locative stable, ce qui en fait aussi un bon marché pour les investisseurs en plex." },
    ],
  },
  gatineau: {
    slug: "gatineau", nom: "Gatineau", region: "Outaouais",
    description: "Prix médians par secteur de Gatineau. Marché équilibré avec des hausses modérées de 1,8% à 2,5%.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Gatineau en 2026?", r: "Les prix d'une unifamiliale varient de 465 000 $ (Buckingham) à 575 000 $ (Aylmer). Les condos se situent entre 265 000 $ et 305 000 $. Gatineau reste plus abordable qu'Ottawa voisine." },
      { q: "Le marché de Gatineau est-il stable?", r: "Oui, Gatineau connaît un marché équilibré avec des hausses modérées de +1,8% à +2,5%. Après les fortes hausses des années précédentes, le marché se stabilise. C'est un bon moment pour les acheteurs qui cherchent de la stabilité." },
    ],
  },
  "trois-rivieres": {
    slug: "trois-rivieres", nom: "Trois-Rivières", region: "Mauricie",
    description: "Données de marché pour Trois-Rivières. Unifamiliale médiane à 460 000 $, marché vendeur avec +10% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Trois-Rivières en 2026?", r: "L'unifamiliale médiane est à 460 000 $ et le condo médian à 270 000 $. Trois-Rivières connaît une hausse de +10% et un marché vendeur avec des délais de vente de 48 jours." },
    ],
  },
  saguenay: {
    slug: "saguenay", nom: "Saguenay", region: "Saguenay–Lac-Saint-Jean",
    description: "Données de marché pour Saguenay. La ville la plus abordable du Québec avec une unifamiliale médiane à 285 000 $.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Saguenay en 2026?", r: "Saguenay est la grande ville la plus abordable du Québec avec une unifamiliale médiane à 285 000 $, un condo à 165 000 $ et un plex à 195 000 $. Le marché est vendeur avec +12% de hausse." },
    ],
  },
  levis: {
    slug: "levis", nom: "Lévis", region: "Chaudière-Appalaches",
    description: "Données de marché pour Lévis. Marché vendeur dynamique avec +12% de hausse et des délais de vente très rapides.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Lévis en 2026?", r: "L'unifamiliale médiane est à 495 000 $ et le condo à 225 000 $. Lévis connaît une forte hausse de +12% avec des délais de vente très rapides (35 jours). La proximité de Québec et le pont en font un marché très recherché." },
    ],
  },
  terrebonne: {
    slug: "terrebonne", nom: "Terrebonne", region: "Lanaudière",
    description: "Données de marché pour Terrebonne. Marché vendeur avec +8,1% de hausse, populaire auprès des jeunes familles.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Terrebonne en 2026?", r: "L'unifamiliale médiane est à 495 000 $ et le condo à 325 000 $. Terrebonne est populaire auprès des jeunes familles qui cherchent plus d'espace à prix abordable. Le marché est vendeur avec +8,1% de hausse." },
    ],
  },
  rimouski: {
    slug: "rimouski", nom: "Rimouski", region: "Bas-Saint-Laurent",
    description: "Données de marché pour Rimouski. Ville très abordable avec une unifamiliale médiane à 295 000 $.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Rimouski en 2026?", r: "L'unifamiliale médiane est à 295 000 $ et le condo à 185 000 $. Rimouski est parmi les villes les plus abordables du Québec. Le marché est vendeur avec +9,5% de hausse." },
    ],
  },
  drummondville: {
    slug: "drummondville", nom: "Drummondville", region: "Centre-du-Québec",
    description: "Données de marché pour Drummondville. Marché en forte hausse de +10,2%, situé entre Montréal et Québec.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Drummondville en 2026?", r: "L'unifamiliale médiane est à 365 000 $ et le condo à 240 000 $. Drummondville profite de sa position stratégique entre Montréal et Québec. Le marché est vendeur avec +10,2% de hausse." },
    ],
  },
};

// Helper pour calculer les stats d'une ville
export function getCityStats(villeSlug: string, quartierSlugs: string[]) {
  const entries = quartierSlugs.map((s) => MARKET[s]).filter(Boolean);
  if (entries.length === 0) return null;

  const parse = (s: string) => {
    if (s === "—") return null;
    return parseInt(s.replace(/\s/g, "").replace("$", ""), 10);
  };

  const unis = entries.map((e) => parse(e.uni)).filter((v): v is number => v !== null);
  const condos = entries.map((e) => parse(e.condo)).filter((v): v is number => v !== null);
  const plexs = entries.map((e) => parse(e.plex)).filter((v): v is number => v !== null);
  const delais = entries.map((e) => parseInt(e.delai, 10)).filter((v) => !isNaN(v));
  const tendances = entries.map((e) => parseFloat(e.tendance)).filter((v) => !isNaN(v));

  const median = (arr: number[]) => {
    if (arr.length === 0) return null;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  };

  const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null;

  const format = (n: number | null) => n !== null ? n.toLocaleString("fr-CA") + " $" : "—";

  const vendeurs = entries.filter((e) => e.marche === "vendeur").length;
  const acheteurs = entries.filter((e) => e.marche === "acheteur").length;
  const marche = vendeurs > acheteurs ? "vendeur" : acheteurs > vendeurs ? "acheteur" : "équilibré";

  return {
    uniMedian: format(median(unis)),
    condoMedian: format(median(condos)),
    plexMedian: format(median(plexs)),
    delaiMoyen: avg(delais) ? `${avg(delais)} j` : "—",
    tendanceMoyenne: tendances.length > 0 ? `+${(tendances.reduce((a, b) => a + b, 0) / tendances.length).toFixed(1)}%` : "—",
    marche,
    nbQuartiers: entries.length,
  };
}
