"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { NotificationBell } from "./NotificationBell";

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (mobileNavRef.current && !mobileNavRef.current.contains(e.target as Node)) {
        setMobileNavOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Fermer le nav mobile lors d'un changement de route
  useEffect(() => { setMobileNavOpen(false); }, [pathname]);

  const username = session?.user?.username ?? session?.user?.name ?? session?.user?.email;
  const initial = username?.[0]?.toUpperCase() ?? "?";

  const isMarketplace = pathname.startsWith("/annonces");

  const navLinks = isMarketplace
    ? [
        { href: "/annonces", label: "Annonces" },
        { href: "/annonces/publier", label: "Publier" },
        { href: "/", label: "Forum" },
      ]
    : [
        { href: "/", label: "Fil" },
        { href: "/tendances", label: "Tendances" },
        { href: "/villes", label: "Villes" },
        { href: "/annonces", label: "Annonces" },
      ];

  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: "var(--bg-card)", borderBottom: "0.5px solid var(--border)" }}
    >
      <div className="max-w-[1100px] mx-auto px-5 h-[52px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href={isMarketplace ? "/annonces" : "/"} className="flex items-center gap-2 shrink-0">
          <span className="text-[18px] font-black tracking-tight leading-none">
            <span style={{ color: "var(--text-primary)" }}>nid</span>
            <span style={{ color: "var(--green)" }}>.local</span>
          </span>
          {isMarketplace && (
            <span
              className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md"
              style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}
            >
              Marketplace
            </span>
          )}
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-5 text-[13px] font-medium">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-opacity hover:opacity-60"
              style={{ color: "var(--text-secondary)" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right zone */}
        <div className="flex items-center gap-2">
          {/* Burger mobile */}
          <div className="relative md:hidden" ref={mobileNavRef}>
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-opacity hover:opacity-70"
              style={{ color: "var(--text-secondary)" }}
              aria-label="Menu"
            >
              {mobileNavOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {mobileNavOpen && (
              <div
                className="absolute left-0 top-full mt-2 w-[200px] rounded-xl overflow-hidden py-1 z-50"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
              >
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block px-4 py-2.5 text-[14px] font-medium transition-colors hover-bg"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {l.label}
                  </Link>
                ))}
                <div style={{ borderTop: "0.5px solid var(--border)" }} className="mt-1 pt-1">
                  <Link
                    href="/nouveau-post"
                    className="block px-4 py-2.5 text-[14px] font-semibold transition-colors hover-bg"
                    style={{ color: "var(--green)" }}
                  >
                    + Nouvelle discussion
                  </Link>
                </div>
                {!session && status !== "loading" && (
                  <div style={{ borderTop: "0.5px solid var(--border)" }} className="mt-1 pt-1">
                    <Link
                      href={`/auth/connexion?callbackUrl=${encodeURIComponent(pathname)}`}
                      className="block px-4 py-2.5 text-[14px] font-medium transition-colors hover-bg"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Se connecter
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full animate-pulse" style={{ background: "var(--bg-secondary)" }} />
          ) : session ? (
            <>
              <NotificationBell />
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 rounded-full transition-opacity hover:opacity-80"
                >
                  {session.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt={username ?? ""}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold text-white"
                      style={{ background: "var(--green)" }}
                    >
                      {initial}
                    </div>
                  )}
                </button>

                {menuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-[200px] rounded-xl overflow-hidden py-1 z-50"
                    style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
                  >
                    <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
                      <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
                        @{username}
                      </p>
                      <p className="text-[11px] truncate" style={{ color: "var(--text-tertiary)" }}>
                        {session.user?.email}
                      </p>
                    </div>
                    <Link
                      href={`/u/${username}`}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-[13px] transition-colors hover-bg"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Mon profil
                    </Link>
                    <Link
                      href="/favoris"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-[13px] transition-colors hover-bg"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Mes favoris
                    </Link>
                    <Link
                      href="/parametres"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-[13px] transition-colors hover-bg"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Paramètres
                    </Link>
                    <div style={{ borderTop: "0.5px solid var(--border)" }} className="my-1" />
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left px-4 py-2.5 text-[13px] transition-colors hover-bg"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href={`/auth/connexion?callbackUrl=${encodeURIComponent(pathname)}`}
                className="hidden md:block text-[13px] font-medium transition-opacity hover:opacity-60"
                style={{ color: "var(--text-secondary)" }}
              >
                Se connecter
              </Link>
              <Link
                href="/auth/inscription"
                className="text-[13px] font-semibold text-white px-3.5 py-1.5 rounded-lg transition-opacity hover:opacity-90"
                style={{ background: "var(--green)" }}
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
