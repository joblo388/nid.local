# nid.local — Forum immobilier québécois

Forum communautaire sur l'immobilier au Québec. Discussions de quartier, ventes, locations, rénovations et alertes de voisinage.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Typo | Geist (Google Fonts via next/font) |
| Auth | NextAuth v5 (beta) — JWT strategy |
| ORM | Prisma 5 |
| Base de données | PostgreSQL (Neon) |
| Langage | TypeScript 5 strict |

---

## Structure des fichiers

```
src/
├── app/
│   ├── page.tsx                    # Homepage — charge 20 posts (Montréal, populaires) + stats sidebar
│   ├── layout.tsx                  # Root layout — SessionProvider, Geist, globals.css
│   ├── globals.css                 # CSS custom properties (couleurs + dark mode)
│   ├── not-found.tsx               # Page 404 personnalisée
│   ├── villes/page.tsx             # Liste de toutes les villes groupées par région
│   ├── ville/[slug]/page.tsx       # Page d'une ville + quartiers + posts paginés
│   ├── quartiers/page.tsx          # Liste de tous les quartiers groupés par ville
│   ├── quartier/[slug]/page.tsx    # Page d'un quartier + posts paginés
│   ├── post/[id]/page.tsx          # Détail d'un post (commentaires + votes + actions)
│   ├── post/[id]/opengraph-image.tsx
│   ├── nouveau-post/page.tsx       # Formulaire de création de post (auth requise)
│   ├── nouveau-post/NouveauPostForm.tsx
│   ├── u/[username]/page.tsx       # Profil utilisateur — posts + réponses récentes
│   ├── parametres/page.tsx         # Paramètres du compte (profil, avatar, mot de passe)
│   ├── parametres/ParametresForm.tsx
│   ├── notifications/page.tsx      # Centre de notifications
│   ├── admin/page.tsx              # Admin — signalements (rôle admin requis)
│   ├── admin/AdminActions.tsx
│   ├── annonces/
│   │   ├── page.tsx                # Liste des annonces marketplace (filtres + sidebar)
│   │   ├── AnnoncesListeView.tsx   # Client component — liste, favoris, filtres
│   │   ├── marketplace.css         # CSS dédié marketplace (pas Tailwind)
│   │   ├── [id]/page.tsx           # Détail d'une annonce (galerie, contact, docs)
│   │   ├── [id]/AnnonceDetailView.tsx
│   │   ├── publier/page.tsx        # Formulaire publication en 4 étapes (stepper)
│   │   └── publier/PublierAnnonceForm.tsx
│   ├── auth/
│   │   ├── connexion/page.tsx      # Login email/password + Google OAuth
│   │   └── inscription/page.tsx   # Inscription avec validation + auto sign-in
│   └── api/
│       ├── auth/[...nextauth]/     # Handler NextAuth (GET + POST)
│       ├── auth/register/          # POST — créer un compte (hash bcryptjs)
│       ├── posts/route.ts          # GET (paginé+filtré) + POST créer post
│       ├── posts/[id]/route.ts     # PATCH/DELETE post (auteur ou admin)
│       ├── posts/[id]/vote/        # POST — voter sur un post
│       ├── posts/[id]/comments/    # POST — créer un commentaire
│       ├── comments/[id]/          # PATCH/DELETE commentaire
│       ├── notifications/          # GET notifications + PATCH marquer lu
│       ├── reports/                # POST — signaler post ou commentaire
│       ├── search/                 # GET — recherche plein texte
│       └── user/settings/          # PATCH — profil, avatar, mot de passe
├── components/
│   ├── Header.tsx                  # Navbar sticky — logo, nav, menu utilisateur
│   ├── HomepageView.tsx            # Fil principal — filtres ville/quartier/catégorie/tri + pagination API
│   ├── PostCard.tsx                # Carte de post avec highlighting + vignette image
│   ├── PostsFiltres.tsx            # Filtres catégorie/tri + pagination API (pages ville/quartier)
│   ├── PostActions.tsx             # Modifier/supprimer post (auteur)
│   ├── CommentSection.tsx          # Section commentaires + formulaire (avec upload image)
│   ├── Sidebar.tsx                 # Sidebar droite — stats, villes actives, ressources
│   ├── VoteButton.tsx              # Bouton vote optimiste
│   ├── ShareButton.tsx             # Partager un post
│   ├── ReportButton.tsx            # Signaler post ou commentaire
│   ├── NotificationBell.tsx        # Cloche de notifications
│   ├── SessionProvider.tsx         # Wrapper client NextAuth SessionProvider
│   ├── QuartierBadge.tsx           # Badge quartier (non utilisé pour l'instant)
│   └── FiltreBar.tsx               # Barre de filtres (non utilisé pour l'instant)
├── lib/
│   ├── data.ts                     # Données statiques: 18 villes, ~85 quartiers + dbPostToAppPost
│   ├── types.ts                    # Types TypeScript: Ville, Quartier, Post, Categorie
│   ├── prisma.ts                   # Singleton PrismaClient
│   └── rateLimit.ts                # Rate limiting en mémoire
├── types/
│   └── next-auth.d.ts              # Extension du type Session (id, username)
└── auth.ts                         # Config NextAuth — providers, callbacks JWT/session
prisma/
├── schema.prisma                   # Modèles: User, Post, Comment, Vote, Notification, Report, ...
└── dev.db                          # (obsolète — DB migrée sur Neon PostgreSQL)
```

