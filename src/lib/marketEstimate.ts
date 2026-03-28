/**
 * Market estimate lookup — maps quartierSlug + property type to median price.
 * Data derived from DonneesMarche.tsx market data.
 *
 * Types mapped from listing types to market data categories:
 *   unifamiliale → uni
 *   condo → condo
 *   duplex, triplex, quadruplex, 5plex → plex
 */

// quartierSlug → { uni, condo, plex } median prices in dollars
const MARKET_PRICES: Record<string, { uni: number | null; condo: number | null; plex: number | null }> = {
  // Montreal
  "plateau-mont-royal": { uni: 985000, condo: 495000, plex: 1425000 },
  "rosemont": { uni: 825000, condo: 425000, plex: 1185000 },
  "villeray": { uni: 645000, condo: 345000, plex: 925000 },
  "griffintown": { uni: 695000, condo: 395000, plex: 985000 },
  "saint-henri": { uni: 695000, condo: 395000, plex: 985000 },
  "hochelaga": { uni: 565000, condo: 325000, plex: 825000 },
  "cote-des-neiges": { uni: 795000, condo: 425000, plex: 1125000 },
  "notre-dame-de-grace": { uni: 795000, condo: 425000, plex: 1125000 },
  "outremont": { uni: 1485000, condo: 625000, plex: 2125000 },
  "vieux-montreal": { uni: null, condo: 525000, plex: null },
  "verdun": { uni: 625000, condo: 365000, plex: 895000 },
  "mile-end": { uni: 925000, condo: 475000, plex: 1350000 },
  "petite-bourgogne": { uni: 675000, condo: 385000, plex: 965000 },
  "pointe-saint-charles": { uni: 595000, condo: 345000, plex: 855000 },
  "saint-laurent": { uni: 685000, condo: 365000, plex: 925000 },
  "montreal-nord": { uni: 425000, condo: 265000, plex: 625000 },
  "anjou": { uni: 485000, condo: 295000, plex: 695000 },
  "saint-leonard": { uni: 525000, condo: 315000, plex: 745000 },
  "lasalle": { uni: 545000, condo: 325000, plex: 795000 },
  "lachine": { uni: 525000, condo: 315000, plex: 765000 },
  "riviere-des-prairies": { uni: 465000, condo: 285000, plex: 685000 },
  "dollard-des-ormeaux": { uni: 595000, condo: 335000, plex: null },
  "mont-royal": { uni: 1250000, condo: 545000, plex: null },
  "westmount": { uni: 1650000, condo: 685000, plex: null },
  // Quebec
  "saint-sauveur-qc": { uni: 425000, condo: 195000, plex: null },
  "limoilou": { uni: 455000, condo: 205000, plex: null },
  "vieux-port-qc": { uni: null, condo: 265000, plex: null },
  "saint-roch": { uni: 475000, condo: 225000, plex: null },
  "haute-ville": { uni: 525000, condo: 245000, plex: null },
  "sainte-foy": { uni: 575000, condo: 255000, plex: null },
  "charlesbourg": { uni: 485000, condo: 215000, plex: null },
  "beauport": { uni: 495000, condo: 220000, plex: null },
  // Laval
  "chomedey": { uni: 575000, condo: 360000, plex: 835000 },
  "sainte-rose": { uni: 620000, condo: 390000, plex: null },
  "vimont": { uni: 565000, condo: 370000, plex: null },
  "auteuil": { uni: 555000, condo: 365000, plex: null },
  "duvernay": { uni: 545000, condo: 355000, plex: null },
  "fabreville": { uni: 560000, condo: 360000, plex: null },
  // Longueuil
  "vieux-longueuil": { uni: 525000, condo: 335000, plex: 775000 },
  "saint-hubert": { uni: 565000, condo: 355000, plex: null },
  "greenfield-park": { uni: 535000, condo: 340000, plex: null },
  "brossard": { uni: 625000, condo: 395000, plex: 895000 },
  // Sherbrooke
  "fleurimont": { uni: 455000, condo: 290000, plex: null },
  "jacques-cartier-shbk": { uni: 465000, condo: 300000, plex: null },
  "mont-bellevue": { uni: 475000, condo: 305000, plex: null },
  "rock-forest": { uni: 485000, condo: 310000, plex: null },
  // Gatineau
  "hull": { uni: 545000, condo: 295000, plex: null },
  "aylmer": { uni: 575000, condo: 305000, plex: null },
  "gatineau-secteur": { uni: 565000, condo: 300000, plex: null },
  "buckingham": { uni: 465000, condo: 265000, plex: null },
  // Standalone cities
  "trois-rivieres": { uni: 460000, condo: 270000, plex: null },
  "saguenay": { uni: 285000, condo: 165000, plex: 195000 },
  "levis": { uni: 495000, condo: 225000, plex: null },
  "terrebonne": { uni: 495000, condo: 325000, plex: null },
  "rimouski": { uni: 295000, condo: 185000, plex: null },
  "drummondville": { uni: 365000, condo: 240000, plex: null },
};

// Map listing type to market data key
function typeToMarketKey(type: string): "uni" | "condo" | "plex" | null {
  switch (type) {
    case "unifamiliale":
    case "maison_de_ville":
      return "uni";
    case "condo":
      return "condo";
    case "duplex":
    case "triplex":
    case "quadruplex":
    case "5plex":
      return "plex";
    default:
      return null;
  }
}

/**
 * Returns the median market price for a given quartier and property type.
 * Returns null if no data is available.
 */
export function getMarketEstimate(quartierSlug: string, type: string): number | null {
  const data = MARKET_PRICES[quartierSlug];
  if (!data) return null;

  const key = typeToMarketKey(type);
  if (!key) return null;

  return data[key];
}
