import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const PASS = bcrypt.hashSync("nidlocal2026", 10);

const USERS: { username: string; tag?: string }[] = [
  { username: "proprio_rosemont", tag: "proprietaire" },
  { username: "investisseur_plex", tag: "finance" },
  { username: "premier_achat_mtl" },
  { username: "locataire_plateau", tag: "locataire" },
  { username: "gestion_villeray", tag: "proprietaire" },
  { username: "triplex_hochelaga", tag: "proprietaire" },
  { username: "acheteur_banlieue", tag: "courtier" },
  { username: "condo_snowdon" },
  { username: "nouveau_proprio_rive_sud", tag: "proprietaire" },
  { username: "chercheur_duplex", tag: "courtier" },
  { username: "proprio_multilogement", tag: "proprietaire" },
  { username: "reno_plateau", tag: "entrepreneur" },
  { username: "flip_mtl", tag: "entrepreneur" },
  { username: "locatif_laurentides", tag: "locataire" },
  { username: "acheteur_anx", tag: "finance" },
];

const CAT: Record<string, string> = {
  Financement: "financement", "Gestion locative": "voisinage", Juridique: "legal",
  Travaux: "renovation", "Copropriété": "copropriete", Investissement: "financement", "Premier achat": "question",
};
const QS: Record<string, string> = {
  Hochelaga: "hochelaga", Villeray: "villeray", Rosemont: "rosemont",
  Snowdon: "cote-des-neiges", "Plateau-Mont-Royal": "plateau-mont-royal",
};