---

## Pagination

La pagination est **serveur** sur toutes les pages de listing :

- `GET /api/posts?villeSlug=&quartierSlug=&categorie=&tri=&page=` retourne 20 posts filtrés + `total` + `hasMore` + `votedPostIds`
- Homepage (`HomepageView`), pages ville et quartier (`PostsFiltres`) : charge la 1re page côté serveur, fetche via API sur changement de filtre/tri ou "Charger plus"
- La `Sidebar` reçoit des stats précalculées (groupBy) au lieu de tous les posts

---

## Palette de couleurs

Toutes les couleurs passent par des CSS custom properties définies dans `globals.css`. **Ne jamais hardcoder de couleurs directement** — toujours utiliser `var(--nom)`.

### Mode clair (défaut)

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--bg-page` | `#f5f4f0` | Fond de page (légèrement crème) |
| `--bg-card` | `#ffffff` | Fond des cartes et header |
| `--bg-secondary` | `#f1efe8` | Fond secondaire (barre quartiers, inputs) |
| `--border` | `#e8e7e2` | Bordures principales (0.5px) |
| `--border-secondary` | `#d3d1c7` | Bordures secondaires |
| `--text-primary` | `#1a1a18` | Titres et texte principal |
| `--text-secondary` | `#3d3c39` | Navigation, labels |
| `--text-tertiary` | `#6e6c67` | Métadonnées, dates, placeholders |
| `--green` | `#1D9E75` | Couleur d'accent principale (CTA, actif) |
| `--green-light-bg` | `#E1F5EE` | Fond badge vert clair |
| `--green-text` | `#0F6E56` | Texte sur fond vert clair |
| `--blue-bg` | `#E6F1FB` | Fond badge bleu |
| `--blue-text` | `#185FA5` | Texte sur fond bleu |
| `--red-bg` | `#FCEBEB` | Fond badge rouge |
| `--red-text` | `#A32D2D` | Texte sur fond rouge |
| `--amber-bg` | `#FAEEDA` | Fond badge ambré |
| `--amber-text` | `#854F0B` | Texte sur fond ambré |

### Mode sombre (automatique via `prefers-color-scheme: dark`)

| Variable | Valeur dark |
|----------|-------------|
| `--bg-page` | `#141414` |
| `--bg-card` | `#1a1a1a` |
| `--bg-secondary` | `#222222` |
| `--border` | `#2e2e2e` |
| `--border-secondary` | `#333333` |
| `--text-primary` | `#f2f0ea` |
| `--text-secondary` | `#d4d1ca` |
| `--text-tertiary` | `#9e9b95` |
| `--green` | `#1D9E75` (inchangé) |
| `--green-light-bg` | `#0a2e20` |
| `--green-text` | `#5DCAA5` |
| `--blue-bg` | `#0d2140` |
| `--blue-text` | `#85B7EB` |
| `--red-bg` | `#3d1515` |
| `--red-text` | `#f09595` |
| `--amber-bg` | `#2e1f08` |
| `--amber-text` | `#EF9F27` |

---

## Règles de dark mode

