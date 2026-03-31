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
  // ── Banlieues et régions ──
  // Grand Montréal
  "beloeil": { uni: "780 000 $", condo: "405 000 $", plex: "—", delai: "22 j", tendance: "+7,0%", marche: "vendeur" },
  "blainville": { uni: "730 000 $", condo: "405 000 $", plex: "—", delai: "44 j", tendance: "+7,2%", marche: "vendeur" },
  "boisbriand": { uni: "610 000 $", condo: "380 000 $", plex: "—", delai: "45 j", tendance: "+7,0%", marche: "vendeur" },
  "boucherville": { uni: "915 000 $", condo: "435 000 $", plex: "—", delai: "42 j", tendance: "+6,8%", marche: "vendeur" },
  "candiac": { uni: "590 000 $", condo: "370 000 $", plex: "—", delai: "44 j", tendance: "+7,0%", marche: "vendeur" },
  "chambly": { uni: "530 000 $", condo: "355 000 $", plex: "—", delai: "46 j", tendance: "+7,5%", marche: "vendeur" },
  "chateauguay": { uni: "480 000 $", condo: "305 000 $", plex: "—", delai: "52 j", tendance: "+7,5%", marche: "vendeur" },
  "deux-montagnes": { uni: "530 000 $", condo: "340 000 $", plex: "—", delai: "47 j", tendance: "+7,8%", marche: "vendeur" },
  "la-prairie": { uni: "605 000 $", condo: "380 000 $", plex: "—", delai: "43 j", tendance: "+7,2%", marche: "vendeur" },
  "l-assomption": { uni: "480 000 $", condo: "305 000 $", plex: "—", delai: "49 j", tendance: "+7,9%", marche: "vendeur" },
  "mascouche": { uni: "555 000 $", condo: "350 000 $", plex: "—", delai: "46 j", tendance: "+7,5%", marche: "vendeur" },
  "mirabel": { uni: "565 000 $", condo: "345 000 $", plex: "—", delai: "49 j", tendance: "+8,0%", marche: "vendeur" },
  "mont-saint-hilaire": { uni: "840 000 $", condo: "410 000 $", plex: "—", delai: "65 j", tendance: "+7,2%", marche: "equilibre" },
  "repentigny": { uni: "520 000 $", condo: "335 000 $", plex: "—", delai: "44 j", tendance: "+7,8%", marche: "vendeur" },
  "saint-bruno-de-montarville": { uni: "1 025 000 $", condo: "465 000 $", plex: "—", delai: "48 j", tendance: "+7,0%", marche: "vendeur" },
  "saint-constant": { uni: "575 000 $", condo: "360 000 $", plex: "—", delai: "45 j", tendance: "+7,0%", marche: "vendeur" },
  "saint-eustache": { uni: "530 000 $", condo: "340 000 $", plex: "—", delai: "47 j", tendance: "+8,0%", marche: "vendeur" },
  "saint-hyacinthe": { uni: "530 000 $", condo: "315 000 $", plex: "—", delai: "48 j", tendance: "+8,2%", marche: "vendeur" },
  "saint-jerome": { uni: "480 000 $", condo: "315 000 $", plex: "—", delai: "52 j", tendance: "+9,1%", marche: "vendeur" },
  "saint-lambert": { uni: "745 000 $", condo: "430 000 $", plex: "—", delai: "50 j", tendance: "+6,5%", marche: "equilibre" },
  "sainte-julie": { uni: "655 000 $", condo: "365 000 $", plex: "—", delai: "25 j", tendance: "+7,3%", marche: "vendeur" },
  "sainte-therese": { uni: "570 000 $", condo: "365 000 $", plex: "—", delai: "45 j", tendance: "+7,5%", marche: "vendeur" },
  "varennes": { uni: "895 000 $", condo: "420 000 $", plex: "—", delai: "25 j", tendance: "+6,8%", marche: "vendeur" },
  "vaudreuil-dorion": { uni: "640 000 $", condo: "445 000 $", plex: "—", delai: "46 j", tendance: "+7,8%", marche: "vendeur" },
  // Capitale-Nationale
  "l-ancienne-lorette": { uni: "395 000 $", condo: "215 000 $", plex: "—", delai: "34 j", tendance: "+12%", marche: "vendeur" },
  "saint-augustin-de-desmaures": { uni: "570 000 $", condo: "265 000 $", plex: "—", delai: "33 j", tendance: "+13%", marche: "vendeur" },
  "stoneham": { uni: "415 000 $", condo: "230 000 $", plex: "—", delai: "42 j", tendance: "+11%", marche: "vendeur" },
  // Chaudière-Appalaches
  "montmagny": { uni: "285 000 $", condo: "175 000 $", plex: "—", delai: "62 j", tendance: "+8,5%", marche: "equilibre" },
  "saint-georges": { uni: "355 000 $", condo: "215 000 $", plex: "—", delai: "52 j", tendance: "+10%", marche: "vendeur" },
  "sainte-marie": { uni: "365 000 $", condo: "220 000 $", plex: "—", delai: "52 j", tendance: "+9,5%", marche: "vendeur" },
  "thetford-mines": { uni: "270 000 $", condo: "160 000 $", plex: "—", delai: "65 j", tendance: "+7,0%", marche: "equilibre" },
  // Estrie
  "coaticook": { uni: "320 000 $", condo: "195 000 $", plex: "—", delai: "68 j", tendance: "+7,0%", marche: "equilibre" },
  "lac-megantic": { uni: "285 000 $", condo: "175 000 $", plex: "—", delai: "72 j", tendance: "+7,5%", marche: "equilibre" },
  "magog": { uni: "430 000 $", condo: "315 000 $", plex: "—", delai: "55 j", tendance: "+8,5%", marche: "vendeur" },
  // Outaouais
  "chelsea": { uni: "825 000 $", condo: "430 000 $", plex: "—", delai: "52 j", tendance: "+2,5%", marche: "equilibre" },
  // Mauricie
  "la-tuque": { uni: "215 000 $", condo: "—", plex: "—", delai: "75 j", tendance: "+7,5%", marche: "equilibre" },
  "louiseville": { uni: "310 000 $", condo: "185 000 $", plex: "—", delai: "65 j", tendance: "+8,0%", marche: "equilibre" },
  "shawinigan": { uni: "320 000 $", condo: "195 000 $", plex: "—", delai: "52 j", tendance: "+8,2%", marche: "vendeur" },
  // Saguenay-Lac-Saint-Jean
  "alma": { uni: "315 000 $", condo: "185 000 $", plex: "—", delai: "58 j", tendance: "+7,5%", marche: "vendeur" },
  "dolbeau-mistassini": { uni: "245 000 $", condo: "—", plex: "—", delai: "72 j", tendance: "+8,0%", marche: "equilibre" },
  "roberval": { uni: "225 000 $", condo: "—", plex: "—", delai: "75 j", tendance: "+8,0%", marche: "equilibre" },
  // Lanaudière
  "joliette": { uni: "510 000 $", condo: "305 000 $", plex: "—", delai: "52 j", tendance: "+8,5%", marche: "vendeur" },
  "rawdon": { uni: "430 000 $", condo: "275 000 $", plex: "—", delai: "60 j", tendance: "+9,0%", marche: "vendeur" },
  "saint-lin-laurentides": { uni: "515 000 $", condo: "330 000 $", plex: "—", delai: "50 j", tendance: "+8,5%", marche: "vendeur" },
  // Laurentides
  "lachute": { uni: "380 000 $", condo: "245 000 $", plex: "—", delai: "65 j", tendance: "+5,5%", marche: "equilibre" },
  "mont-laurier": { uni: "355 000 $", condo: "225 000 $", plex: "—", delai: "68 j", tendance: "+7,0%", marche: "equilibre" },
  "mont-tremblant": { uni: "435 000 $", condo: "320 000 $", plex: "—", delai: "65 j", tendance: "+6,5%", marche: "equilibre" },
  "prevost": { uni: "515 000 $", condo: "325 000 $", plex: "—", delai: "56 j", tendance: "+8,2%", marche: "vendeur" },
  "saint-sauveur": { uni: "635 000 $", condo: "390 000 $", plex: "—", delai: "58 j", tendance: "+8,5%", marche: "vendeur" },
  "sainte-adele": { uni: "570 000 $", condo: "345 000 $", plex: "—", delai: "60 j", tendance: "+8,0%", marche: "vendeur" },
  "sainte-agathe-des-monts": { uni: "510 000 $", condo: "320 000 $", plex: "—", delai: "62 j", tendance: "+8,0%", marche: "vendeur" },
  // Montérégie
  "cowansville": { uni: "465 000 $", condo: "285 000 $", plex: "—", delai: "52 j", tendance: "+8,5%", marche: "vendeur" },
  "granby": { uni: "530 000 $", condo: "320 000 $", plex: "—", delai: "50 j", tendance: "+8,2%", marche: "vendeur" },
  "saint-jean-sur-richelieu": { uni: "580 000 $", condo: "355 000 $", plex: "—", delai: "47 j", tendance: "+7,5%", marche: "vendeur" },
  "salaberry-de-valleyfield": { uni: "490 000 $", condo: "295 000 $", plex: "—", delai: "54 j", tendance: "+8,0%", marche: "vendeur" },
  "sorel-tracy": { uni: "400 000 $", condo: "240 000 $", plex: "—", delai: "58 j", tendance: "+8,0%", marche: "equilibre" },
  // Centre-du-Québec
  "becancour": { uni: "320 000 $", condo: "190 000 $", plex: "—", delai: "58 j", tendance: "+9,0%", marche: "vendeur" },
  "plessisville": { uni: "270 000 $", condo: "165 000 $", plex: "—", delai: "65 j", tendance: "+8,0%", marche: "equilibre" },
  "victoriaville": { uni: "362 000 $", condo: "220 000 $", plex: "—", delai: "55 j", tendance: "+8,0%", marche: "vendeur" },
  // Bas-Saint-Laurent
  "amqui": { uni: "230 000 $", condo: "—", plex: "—", delai: "78 j", tendance: "+7,0%", marche: "equilibre" },
  "matane": { uni: "260 000 $", condo: "155 000 $", plex: "—", delai: "72 j", tendance: "+8,3%", marche: "equilibre" },
  "riviere-du-loup": { uni: "378 000 $", condo: "230 000 $", plex: "—", delai: "58 j", tendance: "+8,0%", marche: "vendeur" },
  // Gaspésie
  "carleton-sur-mer": { uni: "305 000 $", condo: "—", plex: "—", delai: "75 j", tendance: "+9,5%", marche: "equilibre" },
  "gaspe": { uni: "265 000 $", condo: "—", plex: "—", delai: "78 j", tendance: "+10%", marche: "equilibre" },
  "new-richmond": { uni: "225 000 $", condo: "—", plex: "—", delai: "82 j", tendance: "+9,0%", marche: "equilibre" },
  "perce": { uni: "245 000 $", condo: "—", plex: "—", delai: "85 j", tendance: "+10%", marche: "equilibre" },
  // Côte-Nord
  "baie-comeau": { uni: "270 000 $", condo: "155 000 $", plex: "—", delai: "68 j", tendance: "+8,0%", marche: "equilibre" },
  "havre-saint-pierre": { uni: "230 000 $", condo: "—", plex: "—", delai: "85 j", tendance: "+7,0%", marche: "equilibre" },
  "sept-iles": { uni: "315 000 $", condo: "175 000 $", plex: "—", delai: "62 j", tendance: "+7,8%", marche: "equilibre" },
  // Abitibi-Témiscamingue
  "amos": { uni: "340 000 $", condo: "195 000 $", plex: "—", delai: "62 j", tendance: "+8,0%", marche: "vendeur" },
  "la-sarre": { uni: "275 000 $", condo: "165 000 $", plex: "—", delai: "68 j", tendance: "+7,5%", marche: "equilibre" },
  "rouyn-noranda": { uni: "362 000 $", condo: "215 000 $", plex: "—", delai: "56 j", tendance: "+8,0%", marche: "vendeur" },
  "val-d-or": { uni: "420 000 $", condo: "245 000 $", plex: "—", delai: "58 j", tendance: "+7,7%", marche: "vendeur" },
  // Nord-du-Québec
  "chibougamau": { uni: "210 000 $", condo: "—", plex: "—", delai: "85 j", tendance: "+6,0%", marche: "equilibre" },
  // Îles-de-la-Madeleine
  "iles-de-la-madeleine": { uni: "320 000 $", condo: "—", plex: "—", delai: "85 j", tendance: "+10%", marche: "equilibre" },
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
  // ── Grand Montréal ──
  beloeil: {
    slug: "beloeil", nom: "Beloeil", region: "Grand Montréal",
    description: "Données de marché pour Beloeil. Unifamiliale médiane à 780 000 $, marché vendeur avec +7,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Beloeil en 2026?", r: "L'unifamiliale médiane est à 780 000 $ et le condo médian à 405 000 $. Beloeil connaît une hausse de +7,0% et un marché vendeur avec des délais de vente de 22 jours." },
    ],
  },
  blainville: {
    slug: "blainville", nom: "Blainville", region: "Grand Montréal",
    description: "Données de marché pour Blainville. Unifamiliale médiane à 730 000 $, marché vendeur avec +7,2% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Blainville en 2026?", r: "L'unifamiliale médiane est à 730 000 $ et le condo médian à 405 000 $. Blainville connaît une hausse de +7,2% et un marché vendeur avec des délais de vente de 44 jours." },
    ],
  },
  boisbriand: {
    slug: "boisbriand", nom: "Boisbriand", region: "Grand Montréal",
    description: "Données de marché pour Boisbriand. Unifamiliale médiane à 610 000 $, marché vendeur avec +7,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Boisbriand en 2026?", r: "L'unifamiliale médiane est à 610 000 $ et le condo médian à 380 000 $. Boisbriand connaît une hausse de +7,0% et un marché vendeur avec des délais de vente de 45 jours." },
    ],
  },
  boucherville: {
    slug: "boucherville", nom: "Boucherville", region: "Grand Montréal",
    description: "Données de marché pour Boucherville. Unifamiliale médiane à 915 000 $, marché vendeur avec +6,8% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Boucherville en 2026?", r: "L'unifamiliale médiane est à 915 000 $ et le condo médian à 435 000 $. Boucherville connaît une hausse de +6,8% et un marché vendeur avec des délais de vente de 42 jours." },
    ],
  },
  candiac: {
    slug: "candiac", nom: "Candiac", region: "Grand Montréal",
    description: "Données de marché pour Candiac. Unifamiliale médiane à 590 000 $, marché vendeur avec +7,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Candiac en 2026?", r: "L'unifamiliale médiane est à 590 000 $ et le condo médian à 370 000 $. Candiac connaît une hausse de +7,0% et un marché vendeur avec des délais de vente de 44 jours." },
    ],
  },
  chambly: {
    slug: "chambly", nom: "Chambly", region: "Grand Montréal",
    description: "Données de marché pour Chambly. Unifamiliale médiane à 530 000 $, marché vendeur avec +7,5% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Chambly en 2026?", r: "L'unifamiliale médiane est à 530 000 $ et le condo médian à 355 000 $. Chambly connaît une hausse de +7,5% et un marché vendeur avec des délais de vente de 46 jours." },
    ],
  },
  chateauguay: {
    slug: "chateauguay", nom: "Châteauguay", region: "Grand Montréal",
    description: "Données de marché pour Châteauguay. Unifamiliale médiane à 480 000 $, marché vendeur avec +7,5% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Châteauguay en 2026?", r: "L'unifamiliale médiane est à 480 000 $ et le condo médian à 305 000 $. Châteauguay connaît une hausse de +7,5% et un marché vendeur avec des délais de vente de 52 jours." },
    ],
  },
  "deux-montagnes": {
    slug: "deux-montagnes", nom: "Deux-Montagnes", region: "Grand Montréal",
    description: "Données de marché pour Deux-Montagnes. Unifamiliale médiane à 530 000 $, marché vendeur avec +7,8% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Deux-Montagnes en 2026?", r: "L'unifamiliale médiane est à 530 000 $ et le condo médian à 340 000 $. Deux-Montagnes connaît une hausse de +7,8% et un marché vendeur avec des délais de vente de 47 jours." },
    ],
  },
  "la-prairie": {
    slug: "la-prairie", nom: "La Prairie", region: "Grand Montréal",
    description: "Données de marché pour La Prairie. Unifamiliale médiane à 605 000 $, marché vendeur avec +7,2% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à La Prairie en 2026?", r: "L'unifamiliale médiane est à 605 000 $ et le condo médian à 380 000 $. La Prairie connaît une hausse de +7,2% et un marché vendeur avec des délais de vente de 43 jours." },
    ],
  },
  "l-assomption": {
    slug: "l-assomption", nom: "L'Assomption", region: "Grand Montréal",
    description: "Données de marché pour L'Assomption. Unifamiliale médiane à 480 000 $, marché vendeur avec +7,9% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à L'Assomption en 2026?", r: "L'unifamiliale médiane est à 480 000 $ et le condo médian à 305 000 $. L'Assomption connaît une hausse de +7,9% et un marché vendeur avec des délais de vente de 49 jours." },
    ],
  },
  mascouche: {
    slug: "mascouche", nom: "Mascouche", region: "Grand Montréal",
    description: "Données de marché pour Mascouche. Unifamiliale médiane à 555 000 $, marché vendeur avec +7,5% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Mascouche en 2026?", r: "L'unifamiliale médiane est à 555 000 $ et le condo médian à 350 000 $. Mascouche connaît une hausse de +7,5% et un marché vendeur avec des délais de vente de 46 jours." },
    ],
  },
  mirabel: {
    slug: "mirabel", nom: "Mirabel", region: "Grand Montréal",
    description: "Données de marché pour Mirabel. Unifamiliale médiane à 565 000 $, marché vendeur avec +8,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Mirabel en 2026?", r: "L'unifamiliale médiane est à 565 000 $ et le condo médian à 345 000 $. Mirabel connaît une hausse de +8,0% et un marché vendeur avec des délais de vente de 49 jours." },
    ],
  },
  "mont-saint-hilaire": {
    slug: "mont-saint-hilaire", nom: "Mont-Saint-Hilaire", region: "Grand Montréal",
    description: "Données de marché pour Mont-Saint-Hilaire. Unifamiliale médiane à 840 000 $, marché équilibré avec +7,2% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Mont-Saint-Hilaire en 2026?", r: "L'unifamiliale médiane est à 840 000 $ et le condo médian à 410 000 $. Mont-Saint-Hilaire connaît une hausse de +7,2% et un marché équilibré avec des délais de vente de 65 jours." },
    ],
  },
  repentigny: {
    slug: "repentigny", nom: "Repentigny", region: "Grand Montréal",
    description: "Données de marché pour Repentigny. Unifamiliale médiane à 520 000 $, marché vendeur avec +7,8% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Repentigny en 2026?", r: "L'unifamiliale médiane est à 520 000 $ et le condo médian à 335 000 $. Repentigny connaît une hausse de +7,8% et un marché vendeur avec des délais de vente de 44 jours." },
    ],
  },
  "saint-bruno-de-montarville": {
    slug: "saint-bruno-de-montarville", nom: "Saint-Bruno-de-Montarville", region: "Grand Montréal",
    description: "Données de marché pour Saint-Bruno-de-Montarville. Unifamiliale médiane à 1 025 000 $, marché vendeur avec +7,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Saint-Bruno-de-Montarville en 2026?", r: "L'unifamiliale médiane est à 1 025 000 $ et le condo médian à 465 000 $. Saint-Bruno-de-Montarville connaît une hausse de +7,0% et un marché vendeur avec des délais de vente de 48 jours." },
    ],
  },
  "saint-constant": {
    slug: "saint-constant", nom: "Saint-Constant", region: "Grand Montréal",
    description: "Données de marché pour Saint-Constant. Unifamiliale médiane à 575 000 $, marché vendeur avec +7,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Saint-Constant en 2026?", r: "L'unifamiliale médiane est à 575 000 $ et le condo médian à 360 000 $. Saint-Constant connaît une hausse de +7,0% et un marché vendeur avec des délais de vente de 45 jours." },
    ],
  },
  "saint-eustache": {
    slug: "saint-eustache", nom: "Saint-Eustache", region: "Grand Montréal",
    description: "Données de marché pour Saint-Eustache. Unifamiliale médiane à 530 000 $, marché vendeur avec +8,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Saint-Eustache en 2026?", r: "L'unifamiliale médiane est à 530 000 $ et le condo médian à 340 000 $. Saint-Eustache connaît une hausse de +8,0% et un marché vendeur avec des délais de vente de 47 jours." },
    ],
  },
  "saint-hyacinthe": {
    slug: "saint-hyacinthe", nom: "Saint-Hyacinthe", region: "Grand Montréal",
    description: "Données de marché pour Saint-Hyacinthe. Unifamiliale médiane à 530 000 $, marché vendeur avec +8,2% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Saint-Hyacinthe en 2026?", r: "L'unifamiliale médiane est à 530 000 $ et le condo médian à 315 000 $. Saint-Hyacinthe connaît une hausse de +8,2% et un marché vendeur avec des délais de vente de 48 jours." },
    ],
  },
  "saint-jerome": {
    slug: "saint-jerome", nom: "Saint-Jérôme", region: "Grand Montréal",
    description: "Données de marché pour Saint-Jérôme. Unifamiliale médiane à 480 000 $, marché vendeur avec +9,1% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Saint-Jérôme en 2026?", r: "L'unifamiliale médiane est à 480 000 $ et le condo médian à 315 000 $. Saint-Jérôme connaît une hausse de +9,1% et un marché vendeur avec des délais de vente de 52 jours." },
    ],
  },
  "saint-lambert": {
    slug: "saint-lambert", nom: "Saint-Lambert", region: "Grand Montréal",
    description: "Données de marché pour Saint-Lambert. Unifamiliale médiane à 745 000 $, marché équilibré avec +6,5% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Saint-Lambert en 2026?", r: "L'unifamiliale médiane est à 745 000 $ et le condo médian à 430 000 $. Saint-Lambert connaît une hausse de +6,5% et un marché équilibré avec des délais de vente de 50 jours." },
    ],
  },
  "sainte-julie": {
    slug: "sainte-julie", nom: "Sainte-Julie", region: "Grand Montréal",
    description: "Données de marché pour Sainte-Julie. Unifamiliale médiane à 655 000 $, marché vendeur avec +7,3% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Sainte-Julie en 2026?", r: "L'unifamiliale médiane est à 655 000 $ et le condo médian à 365 000 $. Sainte-Julie connaît une hausse de +7,3% et un marché vendeur avec des délais de vente de 25 jours." },
    ],
  },
  "sainte-therese": {
    slug: "sainte-therese", nom: "Sainte-Thérèse", region: "Grand Montréal",
    description: "Données de marché pour Sainte-Thérèse. Unifamiliale médiane à 570 000 $, marché vendeur avec +7,5% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Sainte-Thérèse en 2026?", r: "L'unifamiliale médiane est à 570 000 $ et le condo médian à 365 000 $. Sainte-Thérèse connaît une hausse de +7,5% et un marché vendeur avec des délais de vente de 45 jours." },
    ],
  },
  varennes: {
    slug: "varennes", nom: "Varennes", region: "Grand Montréal",
    description: "Données de marché pour Varennes. Unifamiliale médiane à 895 000 $, marché vendeur avec +6,8% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Varennes en 2026?", r: "L'unifamiliale médiane est à 895 000 $ et le condo médian à 420 000 $. Varennes connaît une hausse de +6,8% et un marché vendeur avec des délais de vente de 25 jours." },
    ],
  },
  "vaudreuil-dorion": {
    slug: "vaudreuil-dorion", nom: "Vaudreuil-Dorion", region: "Grand Montréal",
    description: "Données de marché pour Vaudreuil-Dorion. Unifamiliale médiane à 640 000 $, marché vendeur avec +7,8% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Vaudreuil-Dorion en 2026?", r: "L'unifamiliale médiane est à 640 000 $ et le condo médian à 445 000 $. Vaudreuil-Dorion connaît une hausse de +7,8% et un marché vendeur avec des délais de vente de 46 jours." },
    ],
  },
  // ── Capitale-Nationale ──
  "l-ancienne-lorette": {
    slug: "l-ancienne-lorette", nom: "L'Ancienne-Lorette", region: "Capitale-Nationale",
    description: "Données de marché pour L'Ancienne-Lorette. Unifamiliale médiane à 395 000 $, marché vendeur avec +12% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à L'Ancienne-Lorette en 2026?", r: "L'unifamiliale médiane est à 395 000 $ et le condo médian à 215 000 $. L'Ancienne-Lorette connaît une hausse de +12% et un marché vendeur avec des délais de vente de 34 jours." },
    ],
  },
  "saint-augustin-de-desmaures": {
    slug: "saint-augustin-de-desmaures", nom: "Saint-Augustin-de-Desmaures", region: "Capitale-Nationale",
    description: "Données de marché pour Saint-Augustin-de-Desmaures. Unifamiliale médiane à 570 000 $, marché vendeur avec +13% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Saint-Augustin-de-Desmaures en 2026?", r: "L'unifamiliale médiane est à 570 000 $ et le condo médian à 265 000 $. Saint-Augustin-de-Desmaures connaît une hausse de +13% et un marché vendeur avec des délais de vente de 33 jours." },
    ],
  },
  stoneham: {
    slug: "stoneham", nom: "Stoneham", region: "Capitale-Nationale",
    description: "Données de marché pour Stoneham. Unifamiliale médiane à 415 000 $, marché vendeur avec +11% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Stoneham en 2026?", r: "L'unifamiliale médiane est à 415 000 $ et le condo médian à 230 000 $. Stoneham connaît une hausse de +11% et un marché vendeur avec des délais de vente de 42 jours." },
    ],
  },
  // ── Chaudière-Appalaches ──
  montmagny: {
    slug: "montmagny", nom: "Montmagny", region: "Chaudière-Appalaches",
    description: "Données de marché pour Montmagny. Unifamiliale médiane à 285 000 $, marché équilibré avec +8,5% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Montmagny en 2026?", r: "L'unifamiliale médiane est à 285 000 $ et le condo médian à 175 000 $. Montmagny connaît une hausse de +8,5% et un marché équilibré avec des délais de vente de 62 jours." },
    ],
  },
  "saint-georges": {
    slug: "saint-georges", nom: "Saint-Georges", region: "Chaudière-Appalaches",
    description: "Données de marché pour Saint-Georges. Unifamiliale médiane à 355 000 $, marché vendeur avec +10% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Saint-Georges en 2026?", r: "L'unifamiliale médiane est à 355 000 $ et le condo médian à 215 000 $. Saint-Georges connaît une hausse de +10% et un marché vendeur avec des délais de vente de 52 jours." },
    ],
  },
  "sainte-marie": {
    slug: "sainte-marie", nom: "Sainte-Marie", region: "Chaudière-Appalaches",
    description: "Données de marché pour Sainte-Marie. Unifamiliale médiane à 365 000 $, marché vendeur avec +9,5% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Sainte-Marie en 2026?", r: "L'unifamiliale médiane est à 365 000 $ et le condo médian à 220 000 $. Sainte-Marie connaît une hausse de +9,5% et un marché vendeur avec des délais de vente de 52 jours." },
    ],
  },
  "thetford-mines": {
    slug: "thetford-mines", nom: "Thetford Mines", region: "Chaudière-Appalaches",
    description: "Données de marché pour Thetford Mines. Unifamiliale médiane à 270 000 $, marché équilibré avec +7,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Thetford Mines en 2026?", r: "L'unifamiliale médiane est à 270 000 $ et le condo médian à 160 000 $. Thetford Mines connaît une hausse de +7,0% et un marché équilibré avec des délais de vente de 65 jours." },
    ],
  },
  // ── Estrie ──
  coaticook: {
    slug: "coaticook", nom: "Coaticook", region: "Estrie",
    description: "Données de marché pour Coaticook. Unifamiliale médiane à 320 000 $, marché équilibré avec +7,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Coaticook en 2026?", r: "L'unifamiliale médiane est à 320 000 $ et le condo médian à 195 000 $. Coaticook connaît une hausse de +7,0% et un marché équilibré avec des délais de vente de 68 jours." },
    ],
  },
  "lac-megantic": {
    slug: "lac-megantic", nom: "Lac-Mégantic", region: "Estrie",
    description: "Données de marché pour Lac-Mégantic. Unifamiliale médiane à 285 000 $, marché équilibré avec +7,5% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Lac-Mégantic en 2026?", r: "L'unifamiliale médiane est à 285 000 $ et le condo médian à 175 000 $. Lac-Mégantic connaît une hausse de +7,5% et un marché équilibré avec des délais de vente de 72 jours." },
    ],
  },
  magog: {
    slug: "magog", nom: "Magog", region: "Estrie",
    description: "Données de marché pour Magog. Unifamiliale médiane à 430 000 $, marché vendeur avec +8,5% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Magog en 2026?", r: "L'unifamiliale médiane est à 430 000 $ et le condo médian à 315 000 $. Magog connaît une hausse de +8,5% et un marché vendeur avec des délais de vente de 55 jours." },
    ],
  },
  // ── Outaouais ──
  chelsea: {
    slug: "chelsea", nom: "Chelsea", region: "Outaouais",
    description: "Données de marché pour Chelsea. Unifamiliale médiane à 825 000 $, marché équilibré avec +2,5% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Chelsea en 2026?", r: "L'unifamiliale médiane est à 825 000 $ et le condo médian à 430 000 $. Chelsea connaît une hausse de +2,5% et un marché équilibré avec des délais de vente de 52 jours." },
    ],
  },
  // ── Mauricie ──
  "la-tuque": {
    slug: "la-tuque", nom: "La Tuque", region: "Mauricie",
    description: "Données de marché pour La Tuque. Unifamiliale médiane à 215 000 $, marché équilibré avec +7,5% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à La Tuque en 2026?", r: "L'unifamiliale médiane est à 215 000 $. La Tuque connaît une hausse de +7,5% et un marché équilibré avec des délais de vente de 75 jours." },
    ],
  },
  louiseville: {
    slug: "louiseville", nom: "Louiseville", region: "Mauricie",
    description: "Données de marché pour Louiseville. Unifamiliale médiane à 310 000 $, marché équilibré avec +8,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Louiseville en 2026?", r: "L'unifamiliale médiane est à 310 000 $ et le condo médian à 185 000 $. Louiseville connaît une hausse de +8,0% et un marché équilibré avec des délais de vente de 65 jours." },
    ],
  },
  shawinigan: {
    slug: "shawinigan", nom: "Shawinigan", region: "Mauricie",
    description: "Données de marché pour Shawinigan. Unifamiliale médiane à 320 000 $, marché vendeur avec +8,2% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Shawinigan en 2026?", r: "L'unifamiliale médiane est à 320 000 $ et le condo médian à 195 000 $. Shawinigan connaît une hausse de +8,2% et un marché vendeur avec des délais de vente de 52 jours." },
    ],
  },
  // ── Saguenay-Lac-Saint-Jean ──
  alma: {
    slug: "alma", nom: "Alma", region: "Saguenay-Lac-Saint-Jean",
    description: "Données de marché pour Alma. Unifamiliale médiane à 315 000 $, marché vendeur avec +7,5% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Alma en 2026?", r: "L'unifamiliale médiane est à 315 000 $ et le condo médian à 185 000 $. Alma connaît une hausse de +7,5% et un marché vendeur avec des délais de vente de 58 jours." },
    ],
  },
  "dolbeau-mistassini": {
    slug: "dolbeau-mistassini", nom: "Dolbeau-Mistassini", region: "Saguenay-Lac-Saint-Jean",
    description: "Données de marché pour Dolbeau-Mistassini. Unifamiliale médiane à 245 000 $, marché équilibré avec +8,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Dolbeau-Mistassini en 2026?", r: "L'unifamiliale médiane est à 245 000 $. Dolbeau-Mistassini connaît une hausse de +8,0% et un marché équilibré avec des délais de vente de 72 jours." },
    ],
  },
  roberval: {
    slug: "roberval", nom: "Roberval", region: "Saguenay-Lac-Saint-Jean",
    description: "Données de marché pour Roberval. Unifamiliale médiane à 225 000 $, marché équilibré avec +8,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Roberval en 2026?", r: "L'unifamiliale médiane est à 225 000 $. Roberval connaît une hausse de +8,0% et un marché équilibré avec des délais de vente de 75 jours." },
    ],
  },
  // ── Lanaudière ──
  joliette: {
    slug: "joliette", nom: "Joliette", region: "Lanaudière",
    description: "Données de marché pour Joliette. Unifamiliale médiane à 510 000 $, marché vendeur avec +8,5% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Joliette en 2026?", r: "L'unifamiliale médiane est à 510 000 $ et le condo médian à 305 000 $. Joliette connaît une hausse de +8,5% et un marché vendeur avec des délais de vente de 52 jours." },
    ],
  },
  rawdon: {
    slug: "rawdon", nom: "Rawdon", region: "Lanaudière",
    description: "Données de marché pour Rawdon. Unifamiliale médiane à 430 000 $, marché vendeur avec +9,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Rawdon en 2026?", r: "L'unifamiliale médiane est à 430 000 $ et le condo médian à 275 000 $. Rawdon connaît une hausse de +9,0% et un marché vendeur avec des délais de vente de 60 jours." },
    ],
  },
  "saint-lin-laurentides": {
    slug: "saint-lin-laurentides", nom: "Saint-Lin-Laurentides", region: "Lanaudière",
    description: "Données de marché pour Saint-Lin-Laurentides. Unifamiliale médiane à 515 000 $, marché vendeur avec +8,5% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Saint-Lin-Laurentides en 2026?", r: "L'unifamiliale médiane est à 515 000 $ et le condo médian à 330 000 $. Saint-Lin-Laurentides connaît une hausse de +8,5% et un marché vendeur avec des délais de vente de 50 jours." },
    ],
  },
  // ── Laurentides ──
  lachute: {
    slug: "lachute", nom: "Lachute", region: "Laurentides",
    description: "Données de marché pour Lachute. Unifamiliale médiane à 380 000 $, marché équilibré avec +5,5% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Lachute en 2026?", r: "L'unifamiliale médiane est à 380 000 $ et le condo médian à 245 000 $. Lachute connaît une hausse de +5,5% et un marché équilibré avec des délais de vente de 65 jours." },
    ],
  },
  "mont-laurier": {
    slug: "mont-laurier", nom: "Mont-Laurier", region: "Laurentides",
    description: "Données de marché pour Mont-Laurier. Unifamiliale médiane à 355 000 $, marché équilibré avec +7,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Mont-Laurier en 2026?", r: "L'unifamiliale médiane est à 355 000 $ et le condo médian à 225 000 $. Mont-Laurier connaît une hausse de +7,0% et un marché équilibré avec des délais de vente de 68 jours." },
    ],
  },
  "mont-tremblant": {
    slug: "mont-tremblant", nom: "Mont-Tremblant", region: "Laurentides",
    description: "Données de marché pour Mont-Tremblant. Unifamiliale médiane à 435 000 $, marché équilibré avec +6,5% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Mont-Tremblant en 2026?", r: "L'unifamiliale médiane est à 435 000 $ et le condo médian à 320 000 $. Mont-Tremblant connaît une hausse de +6,5% et un marché équilibré avec des délais de vente de 65 jours." },
    ],
  },
  prevost: {
    slug: "prevost", nom: "Prévost", region: "Laurentides",
    description: "Données de marché pour Prévost. Unifamiliale médiane à 515 000 $, marché vendeur avec +8,2% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Prévost en 2026?", r: "L'unifamiliale médiane est à 515 000 $ et le condo médian à 325 000 $. Prévost connaît une hausse de +8,2% et un marché vendeur avec des délais de vente de 56 jours." },
    ],
  },
  "saint-sauveur": {
    slug: "saint-sauveur", nom: "Saint-Sauveur", region: "Laurentides",
    description: "Données de marché pour Saint-Sauveur. Unifamiliale médiane à 635 000 $, marché vendeur avec +8,5% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Saint-Sauveur en 2026?", r: "L'unifamiliale médiane est à 635 000 $ et le condo médian à 390 000 $. Saint-Sauveur connaît une hausse de +8,5% et un marché vendeur avec des délais de vente de 58 jours." },
    ],
  },
  "sainte-adele": {
    slug: "sainte-adele", nom: "Sainte-Adèle", region: "Laurentides",
    description: "Données de marché pour Sainte-Adèle. Unifamiliale médiane à 570 000 $, marché vendeur avec +8,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Sainte-Adèle en 2026?", r: "L'unifamiliale médiane est à 570 000 $ et le condo médian à 345 000 $. Sainte-Adèle connaît une hausse de +8,0% et un marché vendeur avec des délais de vente de 60 jours." },
    ],
  },
  "sainte-agathe-des-monts": {
    slug: "sainte-agathe-des-monts", nom: "Sainte-Agathe-des-Monts", region: "Laurentides",
    description: "Données de marché pour Sainte-Agathe-des-Monts. Unifamiliale médiane à 510 000 $, marché vendeur avec +8,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Sainte-Agathe-des-Monts en 2026?", r: "L'unifamiliale médiane est à 510 000 $ et le condo médian à 320 000 $. Sainte-Agathe-des-Monts connaît une hausse de +8,0% et un marché vendeur avec des délais de vente de 62 jours." },
    ],
  },
  // ── Montérégie ──
  cowansville: {
    slug: "cowansville", nom: "Cowansville", region: "Montérégie",
    description: "Données de marché pour Cowansville. Unifamiliale médiane à 465 000 $, marché vendeur avec +8,5% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Cowansville en 2026?", r: "L'unifamiliale médiane est à 465 000 $ et le condo médian à 285 000 $. Cowansville connaît une hausse de +8,5% et un marché vendeur avec des délais de vente de 52 jours." },
    ],
  },
  granby: {
    slug: "granby", nom: "Granby", region: "Montérégie",
    description: "Données de marché pour Granby. Unifamiliale médiane à 530 000 $, marché vendeur avec +8,2% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Granby en 2026?", r: "L'unifamiliale médiane est à 530 000 $ et le condo médian à 320 000 $. Granby connaît une hausse de +8,2% et un marché vendeur avec des délais de vente de 50 jours." },
    ],
  },
  "saint-jean-sur-richelieu": {
    slug: "saint-jean-sur-richelieu", nom: "Saint-Jean-sur-Richelieu", region: "Montérégie",
    description: "Données de marché pour Saint-Jean-sur-Richelieu. Unifamiliale médiane à 580 000 $, marché vendeur avec +7,5% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Saint-Jean-sur-Richelieu en 2026?", r: "L'unifamiliale médiane est à 580 000 $ et le condo médian à 355 000 $. Saint-Jean-sur-Richelieu connaît une hausse de +7,5% et un marché vendeur avec des délais de vente de 47 jours." },
    ],
  },
  "salaberry-de-valleyfield": {
    slug: "salaberry-de-valleyfield", nom: "Salaberry-de-Valleyfield", region: "Montérégie",
    description: "Données de marché pour Salaberry-de-Valleyfield. Unifamiliale médiane à 490 000 $, marché vendeur avec +8,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Salaberry-de-Valleyfield en 2026?", r: "L'unifamiliale médiane est à 490 000 $ et le condo médian à 295 000 $. Salaberry-de-Valleyfield connaît une hausse de +8,0% et un marché vendeur avec des délais de vente de 54 jours." },
    ],
  },
  "sorel-tracy": {
    slug: "sorel-tracy", nom: "Sorel-Tracy", region: "Montérégie",
    description: "Données de marché pour Sorel-Tracy. Unifamiliale médiane à 400 000 $, marché équilibré avec +8,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Sorel-Tracy en 2026?", r: "L'unifamiliale médiane est à 400 000 $ et le condo médian à 240 000 $. Sorel-Tracy connaît une hausse de +8,0% et un marché équilibré avec des délais de vente de 58 jours." },
    ],
  },
  // ── Centre-du-Québec ──
  becancour: {
    slug: "becancour", nom: "Bécancour", region: "Centre-du-Québec",
    description: "Données de marché pour Bécancour. Unifamiliale médiane à 320 000 $, marché vendeur avec +9,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Bécancour en 2026?", r: "L'unifamiliale médiane est à 320 000 $ et le condo médian à 190 000 $. Bécancour connaît une hausse de +9,0% et un marché vendeur avec des délais de vente de 58 jours." },
    ],
  },
  plessisville: {
    slug: "plessisville", nom: "Plessisville", region: "Centre-du-Québec",
    description: "Données de marché pour Plessisville. Unifamiliale médiane à 270 000 $, marché équilibré avec +8,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Plessisville en 2026?", r: "L'unifamiliale médiane est à 270 000 $ et le condo médian à 165 000 $. Plessisville connaît une hausse de +8,0% et un marché équilibré avec des délais de vente de 65 jours." },
    ],
  },
  victoriaville: {
    slug: "victoriaville", nom: "Victoriaville", region: "Centre-du-Québec",
    description: "Données de marché pour Victoriaville. Unifamiliale médiane à 362 000 $, marché vendeur avec +8,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Victoriaville en 2026?", r: "L'unifamiliale médiane est à 362 000 $ et le condo médian à 220 000 $. Victoriaville connaît une hausse de +8,0% et un marché vendeur avec des délais de vente de 55 jours." },
    ],
  },
  // ── Bas-Saint-Laurent ──
  amqui: {
    slug: "amqui", nom: "Amqui", region: "Bas-Saint-Laurent",
    description: "Données de marché pour Amqui. Unifamiliale médiane à 230 000 $, marché équilibré avec +7,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Amqui en 2026?", r: "L'unifamiliale médiane est à 230 000 $. Amqui connaît une hausse de +7,0% et un marché équilibré avec des délais de vente de 78 jours." },
    ],
  },
  matane: {
    slug: "matane", nom: "Matane", region: "Bas-Saint-Laurent",
    description: "Données de marché pour Matane. Unifamiliale médiane à 260 000 $, marché équilibré avec +8,3% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Matane en 2026?", r: "L'unifamiliale médiane est à 260 000 $ et le condo médian à 155 000 $. Matane connaît une hausse de +8,3% et un marché équilibré avec des délais de vente de 72 jours." },
    ],
  },
  "riviere-du-loup": {
    slug: "riviere-du-loup", nom: "Rivière-du-Loup", region: "Bas-Saint-Laurent",
    description: "Données de marché pour Rivière-du-Loup. Unifamiliale médiane à 378 000 $, marché vendeur avec +8,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Rivière-du-Loup en 2026?", r: "L'unifamiliale médiane est à 378 000 $ et le condo médian à 230 000 $. Rivière-du-Loup connaît une hausse de +8,0% et un marché vendeur avec des délais de vente de 58 jours." },
    ],
  },
  // ── Gaspésie ──
  "carleton-sur-mer": {
    slug: "carleton-sur-mer", nom: "Carleton-sur-Mer", region: "Gaspésie",
    description: "Données de marché pour Carleton-sur-Mer. Unifamiliale médiane à 305 000 $, marché équilibré avec +9,5% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Carleton-sur-Mer en 2026?", r: "L'unifamiliale médiane est à 305 000 $. Carleton-sur-Mer connaît une hausse de +9,5% et un marché équilibré avec des délais de vente de 75 jours." },
    ],
  },
  gaspe: {
    slug: "gaspe", nom: "Gaspé", region: "Gaspésie",
    description: "Données de marché pour Gaspé. Unifamiliale médiane à 265 000 $, marché équilibré avec +10% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Gaspé en 2026?", r: "L'unifamiliale médiane est à 265 000 $. Gaspé connaît une hausse de +10% et un marché équilibré avec des délais de vente de 78 jours." },
    ],
  },
  "new-richmond": {
    slug: "new-richmond", nom: "New Richmond", region: "Gaspésie",
    description: "Données de marché pour New Richmond. Unifamiliale médiane à 225 000 $, marché équilibré avec +9,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à New Richmond en 2026?", r: "L'unifamiliale médiane est à 225 000 $. New Richmond connaît une hausse de +9,0% et un marché équilibré avec des délais de vente de 82 jours." },
    ],
  },
  perce: {
    slug: "perce", nom: "Percé", region: "Gaspésie",
    description: "Données de marché pour Percé. Unifamiliale médiane à 245 000 $, marché équilibré avec +10% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Percé en 2026?", r: "L'unifamiliale médiane est à 245 000 $. Percé connaît une hausse de +10% et un marché équilibré avec des délais de vente de 85 jours." },
    ],
  },
  // ── Côte-Nord ──
  "baie-comeau": {
    slug: "baie-comeau", nom: "Baie-Comeau", region: "Côte-Nord",
    description: "Données de marché pour Baie-Comeau. Unifamiliale médiane à 270 000 $, marché équilibré avec +8,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Baie-Comeau en 2026?", r: "L'unifamiliale médiane est à 270 000 $ et le condo médian à 155 000 $. Baie-Comeau connaît une hausse de +8,0% et un marché équilibré avec des délais de vente de 68 jours." },
    ],
  },
  "havre-saint-pierre": {
    slug: "havre-saint-pierre", nom: "Havre-Saint-Pierre", region: "Côte-Nord",
    description: "Données de marché pour Havre-Saint-Pierre. Unifamiliale médiane à 230 000 $, marché équilibré avec +7,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Havre-Saint-Pierre en 2026?", r: "L'unifamiliale médiane est à 230 000 $. Havre-Saint-Pierre connaît une hausse de +7,0% et un marché équilibré avec des délais de vente de 85 jours." },
    ],
  },
  "sept-iles": {
    slug: "sept-iles", nom: "Sept-Îles", region: "Côte-Nord",
    description: "Données de marché pour Sept-Îles. Unifamiliale médiane à 315 000 $, marché équilibré avec +7,8% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Sept-Îles en 2026?", r: "L'unifamiliale médiane est à 315 000 $ et le condo médian à 175 000 $. Sept-Îles connaît une hausse de +7,8% et un marché équilibré avec des délais de vente de 62 jours." },
    ],
  },
  // ── Abitibi-Témiscamingue ──
  amos: {
    slug: "amos", nom: "Amos", region: "Abitibi-Témiscamingue",
    description: "Données de marché pour Amos. Unifamiliale médiane à 340 000 $, marché vendeur avec +8,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Amos en 2026?", r: "L'unifamiliale médiane est à 340 000 $ et le condo médian à 195 000 $. Amos connaît une hausse de +8,0% et un marché vendeur avec des délais de vente de 62 jours." },
    ],
  },
  "la-sarre": {
    slug: "la-sarre", nom: "La Sarre", region: "Abitibi-Témiscamingue",
    description: "Données de marché pour La Sarre. Unifamiliale médiane à 275 000 $, marché équilibré avec +7,5% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à La Sarre en 2026?", r: "L'unifamiliale médiane est à 275 000 $ et le condo médian à 165 000 $. La Sarre connaît une hausse de +7,5% et un marché équilibré avec des délais de vente de 68 jours." },
    ],
  },
  "rouyn-noranda": {
    slug: "rouyn-noranda", nom: "Rouyn-Noranda", region: "Abitibi-Témiscamingue",
    description: "Données de marché pour Rouyn-Noranda. Unifamiliale médiane à 362 000 $, marché vendeur avec +8,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Rouyn-Noranda en 2026?", r: "L'unifamiliale médiane est à 362 000 $ et le condo médian à 215 000 $. Rouyn-Noranda connaît une hausse de +8,0% et un marché vendeur avec des délais de vente de 56 jours." },
    ],
  },
  "val-d-or": {
    slug: "val-d-or", nom: "Val-d'Or", region: "Abitibi-Témiscamingue",
    description: "Données de marché pour Val-d'Or. Unifamiliale médiane à 420 000 $, marché vendeur avec +7,7% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Val-d'Or en 2026?", r: "L'unifamiliale médiane est à 420 000 $ et le condo médian à 245 000 $. Val-d'Or connaît une hausse de +7,7% et un marché vendeur avec des délais de vente de 58 jours." },
    ],
  },
  // ── Nord-du-Québec ──
  chibougamau: {
    slug: "chibougamau", nom: "Chibougamau", region: "Nord-du-Québec",
    description: "Données de marché pour Chibougamau. Unifamiliale médiane à 210 000 $, marché équilibré avec +6,0% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison à Chibougamau en 2026?", r: "L'unifamiliale médiane est à 210 000 $. Chibougamau connaît une hausse de +6,0% et un marché équilibré avec des délais de vente de 85 jours." },
    ],
  },
  // ── Îles-de-la-Madeleine ──
  "iles-de-la-madeleine": {
    slug: "iles-de-la-madeleine", nom: "Îles-de-la-Madeleine", region: "Îles-de-la-Madeleine",
    description: "Données de marché pour les Îles-de-la-Madeleine. Unifamiliale médiane à 320 000 $, marché équilibré avec +10% de hausse.",
    faq: [
      { q: "Quel est le prix médian d'une maison aux Îles-de-la-Madeleine en 2026?", r: "L'unifamiliale médiane est à 320 000 $. Les Îles-de-la-Madeleine connaissent une hausse de +10% et un marché équilibré avec des délais de vente de 85 jours." },
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
