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
| Base de données | SQLite (dev) — `prisma/dev.db` |
| Langage | TypeScript 5 strict |

---

## Structure des fichiers

```
src/
├── app/
│   ├── page.tsx                    # Homepage (passe les posts à HomepageView)
│   ├── layout.tsx                  # Root layout — SessionProvider, Geist, globals.css
│   ├── globals.css                 # CSS custom properties (couleurs + dark mode)
│   ├── villes/page.tsx             # Liste de toutes les villes groupées par région
│   ├── ville/[slug]/page.tsx       # Page d'une ville + ses quartiers + ses posts
│   ├── quartiers/page.tsx          # Liste de tous les quartiers groupés par ville
│   ├── quartier/[slug]/page.tsx    # Page d'un quartier + ses posts
│   ├── post/[id]/page.tsx          # Détail d'un post (commentaires = placeholder)
│   ├── auth/
│   │   ├── connexion/page.tsx      # Login email/password + Google OAuth
│   │   └── inscription/page.tsx    # Inscription avec validation + auto sign-in
│   └── api/
│       ├── auth/[...nextauth]/     # Handler NextAuth (GET + POST)
│       └── auth/register/          # POST — créer un compte (hash bcryptjs)
├── components/
│   ├── Header.tsx                  # Navbar sticky — logo, nav, menu utilisateur
│   ├── HomepageView.tsx            # Fil principal — filtres ville/quartier/catégorie/recherche
│   ├── PostCard.tsx                # Carte de post avec highlighting de recherche
│   ├── Sidebar.tsx                 # Sidebar droite — stats, villes actives, ressources
│   ├── SessionProvider.tsx         # Wrapper client NextAuth SessionProvider
│   ├── QuartierBadge.tsx           # Badge quartier (non utilisé pour l'instant)
│   └── FiltreBar.tsx               # Barre de filtres (non utilisé pour l'instant)
├── lib/
│   ├── data.ts                     # Données statiques: 18 villes, ~85 quartiers, 12 posts démo
│   ├── types.ts                    # Types TypeScript: Ville, Quartier, Post, Categorie
│   └── prisma.ts                   # Singleton PrismaClient
├── types/
│   └── next-auth.d.ts              # Extension du type Session (id, username)
└── auth.ts                         # Config NextAuth — providers, callbacks JWT/session
prisma/
├── schema.prisma                   # Modèles: User, Account, Session, VerificationToken
└── dev.db                          # Base SQLite de développement
```

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
- Exception autorisée: les couleurs de quartier (`couleur: string` dans `Quartier`) utilisent des classes Tailwind Tailwind (`bg-rose-500`, etc.) car elles servent uniquement de points de couleur décoratifs (petits ronds `w-1.5 h-1.5`).
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
  nbCommentaires: number; nbVotes: number; nbVues: number; epingle?: boolean;
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
| `alerte` | Alerte |

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
- Footer: votes, commentaires, vues avec icônes SVG inline.

### Sidebar
- Visible uniquement `md:` et plus, largeur fixe `220px`.
- CTA "Nouvelle discussion" en pleine largeur, vert.
- Listes de villes/quartiers actifs avec points de couleur.

### Pages auth
- Formulaires centrés, max-width étroit.
- Erreurs affichées inline sous les champs.
- Bouton Google OAuth présent mais désactivé (clés non configurées).
- Après inscription réussie: auto sign-in + redirection vers `/`.

### Données actuelles
- Posts, villes et quartiers sont des **données statiques** dans `src/lib/data.ts`.
- La base de données Prisma contient seulement les **utilisateurs et sessions**.
- Les posts ne sont pas encore persistés en DB.

---

## État d'avancement

- [x] Structure de navigation (villes, quartiers, posts)
- [x] Fil de discussions avec filtres et recherche
- [x] Auth (inscription, connexion, session, déconnexion)
- [x] Dark mode automatique
- [ ] Création de posts (non implémentée)
- [ ] Commentaires (placeholder seulement)
- [ ] Posts en base de données (toujours en mock data)
- [ ] Google OAuth (clés non configurées)