- Le dark mode est **entièrement automatique** via `@media (prefers-color-scheme: dark)` dans `globals.css`.
- Pas de toggle manuel — pas de classe `.dark` Tailwind — pas de `localStorage`.
- Tout composant doit utiliser uniquement `var(--...)` pour les couleurs, jamais de valeurs Tailwind comme `bg-white` ou `text-gray-900` qui ne s'adaptent pas.
- Exception autorisée: les couleurs de quartier (`couleur: string` dans `Quartier`) utilisent des classes Tailwind (`bg-rose-500`, etc.) car elles servent uniquement de points de couleur décoratifs (petits ronds `w-1.5 h-1.5`).
- La classe utilitaire `.hover-bg` est définie dans `globals.css` pour les hovers sur composants server (impossible d'utiliser `hover:` Tailwind avec `var()`).

---

## Types de données

```typescript
type Ville = { slug: string; nom: string; region: string }

type Quartier = { slug: string; nom: string; villeSlug: string; couleur: string }

type Categorie = "vente" | "location" | "question" | "renovation" | "voisinage" | "alerte"

type Post = {
  id: string; titre: string; contenu: string; auteur: string;
  quartier: Quartier; categorie: Categorie; creeLe: string;
  nbCommentaires: number; nbVotes: number; nbVues: number;
  epingle?: boolean; auteurId?: string | null; imageUrl?: string | null;
}
```

---

## Catégories de posts

| Valeur | Label affiché |
|--------|--------------|
| `vente` | Vente |
| `location` | Location |
| `question` | Question |
| `renovation` | Conseil |
| `voisinage` | Voisinage |
| `construction` | Construction |
| `legal` | Légal |
| `financement` | Financement |
| `copropriete` | Co-propriété |

---

## Décisions de design

### Général
- **Langue**: 100% français québécois dans toute l'interface.
- **Max-width**: `1100px` centré avec `px-5` sur toutes les pages.
- **Font size**: petite — 11px, 12px, 13px, 14px. Pas de grands textes sauf titres de posts.
- **Bordures**: `0.5px solid var(--border)` partout — jamais `1px`.
- **Border-radius**: `rounded-xl` (12px) pour cartes et dropdowns, `rounded-lg` (8px) pour boutons et badges.
- **Shadows**: uniquement sur les dropdowns — `0 8px 24px rgba(0,0,0,0.12)`.

### Header
- Sticky, hauteur fixe `52px`.
- Logo: `nid` en `--text-primary`, `.local` en `--green`, font-black 18px.
- Auth: bouton "Se connecter" discret + bouton "S'inscrire" vert plein.
- Menu utilisateur: avatar circulaire vert avec initiale, dropdown à droite.

### Navigation des villes/quartiers
- Deux barres sticky sous le header: `VilleBar` (bg-card) puis `QuartierBar` (bg-secondary).
- Élément actif dans VilleBar: `green-light-bg` + `green-text`.
- Élément actif dans QuartierBar: `--green` plein blanc.
- Scroll horizontal sans scrollbar visible (`scrollbarWidth: none`).

### PostCard
- Fond `--bg-card`, bordure `0.5px`, `rounded-xl`.
- Badge catégorie en haut à gauche, couleur selon catégorie (vert, bleu, rouge, ambré).
- Highlighting des mots recherchés dans le titre.
- Vignette image (max 180px de hauteur) si `imageUrl` présent.
- Footer: votes, commentaires, vues avec icônes SVG inline.

### Images
- Stockées en base64 data URL dans la colonne `imageUrl` (Post et Comment).
- Limite : 2 MB pour les posts et commentaires, 500 KB pour les avatars.
- Validation côté serveur : doit commencer par `data:image/`.

### Sidebar
- Visible uniquement `md:` et plus, largeur fixe `240px`.
- CTA "Nouvelle discussion" en pleine largeur, vert.
- Reçoit des stats précalculées (`SidebarStats`) — pas de posts entiers.

### Pages auth
- Formulaires centrés, max-width étroit.
- Erreurs affichées inline sous les champs.
- Bouton Google OAuth présent mais désactivé (clés non configurées).
- Après inscription réussie: auto sign-in + redirection vers `/`.

### Marketplace (annonces)
- CSS dans `src/app/annonces/marketplace.css` — **ne pas convertir en Tailwind**, utilise les CSS custom properties existantes.
- Max-width `900px` pour les pages liste et détail, `700px` pour le formulaire de publication.
- **Persisté en DB** — modèles Prisma: `Listing`, `ListingImage`, `ListingDocument`, `ListingFavorite`, `ListingComment`.
- API routes: `GET/POST /api/annonces`, `GET/PATCH/DELETE /api/annonces/[id]`, `POST /api/annonces/[id]/favorite`, `POST /api/annonces/[id]/comments`, `POST /api/annonces/[id]/click`.
- Le formulaire de publication utilise un **stepper 4 étapes** avec navigation avant/arrière + upload d'images réel via `/api/upload`.
- Ville et quartier sélectionnables depuis les mêmes données statiques que le forum (`data.ts`).
- **Mode anonyme**: le propriétaire peut masquer son username (champ `anonyme` sur `Listing`).
- **Téléphone optionnel**: le propriétaire peut afficher son numéro publiquement (champ `telephone` sur `Listing`).
- **Commentaires** sur les annonces — tout utilisateur connecté peut commenter.
- **Stats** visibles: vues, clics (depuis la liste), favoris, commentaires. Le propriétaire voit un "Tableau de bord" en haut de la page détail.
- **Carte Google Maps** intégrée en iframe sur la page détail et en aperçu dans le formulaire (étape 4).
- Les utilisateurs du forum réutilisent leur compte pour acheter/vendre.
- Lien "Annonces" dans le Header (nav desktop + mobile) et dans la Sidebar (Ressources utiles).
- Section "Mes annonces" visible sur le profil utilisateur (`/u/[username]`) avec statut (active/vendu/retiré).
- Header affiche un badge **MARKETPLACE** et une nav contextuelle quand on est sur `/annonces/*`.
- Images: upload via Vercel Blob (avec fallback base64), affichage via `next/image`.

### Données actuelles
- Posts, commentaires et votes sont **persistés en base de données** (PostgreSQL Neon).
- Villes et quartiers sont des **données statiques** dans `src/lib/data.ts`.
- Annonces marketplace: **persistées en DB** (Listing + images + documents + favoris).

---

## État d'avancement

- [x] Structure de navigation (villes, quartiers, posts)
- [x] Fil de discussions avec filtres et recherche
- [x] Auth (inscription, connexion, session, déconnexion)
- [x] Dark mode automatique
- [x] Création de posts (avec upload d'image)
- [x] Commentaires (avec upload d'image)
- [x] Posts en base de données (PostgreSQL Neon)
- [x] Votes sur les posts
- [x] Signalements (posts et commentaires)
- [x] Notifications
- [x] Page profil (`/u/[username]`)
- [x] Paramètres du compte (profil, avatar, mot de passe)
- [x] Admin — gestion des signalements
- [x] Pagination serveur (homepage, ville, quartier)
- [x] Réinitialisation de mot de passe (token en DB, lien loggé en console — brancher un service email en prod)
- [x] Marketplace immobilier — liste, détail, formulaire publication 4 étapes
- [x] Marketplace — persistance en DB (Listing, ListingImage, ListingDocument, ListingFavorite)
- [x] Marketplace — API routes CRUD + favoris
- [x] Marketplace — upload d'images réel (Vercel Blob / base64 fallback) + next/image
- [x] Marketplace — filtres fonctionnels (quartier, type, prix max)
- [x] Marketplace — favoris persistés en DB
- [x] Marketplace — "Mes annonces" sur le profil utilisateur (statut, vues, gestion)
- [x] Marketplace — messagerie privée acheteur/vendeur (conversations + messages temps réel)
- [x] Marketplace — signalement d'annonces frauduleuses
- [x] Marketplace — modifier annonce avec images/docs (PATCH API corrigé)
- [x] Google OAuth (connexion Google + sync photo profil)
- [x] Calculatrice hypothécaire avec SEO complet
- [x] Calculateur plex (MRB, cashflow, rendement, projection 5 ans)
- [x] Acheter ou louer (comparateur avec horizon ajustable)
- [x] Capacité d'emprunt (GDS/TDS, scénarios)
- [x] Données de marché immobilier Québec (80+ quartiers, filtres par ville)
- [x] Sauvegarde de rapports financiers (PDF/CSV export, section Finance au profil)
- [x] Page tendances (posts populaires de la semaine)
- [x] Page favoris (/favoris)
- [x] Recherche globale (posts + annonces)
- [x] Page suggestions (/suggestions) avec notifications admin
- [x] Profil avec onglets (Discussions, Annonces, Finance, Réponses)
- [x] Bottom nav mobile
- [x] Catégories étendues (construction, légal, financement, copropriété)
- [x] 20 posts seed avec commentaires + 15 utilisateurs
- [x] SEO complet (JSON-LD, sitemap, OpenGraph, FAQ)
- [x] Partage fonctionnel (natif mobile + clipboard)
- [x] Anti-bot (honeypot sur inscription, posts, annonces)
- [x] Google Analytics (GA4) + Vercel Analytics
- [x] Déployé sur Vercel + domaine nidlocal.com
- [x] Vercel Blob pour upload d'images
- [ ] Marketplace — alertes courriel (nouvelles annonces)
- [ ] Notifications email (Resend/SendGrid)
- [ ] Vérification courriel obligatoire
