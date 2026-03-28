export type Locale = "fr" | "en";

const translations: Record<Locale, Record<string, string>> = {
  fr: {
    // Navigation
    "nav.fil": "Fil",
    "nav.tendances": "Tendances",
    "nav.villes": "Villes",
    "nav.annonces": "Annonces",
    "nav.communaute": "Communaut\u00e9",
    "nav.publier": "Publier",
    "nav.marketplace": "Marketplace",

    // Auth
    "auth.connexion": "Se connecter",
    "auth.inscription": "S\u2019inscrire",
    "auth.deconnexion": "Se d\u00e9connecter",

    // Common UI
    "common.parametres": "Param\u00e8tres",
    "common.profil": "Mon profil",
    "common.messages": "Messages",
    "common.favoris": "Mes favoris",
    "common.nouvelle_discussion": "Nouvelle discussion",
    "common.toutes_villes": "Toutes les villes",

    // Sidebar
    "sidebar.ressources": "Ressources utiles",
    "sidebar.villes_actives": "Villes actives",
    "sidebar.quartiers_actifs": "Quartiers actifs",
    "sidebar.communaute": "Communaut\u00e9",
    "sidebar.membres": "Membres",
    "sidebar.discussions": "Discussions",
    "sidebar.vues_totales": "Vues totales",
    "sidebar.reponses": "R\u00e9ponses",

    // Footer
    "footer.copyright": "\u00a9 2026 nid.local \u2014 Fait au Qu\u00e9bec",
  },
  en: {
    // Navigation
    "nav.fil": "Feed",
    "nav.tendances": "Trending",
    "nav.villes": "Cities",
    "nav.annonces": "Listings",
    "nav.communaute": "Community",
    "nav.publier": "Post",
    "nav.marketplace": "Marketplace",

    // Auth
    "auth.connexion": "Sign in",
    "auth.inscription": "Sign up",
    "auth.deconnexion": "Sign out",

    // Common UI
    "common.parametres": "Settings",
    "common.profil": "My profile",
    "common.messages": "Messages",
    "common.favoris": "My favorites",
    "common.nouvelle_discussion": "New discussion",
    "common.toutes_villes": "All cities",

    // Sidebar
    "sidebar.ressources": "Useful resources",
    "sidebar.villes_actives": "Active cities",
    "sidebar.quartiers_actifs": "Active neighborhoods",
    "sidebar.communaute": "Community",
    "sidebar.membres": "Members",
    "sidebar.discussions": "Discussions",
    "sidebar.vues_totales": "Total views",
    "sidebar.reponses": "Replies",

    // Footer
    "footer.copyright": "\u00a9 2026 nid.local \u2014 Made in Quebec",
  },
};

/**
 * Translate a key for the given locale.
 * Returns the key itself if no translation is found.
 */
export function t(key: string, locale: Locale = "fr"): string {
  return translations[locale]?.[key] ?? translations.fr[key] ?? key;
}

/**
 * Read the locale from the "locale" cookie (server-safe: pass document.cookie or headers cookie string).
 * Defaults to "fr".
 */
export function getLocaleFromCookie(cookieString: string): Locale {
  const match = cookieString.match(/(?:^|;\s*)locale=(fr|en)/);
  return (match?.[1] as Locale) ?? "fr";
}
