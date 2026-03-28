"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();
  const isMarketplace = pathname.startsWith("/annonces");
  const isForum = !isMarketplace && !pathname.startsWith("/auth") && !pathname.startsWith("/parametres");
  const isTendances = pathname === "/tendances";
  const isPublier = pathname === "/nouveau-post" || pathname === "/annonces/publier";

  return (
    <nav className="bottom-nav">
      <Link href="/" className={isForum && !isTendances ? "active" : ""}>
        <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
        Forum
      </Link>
      <Link href="/annonces" className={isMarketplace ? "active" : ""}>
        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
        Annonces
      </Link>
      <Link href={isMarketplace ? "/annonces/publier" : "/nouveau-post"} className={isPublier ? "active" : ""}>
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
        Publier
      </Link>
      <Link href="/tendances" className={isTendances ? "active" : ""}>
        <svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
        Tendances
      </Link>
    </nav>
  );
}
