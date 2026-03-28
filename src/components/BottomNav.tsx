"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isMarketplace = pathname.startsWith("/annonces");
  const isForum = !isMarketplace && !pathname.startsWith("/auth") && !pathname.startsWith("/parametres") && !pathname.startsWith("/ressources");
  const isPublier = pathname === "/nouveau-post" || pathname === "/annonces/publier";
  const isOutils = pathname === "/ressources" || pathname.startsWith("/calculatrice") || pathname.startsWith("/capacite") || pathname.startsWith("/calculateur") || pathname.startsWith("/acheter") || pathname.startsWith("/donnees") || pathname.startsWith("/estimation") || pathname === "/repertoire";

  return (
    <nav className="bottom-nav">
      <Link href="/" className={isForum && !isPublier ? "active" : ""}>
        <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
        Fil
      </Link>
      <Link href="/nouveau-post" className={isPublier ? "active" : ""} data-tour="publier-mobile">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
        Publier
      </Link>
      <Link href="/ressources" className={isOutils ? "active" : ""} data-tour="outils">
        <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>
        Outils
      </Link>
      <Link href="/annonces" className={isMarketplace ? "active" : ""}>
        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
        Annonces
      </Link>
    </nav>
  );
}
