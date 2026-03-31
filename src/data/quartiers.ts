export type QuartierData = {
  nom: string;
  ville: string;
  region: string;
  uniMedian: string;
  condoMedian: string;
  plexMedian: string;
  tendanceUni: string;
  tendanceCondo: string;
  tendancePlex: string;
  delaiVente: string;
  marcheType: string;
  prixPiedCarre: string;
  croissance5ans: string;
  description: string[];
  tags: string[];
  historiquePrix: { annee: string; valeur: number }[];
};

export const quartiersData: Record<string, QuartierData> = {
  "rosemont": {
    nom: "Rosemont-La Petite-Patrie",
    ville: "Montréal",
    region: "Île de Montréal",
    uniMedian: "825 000 $",
    condoMedian: "425 000 $",
    plexMedian: "1 185 000 $",
    tendanceUni: "+5,9%",
    tendanceCondo: "+4,8%",
    tendancePlex: "+6,2%",
    delaiVente: "52 jours",
    marcheType: "vendeur",
    prixPiedCarre: "~580 $",
    croissance5ans: "+33%",
    description: [
      "Rosemont-La Petite-Patrie est l'un des arrondissements les plus prisés de Montréal, reconnu pour son ambiance de village urbain, ses rues bordées d'arbres et son marché Jean-Talon. Le secteur attire autant les jeunes familles que les professionnels qui recherchent un cadre de vie agréable à proximité du centre-ville. Les propriétés de type plex et duplex y sont très recherchées, ce qui maintient une forte pression sur les prix.",
      "L'arrondissement est bien desservi par le métro (ligne orange : Beaubien, Rosemont, Laurier) et par un réseau cyclable parmi les meilleurs de Montréal. La vie de quartier y est dynamique avec de nombreux commerces locaux, restaurants et parcs. Le parc Maisonneuve et le Jardin botanique sont à quelques minutes.",
      "Pour les investisseurs, Rosemont offre un excellent marché locatif avec un taux d'inoccupation très bas. Les plex et duplex restent des placements solides avec des rendements stables. La croissance des prix sur 5 ans (+33%) confirme la solidité de ce marché.",
    ],
    tags: ["Plex et duplex", "Famille", "Vélo-friendly", "Marché Jean-Talon", "Métro orange", "Locatif fort"],
    historiquePrix: [
      { annee: "2021", valeur: 620000 },
      { annee: "2022", valeur: 760000 },
      { annee: "2023", valeur: 740000 },
      { annee: "2024", valeur: 780000 },
      { annee: "2025", valeur: 779000 },
      { annee: "2026", valeur: 825000 },
    ],
  },

  "plateau-mont-royal": {
    nom: "Le Plateau-Mont-Royal",
    ville: "Montréal",
    region: "Île de Montréal",
    uniMedian: "985 000 $",
    condoMedian: "495 000 $",
    plexMedian: "1 425 000 $",
    tendanceUni: "+4,2%",
    tendanceCondo: "+3,5%",
    tendancePlex: "+4,8%",
    delaiVente: "55 jours",
    marcheType: "equilibre",
    prixPiedCarre: "~650 $",
    croissance5ans: "+28%",
    description: [
      "Le Plateau-Mont-Royal est le quartier emblématique de Montréal, célèbre pour ses triplex colorés, ses terrasses animées et sa vie culturelle foisonnante. L'avenue du Mont-Royal, la rue Saint-Denis et le boulevard Saint-Laurent concentrent une offre commerciale et gastronomique parmi les plus riches de la ville. C'est un secteur où la demande reste constante malgré des prix élevés.",
      "Le marché immobilier du Plateau est dominé par les plex et les condos. Les unifamiliales y sont rares et se négocient à prix fort. Le marché est équilibré : les acheteurs ont un peu plus de marge de négociation que dans les quartiers en marché vendeur, mais les biens de qualité partent rapidement.",
      "Le quartier est particulièrement recherché par les jeunes professionnels, les artistes et les couples sans enfants. L'accès au parc du Mont-Royal, la proximité du centre-ville et l'ambiance unique du Plateau en font un investissement sûr pour le long terme.",
    ],
    tags: ["Triplex colorés", "Vie culturelle", "Terrasses", "Parc Mont-Royal", "Métro orange", "Jeunes professionnels"],
    historiquePrix: [
      { annee: "2021", valeur: 770000 },
      { annee: "2022", valeur: 920000 },
      { annee: "2023", valeur: 905000 },
      { annee: "2024", valeur: 940000 },
      { annee: "2025", valeur: 945000 },
      { annee: "2026", valeur: 985000 },
    ],
  },

  "villeray": {
    nom: "Villeray-Saint-Michel-Parc-Extension",
    ville: "Montréal",
    region: "Île de Montréal",
    uniMedian: "645 000 $",
    condoMedian: "345 000 $",
    plexMedian: "925 000 $",
    tendanceUni: "+7,3%",
    tendanceCondo: "+6,1%",
    tendancePlex: "+7,8%",
    delaiVente: "48 jours",
    marcheType: "vendeur",
    prixPiedCarre: "~470 $",
    croissance5ans: "+42%",
    description: [
      "Villeray est un quartier en pleine transformation qui attire de plus en plus de jeunes familles et de premiers acheteurs. Ses prix, encore accessibles par rapport au Plateau ou à Rosemont, en font l'un des secteurs les plus dynamiques de Montréal. La rue Jarry et la rue Villeray offrent une belle diversité de commerces de proximité.",
      "Le quartier bénéficie d'un excellent accès au transport en commun avec le métro (ligne orange : Jarry, Crémazie, Parc) et de nombreuses lignes d'autobus. Le marché des plex y est particulièrement actif, avec des duplex et triplex qui représentent une part importante du parc immobilier.",
      "La croissance des prix sur 5 ans (+42%) est l'une des plus fortes de Montréal, ce qui reflète l'engouement des acheteurs pour ce secteur encore abordable. Le marché est clairement vendeur, avec des délais de vente rapides (48 jours).",
    ],
    tags: ["Abordable", "Premiers acheteurs", "Plex", "Métro orange", "En transformation", "Multiculturel"],
    historiquePrix: [
      { annee: "2021", valeur: 455000 },
      { annee: "2022", valeur: 565000 },
      { annee: "2023", valeur: 560000 },
      { annee: "2024", valeur: 595000 },
      { annee: "2025", valeur: 601000 },
      { annee: "2026", valeur: 645000 },
    ],
  },

  "hochelaga": {
    nom: "Hochelaga-Maisonneuve",
    ville: "Montréal",
    region: "Île de Montréal",
    uniMedian: "565 000 $",
    condoMedian: "325 000 $",
    plexMedian: "825 000 $",
    tendanceUni: "+9,2%",
    tendanceCondo: "+7,5%",
    tendancePlex: "+9,8%",
    delaiVente: "50 jours",
    marcheType: "vendeur",
    prixPiedCarre: "~420 $",
    croissance5ans: "+51%",
    description: [
      "Hochelaga-Maisonneuve, souvent appelé HoMa, est le quartier qui connait la plus forte hausse de prix à Montréal en 2026 (+9,2%). Longtemps considéré comme un secteur populaire, HoMa se transforme rapidement avec l'arrivée de nouveaux commerces, de microbrasseries et de projets immobiliers. Le marché Maisonneuve et la Promenade Ontario sont au coeur de cette revitalisation.",
      "Le secteur reste l'un des plus abordables de l'île de Montréal, ce qui attire les premiers acheteurs et les investisseurs en quête de rendement locatif. Les plex y sont nombreux et représentent une excellente occasion d'investissement avec des prix encore sous la barre du million.",
      "La proximité du Stade olympique, du Biodôme et du parc Maisonneuve ajoute à l'attrait du quartier. Le métro (ligne verte : Pie-IX, Viau, l'Assomption) offre un bon accès au centre-ville. Les acheteurs doivent agir rapidement car le marché est fortement vendeur.",
    ],
    tags: ["Plus forte hausse", "Abordable", "Investissement", "Plex", "Métro verte", "En revitalisation"],
    historiquePrix: [
      { annee: "2021", valeur: 375000 },
      { annee: "2022", valeur: 470000 },
      { annee: "2023", valeur: 465000 },
      { annee: "2024", valeur: 500000 },
      { annee: "2025", valeur: 518000 },
      { annee: "2026", valeur: 565000 },
    ],
  },

  "verdun": {
    nom: "Verdun",
    ville: "Montréal",
    region: "Île de Montréal",
    uniMedian: "625 000 $",
    condoMedian: "365 000 $",
    plexMedian: "895 000 $",
    tendanceUni: "+7,8%",
    tendanceCondo: "+6,5%",
    tendancePlex: "+8,2%",
    delaiVente: "46 jours",
    marcheType: "vendeur",
    prixPiedCarre: "~490 $",
    croissance5ans: "+45%",
    description: [
      "Verdun est devenu l'un des quartiers les plus recherchés de Montréal au cours des dernières années. La revitalisation de la rue Wellington, l'aménagement des berges du fleuve Saint-Laurent et l'arrivée du REM (station Du Canal) ont propulsé la demande. Les jeunes familles et les professionnels y apprécient le rapport qualité-prix et la proximité du centre-ville.",
      "Le marché immobilier de Verdun est fortement vendeur avec des délais de vente parmi les plus courts de Montréal (46 jours). Les plex et duplex sont très prisés, et les nouveaux projets de condos attirent une clientèle variée. La promenade des berges et la plage urbaine ajoutent à l'attrait du secteur.",
      "Pour les investisseurs, Verdun offre un potentiel locatif solide grâce à la demande constante. La croissance de +45% sur 5 ans témoigne de la transformation du quartier, qui n'a pas encore atteint son plein potentiel selon les analystes du marché.",
    ],
    tags: ["Berges du fleuve", "REM", "Rue Wellington", "Famille", "Plex", "Fort potentiel"],
    historiquePrix: [
      { annee: "2021", valeur: 430000 },
      { annee: "2022", valeur: 540000 },
      { annee: "2023", valeur: 530000 },
      { annee: "2024", valeur: 565000 },
      { annee: "2025", valeur: 580000 },
      { annee: "2026", valeur: 625000 },
    ],
  },

  "mile-end": {
    nom: "Mile End",
    ville: "Montréal",
    region: "Île de Montréal",
    uniMedian: "925 000 $",
    condoMedian: "475 000 $",
    plexMedian: "1 350 000 $",
    tendanceUni: "+5,1%",
    tendanceCondo: "+4,2%",
    tendancePlex: "+5,5%",
    delaiVente: "54 jours",
    marcheType: "equilibre",
    prixPiedCarre: "~620 $",
    croissance5ans: "+30%",
    description: [
      "Le Mile End est un micro-quartier mythique de Montréal, berceau de la scène musicale indépendante et du milieu technologique. Situé entre le Plateau et Outremont, il est connu pour ses studios d'artistes, ses cafés branchés et ses entreprises techno (Ubisoft, studios de jeux vidéo). Le boulevard Saint-Laurent et l'avenue du Parc en sont les artères principales.",
      "Le marché immobilier du Mile End est équilibré mais les prix restent élevés en raison de la forte demande. Les plex et les lofts reconvertis sont les types de propriétés les plus recherchés. L'inventaire est limité, ce qui soutient les prix malgré un rythme de vente modéré.",
      "Le quartier est idéal pour les acheteurs qui recherchent un style de vie urbain et créatif. La proximité du parc du Mont-Royal, du marché Jean-Talon et des universités (UdeM, McGill) en fait un emplacement de choix. La croissance de +30% sur 5 ans confirme la stabilité de ce marché premium.",
    ],
    tags: ["Créatif et techno", "Lofts", "Cafés", "Parc Mont-Royal", "Métro bleue", "Vie urbaine"],
    historiquePrix: [
      { annee: "2021", valeur: 710000 },
      { annee: "2022", valeur: 855000 },
      { annee: "2023", valeur: 845000 },
      { annee: "2024", valeur: 875000 },
      { annee: "2025", valeur: 880000 },
      { annee: "2026", valeur: 925000 },
    ],
  },
};