const POSTS: { author: string; cat: string; q: string | null; titre: string; contenu: string; votes: number; days: number; comments: { author: string; texte: string; votes: number }[] }[] = [
  { author:"premier_achat_mtl", cat:"Financement", q:null, titre:"Taxe de bienvenue déductible aux impots?", contenu:"Bonjour, j'ai acheter mon premier condo il y a 3 mois et j'ai payé environ 4 200 $ de taxe de bienvenue. Est-ce que ca se déduit quelque part dans ma déclaration de revenus? Mon comptable est pas certain.", votes:47, days:2, comments:[
    { author:"investisseur_plex", texte:"Non, la taxe de bienvenue est pas déductible si c'est ta résidence principale. Par contre, elle fait partie de ton coût d'acquisition — garde-la dans tes dossiers pour le calcul du gain en capital si tu revends un jour.", votes:31 },
    { author:"proprio_rosemont", texte:"Ce que dit investisseur_plex est exact. Pour une résidence principale, le gain en capital est exonéré de toute facon, donc ca change pas grand chose. Si c'est un immeuble locatif par contre, ca entre dans le prix de base rajusté (PBR) et ca peut réduire ton gain imposable à la revente.", votes:22 },
    { author:"premier_achat_mtl", texte:"Merci! C'est ma résidence principale donc je comprends que ca s'applique pas. Je vais quand meme garder tous mes documents pour la revente éventuelle.", votes:8 },
  ]},
  { author:"triplex_hochelaga", cat:"Gestion locative", q:"Hochelaga", titre:"Locataire qui part le 1er avril — bail jusqu'en juin", contenu:"Un de mes locataires m'a avisé qu'il quitte le 1er avril mais son bail est valide jusqu'au 30 juin. Il prétend qu'il peut partir n'importe quand s'il donne un mois de préavis. C'est tu vrai? Je pensais qu'au Québec le bail se terminait à la date prévue.", votes:89, days:0, comments:[
    { author:"proprio_multilogement", texte:"Non, c'est pas exact. Au Québec, le locataire est lié par la durée du bail. Il peut pas résilier unilatéralement sauf dans des cas précis (violence conjugale, admission en CHSLD, perte d'emploi dans certaines circonstances). Un préavis d'un mois suffit pas.", votes:54 },
    { author:"gestion_villeray", texte:"S'il part quand meme, tu peux lui réclamer les loyers impayés jusqu'à la fin du bail OU jusqu'à ce que tu reloues le logement (selon ce qui arrive en premier). Il peut aussi céder son bail a quelqu'un d'autre — tu peux pas refuser sans raison valable.", votes:38 },
    { author:"triplex_hochelaga", texte:"Il parle de cession de bail a son frère. Est-ce que je peux refuser?", votes:12 },
    { author:"proprio_multilogement", texte:"Tu peux t'opposer a la cession dans les 15 jours suivant l'avis, mais seulement pour des raisons sérieuses (ex : le repreneur peut pas payer le loyer). Le simple fait de pas vouloir le frère c'est pas suffisant.", votes:29 },
  ]},
  { author:"acheteur_banlieue", cat:"Financement", q:null, titre:"Frais de notaire à 3 500$ — est-ce normal??", contenu:"Je suis en train d'acheter ma première propriété et le notaire me charge 3 500$ pour l'acte de vente. Mes amis ont payé entre 1 200$ et 1 800$. Est-ce que c'est vraiment négociable ou c'est fixé?", votes:62, days:1, comments:[
    { author:"condo_snowdon", texte:"Les honoraires de notaire sont libres au Québec — pas de tarif fixe. 3 500$ c'est effectivement élevé pour une transaction standard. Hésite pas à magasiner, tu peux facilement trouver entre 1 500$ et 2 200$ pour un acte de vente résidentiel.", votes:41 },
    { author:"nouveau_proprio_rive_sud", texte:"J'ai payé 1 750$ l'an dernier. Appelle 3-4 notaires et demande une soumission. Certains affichent leur tarifs sur leur site web.", votes:28 },
    { author:"acheteur_banlieue", texte:"Je savais meme pas que c'était négociable! Je vais appeler d'autres notaires cette semaine, merci.", votes:9 },
    { author:"investisseur_plex", texte:"Attention quand meme — un notaire moins cher qui fait des erreurs dans l'acte peut te couter beaucoup plus cher a long terme. Vérifie les avis et assure-toi qu'il a de l'expérience en résidentiel.", votes:19 },
  ]},
  { author:"proprio_rosemont", cat:"Travaux", q:"Rosemont", titre:"Plancher de cuisine qui s'affaisse — vide sanitaire", contenu:"Dans un de mes appartements au rez-de-chaussée, les locataires me signalent que le plancher de cuisine fléchit légèrement au centre. La batisse a un vide sanitaire. J'ai regardé par en dessous et je vois que les solives semblent ok mais je suis pas expert. Est-ce que je dois m'inquiéter ou c'est normal pour une vieille maison?", votes:34, days:3, comments:[
    { author:"reno_plateau", texte:"Un plancher qui fléchit c'est rarement normal, surtout dans un vide sanitaire. Les causes possibles : solives pourries par l'humidité, poteaux de soutien qui ont bougé, ou problème de fondation. Je recommande fortement une inspection par un technologue ou un ingénieur en structure avant que ca empire.", votes:27 },
    { author:"flip_mtl", texte:"Vérifie surtout le taux d'humidité dans le vide sanitaire — si c'est humide, les solives pourrissent de l'intérieur sans que ca paraisse visuellement. Un hygromètre a 30$ peut t'aider a évaluer.", votes:18 },
    { author:"proprio_rosemont", texte:"Merci. Est-ce que je peux quand meme louer le logement pendant que j'attends l'inspection?", votes:5 },
    { author:"reno_plateau", texte:"Techniquement oui tant que c'est habitable et sécuritaire, mais informe tes locataires et agis rapidement. Si le problème empire et qu'il y a un accident, ta responsabilité comme propriétaire pourrait etre engagée.", votes:15 },
  ]},
  { author:"chercheur_duplex", cat:"Financement", q:null, titre:"Premier achat — duplex occupant ou condo?", contenu:"J'ai 80 000$ d'économies et je veux acheter. Je balance entre un condo a 380 000$ dans un secteur que j'aime ou un duplex a 550 000$ dans un quartier un peu plus loin. Avec le duplex, le revenu locatif pourrait couvrir une bonne partie de l'hypothèque. Est-ce que ca vaut vraiment la peine de s'étirer financierement pour un plex?", votes:103, days:4, comments:[
    { author:"investisseur_plex", texte:"Le duplex occupant c'est souvent le meilleur départ en immobilier locatif. Tu batis de l'équité tout en faisant payer ton hypothèque en partie par un locataire. La clé c'est de faire les chiffres honnetement — si tu loues le deuxième logement 1 400$/mois et que ton hypo est a 2 800$/mois, tu paies effectivement 1 400$ pour vivre, ce qui est souvent moins cher que louer.", votes:67 },
    { author:"proprio_multilogement", texte:"Avec 80k$ sur un 550k$, tu seras a ~14.5% de mise de fonds — tu vas payer la prime SCHL. Calcule bien l'impact sur ton paiement mensuel. Pour un duplex les regles SCHL sont un peu différentes aussi.", votes:45 },
    { author:"acheteur_banlieue", texte:"J'étais dans la meme situation l'an dernier. J'ai choisi le condo et j'en suis content pour la tranquilité d'esprit, mais je sais que financierement le plex était probablement meilleur.", votes:21 },
    { author:"chercheur_duplex", texte:"Est-ce que le revenu locatif compte dans le calcul d'admissibilité hypothécaire?", votes:14 },
    { author:"investisseur_plex", texte:"Oui! Pour un duplex occupant, les institutions acceptent généralement d'inclure 50-80% du revenu locatif dans le calcul. Ca améliore beaucoup ton ratio d'endettement. Parle a un courtier hypothécaire — c'est gratuit.", votes:38 },
  ]},
  { author:"gestion_villeray", cat:"Juridique", q:"Villeray", titre:"Locataire avec chat malgré clause no-animaux", contenu:"J'ai une clause explicite dans tout mes baux : aucun animal permis. Une locataire vient de m'informer qu'elle a un chat et me présente une ordonnance médicale pour animal de soutien émotionnel. Est-ce que je suis vraiment obligé d'accepter meme si le bail l'interdit?", votes:156, days:6, comments:[
    { author:"proprio_multilogement", texte:"Malheureusement oui — les tribunaux québécois ont statué que refuser un animal de soutien émotionnel avec prescription médicale valide peut constituer une discrimination basée sur le handicap. Ta clause no-animaux peut pas invalider un besoin médical reconnu.", votes:89 },
    { author:"triplex_hochelaga", texte:"Est-ce que toutes les ordonnances se valent ou est-ce que tu peux contester la validité de la prescription?", votes:23 },
    { author:"proprio_multilogement", texte:"Tu peux demander a voir la prescription et vérifier qu'elle vient d'un médecin ou professionnel de la santé reconnu. Des fausses ordonnances ca existe, mais si c'est légitime, t'as pas grand recours. Concentre-toi plutot sur des clauses de dommages et de remplacement de revêtement a la fin du bail.", votes:54 },
    { author:"gestion_villeray", texte:"Est-ce qu'il y a une jurisprudence récente la-dessus?", votes:11 },
    { author:"locataire_plateau", texte:"Comme locataire je trouve que cette situation est souvent mal utilisée — mais la loi protège vraiment les gens avec des besoins médicaux légitimes. La meilleure protection c'est d'avoir de bonnes clauses sur l'état du logement a la remise.", votes:29 },
  ]},
  { author:"nouveau_proprio_rive_sud", cat:"Travaux", q:null, titre:"Toiture refaite à 22 000$ — comment déduire fiscalement?", contenu:"Je viens de faire refaire completement ma toiture sur mon triplex — ca m'a couté 22 000$. Est-ce que je peux déduire ca en entier cette année ou je dois l'amortir? Et si oui, sur combien d'années?", votes:71, days:7, comments:[
    { author:"investisseur_plex", texte:"Une toiture complète est généralement considérée comme une amélioration (capital expense) et non une réparation courante. Ca doit etre capitalisé et amorti. Pour l'ARC, les bâtiments résidentiels locatifs tombent dans la catégorie 1 a 4% dégressif, ou catégorie 3 a 5% selon l'année de construction.", votes:48 },
    { author:"proprio_multilogement", texte:"Attention a la règle de la demi-année — la première année tu peux seulement déduire la moitié du taux d'amortissement normal. Et si t'as d'autres bâtiments dans la meme catégorie, ils peuvent etre regroupés.", votes:31 },
    { author:"nouveau_proprio_rive_sud", texte:"Et si une partie des travaux c'était des réparations ponctuelles (remplacement de quelques bardeaux fissurés) et l'autre une réfection complète?", votes:9 },
    { author:"flip_mtl", texte:"La distinction réparation vs amélioration est un terrain glissant. Si c'est une refonte complète, c'est une amélioration meme si t'as profité pour faire quelques réparations en meme temps. Je suggère de consulter un comptable spécialisé en immobilier — ca vaut les 200$ que ca coute.", votes:27 },
  ]},
  { author:"locatif_laurentides", cat:"Gestion locative", q:null, titre:"Gestionnaire immobilier qui encaisse les loyers dans son compte perso", contenu:"Je viens d'engager une compagnie de gestion pour mes deux plex. Ils me demandent d'avoir les locataires payer directement dans leur compte de gestion, et ils me remettent le net le 10 de chaque mois apres déduction de leurs frais. C'est tu une pratique normale ou je devrais m'inquiéter?", votes:58, days:7, comments:[
    { author:"proprio_multilogement", texte:"C'est une pratique qui existe mais qui comporte des risques. Le problème : si la compagnie de gestion fait faillite ou disparait, tes loyers peuvent etre considérés comme faisant partie de leur masse créancière. Exige idéalement un compte en fiducie séparé.", votes:39 },
    { author:"investisseur_plex", texte:"Demande a voir la convention de gestion en détail. Elle devrait préciser les délais de remise, les conditions de rupture, et comment les fonds sont séparés. Si c'est flou ou inexistant, c'est un gros red flag.", votes:27 },
    { author:"locatif_laurentides", texte:"Ils ont un contrat de 2 ans avec pénalité de résiliation. Ca m'inquiète un peu.", votes:7 },
    { author:"proprio_rosemont", texte:"Un contrat de gestion de 2 ans avec pénalité c'est long et contraignant. La plupart des bons gestionnaires travaillent avec des contrats de 1 an renouvelables. Je ferais lire ca par un avocat avant de signer.", votes:33 },
  ]},
  { author:"condo_snowdon", cat:"Copropriété", q:"Snowdon", titre:"Syndicat de copropriété — facture de 3 800$ inattendue", contenu:"Mon syndicat m'envoie une cotisation spéciale de 3 800$ pour des travaux sur la facade et le toit. J'étais pas au courant de ces travaux et aucune assemblée a été convoquée pour voter ca. Est-ce qu'ils peuvent me charger ca sans vote?", votes:83, days:3, comments:[
    { author:"proprio_multilogement", texte:"Non, normalement les travaux importants et les cotisations spéciales doivent etre votés en assemblée. Vérifie la déclaration de copropriété et les règlements de l'immeuble — ils précisent souvent le seuil au-dela duquel un vote est requis.", votes:51 },
    { author:"reno_plateau", texte:"Demande les procès-verbaux des assemblées des 2 dernières années et les états financiers du syndicat. Si les travaux ont pas été votés en bonne et due forme, tu peux contester la cotisation.", votes:38 },
    { author:"condo_snowdon", texte:"Ils disent que c'était des urgences qui nécessitaient pas de vote. Ca se peut tu?", votes:11 },
    { author:"proprio_multilogement", texte:"Pour des urgences réelles (ex: danger imminent), le CA peut agir sans assemblée générale mais doit en informer les copropriétaires rapidement. Demande la documentation prouvant l'urgence. Si c'était juste pratique pour eux de pas convoquer d'assemblée, c'est contestable.", votes:29 },
  ]},
  { author:"acheteur_anx", cat:"Financement", q:null, titre:"Refinancement — combien de temps ca prend?", contenu:"Je veux refinancer mon immeuble pour libérer des liquidités et faire une mise de fonds sur un deuxième achat. Mon courtier dit que ca peut prendre 3 semaines, ma banque dit 6 semaines. Quelle est votre expérience en 2025-2026?", votes:29, days:4, comments:[
    { author:"investisseur_plex", texte:"Mon expérience : entre 4 et 6 semaines pour un refinancement standard. Ton courtier est peut-etre optimiste. Le délai dépend surtout de la vitesse de l'évaluateur et du notaire pour préparer l'acte.", votes:21 },
    { author:"flip_mtl", texte:"J'ai eu un refinancement en 3 semaines l'été dernier avec un courtier hypothécaire et un notaire qui se connaissaient bien. La relation entre les deux accélère beaucoup le processus. Mais compte pas la dessus pour planifier un achat — prévoie toujours un mois minimum de coussin.", votes:17 },
    { author:"acheteur_anx", texte:"Mon achat est prévu dans 8 semaines, donc en principe ca devrait aller?", votes:4 },
    { author:"investisseur_plex", texte:"En principe oui, mais assure-toi d'avoir ton approbation finale AVANT de signer une promesse d'achat, ou au moins d'avoir une clause de financement dans ton offre.", votes:19 },
  ]},
  { author:"proprio_rosemont", cat:"Travaux", q:"Rosemont", titre:"Permis requis pour une véranda en bois?", contenu:"Je veux ajouter une véranda en bois traité a l'arrière de mon duplex — environ 12 x 16 pieds. C'est sur ma propriété, pas sur le terrain du voisin. Est-ce que j'ai besoin d'un permis? Et est-ce qu'il y a des restrictions a Montréal?", votes:44, days:5, comments:[
    { author:"reno_plateau", texte:"Oui, tu as presque certainement besoin d'un permis de construction a Montréal pour une terrasse/véranda couverte de cette taille. Appelle le service de l'urbanisme de ton arrondissement — les regles varient selon l'arrondissement.", votes:31 },
    { author:"flip_mtl", texte:"Vérifie aussi le règlement de zonage pour les marges de recul obligatoires. Dans beaucoup d'arrondissements a Montréal, tu dois laisser 1 a 2 mètres de la limite de propriété.", votes:24 },
    { author:"proprio_rosemont", texte:"La batisse date de 1928 mais je crois pas qu'elle soit classée. Comment vérifier?", votes:7 },
    { author:"reno_plateau", texte:"Tu peux vérifier sur le Répertoire du patrimoine culturel du Québec en ligne, ou appeler directement l'urbanisme de ton arrondissement.", votes:18 },
  ]},
  { author:"triplex_hochelaga", cat:"Gestion locative", q:"Hochelaga", titre:"Locataire qui envoie des messages a 3h du matin", contenu:"J'ai un locataire qui m'envoie des textos pour des demandes non urgentes (ampoule brulée, robinet qui goutte légèrement) a n'importe quelle heure — incluant 2h et 3h du matin. J'ai demandé poliment plusieurs fois de limiter les communications aux heures normales. Ca continue. Qu'est-ce que je peux faire légalement?", votes:127, days:7, comments:[
    { author:"gestion_villeray", texte:"Envoie une mise en demeure formelle par écrit (lettre recommandée de préférence) lui demandant de limiter ses communications aux heures de bureau sauf urgences réelles. Précise ce que tu considères comme une urgence. Garde des copies de tout.", votes:78 },
    { author:"proprio_multilogement", texte:"Bascule entierement vers le courriel pour toutes les communications non urgentes. Si un courriel arrive a 3h, tu le lis le matin. Le texto tu te sens obligé de voir.", votes:56 },
    { author:"triplex_hochelaga", texte:"Si je réponds pas a ses textos, est-ce que ca peut se retourner contre moi s'il se plaint au TAL?", votes:19 },
    { author:"gestion_villeray", texte:"Le critère c'est ta réactivité aux demandes légitimes, pas le canal de communication. Si tu documentes toutes les demandes et y réponds dans des délais raisonnables par courriel, t'es couvert.", votes:42 },
    { author:"locataire_plateau", texte:"Comme locataire, c'est clairement abusif de sa part. Un propriétaire a le droit a des heures raisonnables. La plupart des locataires comprennent ca.", votes:35 },
  ]},
  { author:"acheteur_banlieue", cat:"Financement", q:null, titre:"Taux fixe 5 ans a 4.89% — est-ce que je négocie ou j'accepte?", contenu:"Ma banque m'offre 4.89% fixe 5 ans pour mon renouvellement. J'ai un excellent dossier de crédit et j'ai toujours payé a temps. Est-ce qu'il y a de la marge pour négocier?", votes:55, days:2, comments:[
    { author:"investisseur_plex", texte:"Oui, toujours négocier! Les banques ont des taux affichés et des taux réels. Avec un bon dossier, tu devrais pouvoir obtenir 15-30 points de base de moins. Dis-leur que tu magasine chez la concurrence.", votes:38 },
    { author:"flip_mtl", texte:"Je recommande fortement un courtier hypothécaire pour un renouvellement. Ils ont acces a des taux que les banques affichent pas au grand public, et c'est gratuit pour toi. Ca prend 30 minutes et ca peut te sauver des centaines de dollars par année.", votes:29 },
    { author:"acheteur_banlieue", texte:"Y'a tu un risque a changer d'institution au renouvellement? Des frais cachés?", votes:8 },
    { author:"investisseur_plex", texte:"Au renouvellement il y a pas de pénalité de remboursement anticipé. La nouvelle institution paye souvent les frais de transfert.", votes:22 },
  ]},
  { author:"proprio_multilogement", cat:"Juridique", q:null, titre:"Combien de temps conserver les baux apres la fin du contrat?", contenu:"J'ai des baux qui remontent a 10-15 ans dans mes archives. Y'a tu une obligation légale de les conserver pendant un certain nombre d'années? Mes classeurs débordent et je voudrais faire du ménage.", votes:38, days:21, comments:[
    { author:"investisseur_plex", texte:"La regle générale en droit civil québécois c'est 3 ans pour les contrats expirés. Mais pour l'ARC et Revenu Québec, tu dois conserver tes documents comptables pendant 6 ans. Je garderais donc les baux 6-7 ans par précaution.", votes:27 },
    { author:"reno_plateau", texte:"Pour les baux actifs ou récents, garde tout. Pour les anciens, je suggère de tout numériser avant de détruire. Un scan en PDF prend presque pas de place.", votes:19 },
    { author:"proprio_multilogement", texte:"Bonne idée pour la numérisation. Un outil spécifique que vous recommandez?", votes:6 },
    { author:"gestion_villeray", texte:"Google Drive ou Dropbox organisés par immeuble et par année. Nomme tes fichiers avec l'adresse, le logement et les dates du bail. Simple mais efficace.", votes:16 },
  ]},
  { author:"reno_plateau", cat:"Travaux", q:"Plateau-Mont-Royal", titre:"Béton de patio qui se fissure 6 mois apres les travaux", contenu:"J'ai fait couler une dalle de béton pour ma cour arrière a la fin de l'été. Des les premiers gels, des fissures sont apparues — certaines fines, d'autres plus prononcées (2-3 mm de large). L'entrepreneur dit que c'est normal pour une première saison. C'est tu vrai ou j'ai un recours?", votes:66, days:7, comments:[
    { author:"flip_mtl", texte:"Des fissures capillaires (moins de 1mm) peuvent etre normales a cause du retrait du béton. Des fissures de 2-3 mm apres seulement 6 mois, c'est moins normal et peut indiquer un problème de mélange ou de préparation du sol.", votes:41 },
    { author:"nouveau_proprio_rive_sud", texte:"Documente tout en photos avec une regle pour mesurer la largeur des fissures. Si t'as un contrat écrit, vérifie s'il inclut une garantie sur les travaux.", votes:35 },
    { author:"reno_plateau", texte:"Y'a pas eu de contrat écrit — verbal seulement. Est-ce que j'ai encore des recours?", votes:10 },
    { author:"flip_mtl", texte:"Oui, le Code civil s'applique meme sans contrat écrit. Mais c'est plus difficile a prouver. La Régie du batiment peut aussi etre impliquée si l'entrepreneur était certifié RBQ.", votes:24 },
    { author:"proprio_rosemont", texte:"Fais évaluer les fissures par un second entrepreneur indépendant pour avoir une opinion professionnelle par écrit. Ce document sera précieux si tu vas en médiation.", votes:18 },
  ]},
  { author:"chercheur_duplex", cat:"Financement", q:null, titre:"Mise de fonds minimale pour un triplex en 2026", contenu:"Je regarde des triplex entre 700 000$ et 800 000$. Je voulais m'y installer avec ma famille. Quelle est la mise de fonds minimale? J'ai entendu que c'est different selon que tu occupes ou non.", votes:87, days:5, comments:[
    { author:"investisseur_plex", texte:"Pour un triplex occupé par le propriétaire, la mise de fonds minimale est de 10% (avec assurance SCHL). Pour un immeuble non occupé de 2-4 logements, c'est 20% minimum. Le fait de l'occuper change tout.", votes:62 },
    { author:"proprio_multilogement", texte:"Attention : la prime SCHL sur 10% de mise de fonds est de 3.1% du montant emprunté. Sur un emprunt de 720 000$, ca fait ~22 320$ ajoutés a ton hypothèque.", votes:44 },
    { author:"chercheur_duplex", texte:"Et si je prends un triplex mais que j'y habite pas?", votes:9 },
    { author:"investisseur_plex", texte:"Alors c'est minimum 20% et pas d'acces a la SCHL. Sur un 750 000$, ca fait 150 000$ de mise de fonds.", votes:31 },
  ]},
  { author:"locatif_laurentides", cat:"Gestion locative", q:null, titre:"Assurances pour plusieurs immeubles — quelle formule?", contenu:"Je possede maintenant 4 immeubles (2 duplex et 2 triplex) et chacun est assuré séparément avec des renouvellements a des dates différentes. Est-ce qu'il vaut mieux tout regrouper chez un meme assureur?", votes:42, days:7, comments:[
    { author:"proprio_multilogement", texte:"Regrouper chez un meme assureur donne généralement un meilleur taux et simplifie beaucoup la gestion. Promutuel, Intact, et Desjardins ont de bonnes options pour les propriétaires de plusieurs immeubles.", votes:29 },
    { author:"investisseur_plex", texte:"L'avantage moins évident : avec plusieurs immeubles, t'as plus de poids pour négocier. Parle a un courtier en assurances spécialisé en immobilier commercial/locatif.", votes:21 },
    { author:"locatif_laurentides", texte:"Est-ce que le type de logement (plex résidentiel vs commercial) change beaucoup?", votes:5 },
    { author:"proprio_multilogement", texte:"Oui, significativement. Le résidentiel locatif est généralement moins cher a assurer que le commercial.", votes:14 },
  ]},
  { author:"flip_mtl", cat:"Investissement", q:null, titre:"Prescription acquisitive — on peut tu vraiment acquérir un terrain par usage prolongé?", contenu:"Je suis voisin d'un terrain vague dont le propriétaire semble etre décédé il y a longtemps et la succession a jamais été réglée. Je l'entretiens et l'utilise depuis environ 12 ans. J'ai entendu parler de prescription acquisitive. C'est tu réaliste au Québec?", votes:74, days:14, comments:[
    { author:"investisseur_plex", texte:"La prescription acquisitive existe au Québec mais c'est un processus long et complexe. Faut démontrer une possession continue, paisible, publique et non équivoque pendant 10 ans.", votes:48 },
    { author:"proprio_multilogement", texte:"Attention — si le propriétaire est décédé et la succession a pas été réglée, c'est Revenu Québec qui peut etre héritier en dernier ressort. La démarche légale est differente dans ce cas. Consulte un notaire.", votes:39 },
    { author:"flip_mtl", texte:"Est-ce que des voisins pourraient s'y opposer si je commence la démarche?", votes:12 },
    { author:"investisseur_plex", texte:"Toute personne qui a un intéret dans le terrain peut s'y opposer. Un notaire peut guider tout ce processus.", votes:25 },
  ]},
  { author:"acheteur_anx", cat:"Premier achat", q:null, titre:"Inspection préachat — qu'est-ce qui doit vraiment nous inquiéter?", contenu:"On a visité une maison qui nous plait beaucoup. L'inspection a révélé quelques trucs : fissures dans les fondations, isolation insuffisante dans le grenier, et un panneau électrique de 100 amperes 'a surveiller'. On sait pas si c'est normal pour une maison de 40 ans.", votes:112, days:3, comments:[
    { author:"reno_plateau", texte:"Pour les fissures dans les fondations : la distinction importante c'est entre fissures horizontales (tres problématiques) et fissures verticales ou diagonales (souvent du tassement différentiel, peut etre stable). Demande un avis d'ingénieur en structure.", votes:71 },
    { author:"flip_mtl", texte:"Le panneau de 100A, pour une maison de 40 ans c'est souvent insuffisant pour les besoins actuels (VE, thermopompe, etc.). Comptez 2 000 a 3 500$ pour le mettre a 200A. Inclus ca dans ta négociation.", votes:52 },
    { author:"proprio_rosemont", texte:"Pour l'isolation du grenier : selon le programme Rénoclimat, tu peux obtenir des subventions substantielles. Budget 3 000 a 8 000$ selon la superficie.", votes:38 },
    { author:"acheteur_anx", texte:"L'inspecteur nous a dit que les fissures 'semblaient stables' mais qu'il peut pas se prononcer sur les fondations. On peut tu exiger une clause?", votes:15 },
    { author:"reno_plateau", texte:"Absolument. Négocie une promesse d'achat conditionnelle a une inspection de fondation par un ingénieur en structure. C'est tout a fait standard. Si le vendeur refuse cette condition, c'est un signal.", votes:44 },
  ]},
  { author:"gestion_villeray", cat:"Gestion locative", q:"Villeray", titre:"Loyer impayé depuis 2 mois — quelle est la marche a suivre exacte?", contenu:"Un locataire m'a pas payé depuis 2 mois. J'ai laissé passer en espérant qu'il régularise mais rien. Il répond a mes messages en disant 'je vais payer bientot' mais sans résultat. Quelle est la procédure exacte pour le TAL?", votes:94, days:4, comments:[
    { author:"proprio_multilogement", texte:"Étape 1 : Envoie une mise en demeure formelle par écrit des aujourd'hui — courriel avec confirmation de lecture ET texte. Donne-lui 5-7 jours. Étape 2 : Si pas de réponse, dépose une demande au TAL (~100$). Le délai d'audience est généralement 3-6 mois.", votes:64 },
    { author:"triplex_hochelaga", texte:"Perds pas plus de temps avec les messages informels. Chaque mois qui passe c'est de l'argent que tu récupéreras probablement pas.", votes:47 },
    { author:"gestion_villeray", texte:"S'il paie les 2 mois en retard apres que j'ai déposé au TAL, est-ce que ma demande est automatiquement rejetée?", votes:13 },
    { author:"proprio_multilogement", texte:"Pas automatiquement. Si c'est la première fois et qu'il paie tout incluant les intérets, le TAL peut rejeter la demande de résiliation. Mais tu peux quand meme demander les frais de dépot.", votes:38 },
    { author:"locataire_plateau", texte:"Comme locataire je trouve qu'il est important de mentionner que les locataires peuvent aussi se défendre au TAL. Mais payer pas sans communication honnete, c'est clairement problématique.", votes:22 },
  ]},
];

