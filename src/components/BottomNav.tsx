"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isForum = !pathname.startsWith("/annonces") && !pathname.startsWith("/auth") && !pathname.startsWith("/parametres");
  const isPublier = pathname === "/nouveau-post" || pathname === "/annonces/publier";
  const isProfile = pathname.startsWith("/u/") || pathname === "/parametres" || pathname === "/notifications" || pathname === "/messages" || pathname === "/favoris";

  const username = session?.user?.username ?? session?.user?.name;

  return (
    <nav className="bottom-nav">
      <Link href="/" className={isForum && !isPublier && !isProfile ? "active" : ""}>
        <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
        Fil
      </Link>
      <Link href="/nouveau-post" className={isPublier ? "active" : ""}>
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
        Publier
      </Link>
      {session ? (
        <Link href={username ? `/u/${username}` : "/parametres"} className={isProfile ? "active" : ""}>
          <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          Profil
        </Link>
      ) : (
        <Link href={`/auth/connexion?callbackUrl=${encodeURIComponent(pathname)}`} className="">
          <svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
          Connexion
        </Link>
      )}
    </nav>
  );
}
