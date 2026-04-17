"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLocale } from "@/lib/useLocale";

export function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t } = useLocale();
  const isLoggedIn = !!session;
  const isMarketplace = pathname.startsWith("/annonces");
  const isForum = !isMarketplace && !pathname.startsWith("/auth") && !pathname.startsWith("/parametres") && !pathname.startsWith("/ressources");
  const isPublier = pathname === "/nouveau-post" || pathname === "/annonces/publier";
  const isOutils = pathname === "/ressources" || pathname.startsWith("/calculatrice") || pathname.startsWith("/capacite") || pathname.startsWith("/calculateur") || pathname.startsWith("/acheter") || pathname.startsWith("/donnees") || pathname.startsWith("/estimation") || pathname === "/repertoire";

  return (
    <nav className="bottom-nav">
      <Link href="/" className={isForum && !isPublier ? "active" : ""}>
        <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
        {t("bottomnav.fil")}
      </Link>
      <Link href={isLoggedIn ? "/nouveau-post" : "/auth/inscription"} className={isPublier ? "active" : ""} data-tour="publier-mobile">
        {isLoggedIn ? (
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
        )}
        {isLoggedIn ? t("bottomnav.publier") : t("bottomnav.rejoindre")}
      </Link>
      <Link href="/ressources" className={isOutils ? "active" : ""} data-tour="outils">
        <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>
        {t("bottomnav.outils")}
      </Link>
      <Link href="/annonces" className={isMarketplace ? "active" : ""}>
        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
        {t("bottomnav.annonces")}
      </Link>
    </nav>
  );
}