async function main() {
  console.log("Creating users...");
  const map: Record<string, string> = {};
  for (const u of USERS) {
    const ex = await prisma.user.findUnique({ where: { username: u.username } });
    if (ex) { map[u.username] = ex.id; continue; }
    const user = await prisma.user.create({ data: { username: u.username, name: u.username, email: `${u.username}@nid.local`, password: PASS, tag: u.tag ?? null } });
    map[u.username] = user.id;
    console.log(`  + ${u.username}`);
  }

  console.log("Creating posts...");
  for (const p of POSTS) {
    const aid = map[p.author]; if (!aid) continue;
    const cat = CAT[p.cat] ?? "question";
    const qs = p.q ? (QS[p.q] ?? "plateau-mont-royal") : "plateau-mont-royal";
    const dt = new Date(Date.now() - p.days * 86400000);
    const post = await prisma.post.create({
      data: { titre: p.titre, contenu: p.contenu, auteurNom: p.author, auteurId: aid, quartierSlug: qs, villeSlug: "montreal", categorie: cat, nbVotes: p.votes, nbCommentaires: p.comments.length, creeLe: dt },
    });
    // votes
    const voters = Object.values(map).filter((id) => id !== aid);
    for (let i = 0; i < Math.min(p.votes, voters.length); i++) {
      await prisma.vote.create({ data: { userId: voters[i], postId: post.id } }).catch(() => {});
    }
    // comments
    for (let i = 0; i < p.comments.length; i++) {
      const c = p.comments[i]; const cid = map[c.author]; if (!cid) continue;
      await prisma.comment.create({ data: { contenu: c.texte, auteurNom: c.author, auteurId: cid, postId: post.id, nbVotes: c.votes, creeLe: new Date(dt.getTime() + (i + 1) * 3600000) } });
    }
    console.log(`  + "${p.titre.slice(0, 50)}..." (${p.comments.length} comments)`);
  }
  console.log("Done!");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
