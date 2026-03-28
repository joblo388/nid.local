# nid.local — Forum immobilier québécois

Communauté immobilière du Québec. Forum de discussions, marketplace sans commission (vente + location), calculatrices financières, données de marché, répertoire de professionnels.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Typo | Geist (Google Fonts via next/font, display: swap) |
| Auth | NextAuth v5 (beta) — JWT strategy |
| ORM | Prisma 5 |
| Base de données | PostgreSQL (Neon) |
| Email | SendGrid (@sendgrid/mail) |
| Upload | Vercel Blob (fallback base64) |
| Analytics | Google Analytics (GA4) + Vercel Analytics |
| Tests | Playwright (e2e, 21 tests) |
| Langage | TypeScript 5 strict |
| Déploiement | Vercel + domaine nidlocal.com |

---

## Couleur d'accent

La couleur principale est **terracotta orange** `#D4742A` (pas le vert AI). Toutes les couleurs passent par des CSS custom properties dans `globals.css`. **Ne jamais hardcoder de couleurs** — toujours `var(--nom)`.

| Variable | Clair | Sombre |
|----------|-------|--------|
| `--green` | `#D4742A` | `#D4742A` |
| `--green-light-bg` | `#FDF0E6` | `#2D1A0A` |
| `--green-text` | `#A8511B` | `#E8A070` |

Note : les noms de variables contiennent encore "green" pour des raisons historiques, mais la couleur est orange.

---

## Dark mode

- **3 modes** : auto (système), clair, sombre
- Toggle soleil/lune/auto dans le header (ThemeToggle)
- Persisté dans un cookie "theme"
- Classes CSS : `:root.dark`, `:root.light`, ou auto via `@media (prefers-color-scheme: dark)`
- `suppressHydrationWarning` sur html/body pour éviter les mismatches

---

## Architecture des pages

### Forum / Communauté
- `/` — Homepage avec infinite scroll, pull-to-refresh mobile
- `/tendances` — Posts populaires de la semaine
- `/quartier/[slug]` — Posts d'un quartier + avis + abonnement
- `/ville/[slug]` — Posts d'une ville
- `/post/[id]` — Détail post + commentaires + sondage + posts similaires + scroll progress bar
- `/nouveau-post` — Création avec éditeur markdown + sondage optionnel
- `/villes` — Liste de toutes les villes (95 villes, 16 régions)

### Marketplace (vente + location)
- `/annonces` — Liste avec filtres (ville, type, prix, mode acheter/louer) + vue carte
- `/annonces/[id]` — Détail avec carousel photos, MLS, estimation prix, dashboard vendeur
- `/annonces/publier` — Formulaire 4 étapes (vente ou location)
- `/annonces/comparer` — Comparateur côte à côte (2-3 annonces)
- Modes : **vente** (unifamiliale, condo, duplex...5-plex, terrain, commercial) + **location** (studio, 1½ à 6½, loft)
- Max 40 images par annonce, champ MLS avec liens Centris/Realtor.ca

### Outils / Calculatrices
- `/ressources` — Hub des outils (page dédiée mobile)
- `/calculatrice-hypothecaire` — Paiements mensuels, SCHL
- `/capacite-emprunt` — GDS/TDS, scénarios
- `/calculateur-plex` — MRB, cashflow, projection 5 ans
- `/acheter-ou-louer` — Comparateur avec revenu locatif
- `/estimation` — Estimation valeur basée sur données de marché
- `/donnees-marche` — Prix médians 80+ quartiers + graphiques SVG 2020-2026
- `/comparer-quartiers` — Comparaison côte à côte de quartiers
- Toutes les calculatrices ont un bouton **Partager** (encode les valeurs dans l'URL)
- Calculatrices disponibles **offline** (service worker stale-while-revalidate)

### Répertoire professionnel
- `/repertoire` — Grille 5 colonnes de pros (courtier, notaire, finance, entrepreneur...)
- `/repertoire/[id]` — Détail pro avec votes, commentaires, contact DM/email
- Gestion d'équipe par domaine email (même domaine = même page pro)
- Stats : votes, vues, commentaires dans l'onglet Profil pro du profil utilisateur

### Profil utilisateur
- `/u/[username]` — Onglets : Discussions, Annonces, Finance, Réponses, Paramètres, Profil pro
- Paramètres et Profil pro éditables inline sans quitter la page
- Badges (8 calculés), niveau (Bronze→Légende), points, karma
- Tags professionnels affichés sur les posts et commentaires
- Historique de navigation (posts + annonces consultés)

### Auth
- Inscription avec vérification email obligatoire (SendGrid)
- Connexion email/password + Google OAuth
- Email de bienvenue automatique à l'inscription
- Réinitialisation de mot de passe par email

---

## Notifications & Email

- **SendGrid** pour tous les emails (clé dans `.env`)
- Types d'emails : vérification, bienvenue, reset password, commentaire, réponse, mention, message, alerte marketplace, baisse de prix, expert request
- **Préférences email** configurables par l'utilisateur dans Paramètres
- **Notifications in-app** : polling 30s (60s tab caché), browser Notification API
- **Alertes marketplace** : email auto quand une annonce matche les critères
- **Baisse de prix** : notifie les users qui ont favori une annonce

---

## UX Features

- **Cmd+K** command palette (recherche globale, navigation)
- **Infinite scroll** sur le homepage feed
- **Pull-to-refresh** mobile
- **Page transitions** (fade + slide-up)
- **Image lightbox** (zoom, swipe, keyboard)
- **Skeleton loading** (PostCard, ListingCard)
- **Micro-animations** (vote bounce, heart pop, badge shimmer, card lift)
- **Confetti** sur publication de post/annonce
- **Link previews** auto dans les posts/commentaires
- **Éditeur markdown** avec toolbar + aperçu
- **Posts similaires** (4 recommandations)
- **Typing indicator** dans la messagerie
- **Scroll progress bar** sur les posts longs
- **Toast notifications** (success/error/info)
- **Onboarding tour** (4 étapes pour nouveaux visiteurs)
- **Sondages** dans les posts
- **AMA** (Ask Me Anything) comme type de post

---

## Mobile

Le mobile est **simplifié à l'essentiel** :
- Header : logo + burger menu + auth
- Pas de VilleBar, QuartierBar, breadcrumb, search, catégories, tri
- Bottom nav : **Fil — Publier — Outils — Annonces**
- PostCard : vote + commentaires + bookmark (pas de tags/badges)
- Calculatrices : tout empilé verticalement (breakpoint 640px)
- Marketplace : filtres 2x2, pas de sidebar ni carte

---

## Décisions de design

- **Langue** : 100% français québécois (i18n FR/EN disponible mais FR par défaut)
- **Max-width** : `1100px` centré, `900px` marketplace, `700px` formulaires
- **Font size** : 10-14px. Pas de grands textes sauf titres.
- **Bordures** : `0.5px solid var(--border)` — jamais `1px`
- **Border-radius** : `rounded-xl` (12px) cartes, `rounded-lg` (8px) boutons
- **Images** : Vercel Blob upload, next/image avec blur placeholder, lazy loading
- **Performance** : React.memo sur PostCard, cache headers API (30s-300s), font-display swap
- **PWA** : manifest.json, service worker, offline fallback, installable sur mobile
- **Favicon** : maison noire avec porte orange + point orange (généré via Next.js ImageResponse)

---

## Modèles Prisma principaux

- `User` — auth, tag pro, préférences email, niveau/points
- `Post` — discussions forum avec sondages optionnels
- `Comment` — commentaires avec réponses imbriquées
- `Vote`, `CommentVote` — votes sur posts et commentaires
- `Listing` — annonces marketplace (vente + location), champ MLS
- `ListingImage`, `ListingDocument` — médias des annonces
- `Notification` — tous types de notifications
- `Conversation`, `Message` — messagerie privée
- `Poll`, `PollOption`, `PollVote` — sondages
- `QuartierReview` — avis sur les quartiers (5 critères)
- `QuartierSubscription` — abonnement aux quartiers
- `AlerteMarketplace` — alertes email marketplace
- `SavedSearch` — recherches marketplace sauvegardées
- `ProProfile`, `ProVote`, `ProComment` — répertoire professionnel
- `SellerReview` — avis sur les vendeurs
- `ViewHistory` — historique de navigation
- `SavedReport` — rapports calculatrices sauvegardés

---

## Seed data

- 15 utilisateurs avec tags professionnels
- 20 posts avec commentaires détaillés et votes
- Exécuter : `npx prisma db seed`

---

## Variables d'environnement (.env)

```
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
SENDGRID_API_KEY="SG.xxx"
SENDGRID_FROM_EMAIL="noreply@nidlocal.com"
NEXT_PUBLIC_SITE_URL="https://nidlocal.com"
```
