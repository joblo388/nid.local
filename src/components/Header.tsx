import Link from "next/link";

export function Header() {
  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: "var(--bg-card)", borderBottom: "0.5px solid var(--border)" }}
    >
      <div className="max-w-[1100px] mx-auto px-5 h-[52px] flex items-center justify-between gap-4">
        <Link href="/" className="text-[18px] font-black tracking-tight leading-none">
          <span style={{ color: "var(--text-primary)" }}>nid</span>
          <span style={{ color: "var(--green)" }}>.local</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-[13px] font-medium">
          <Link href="/" className="transition-opacity hover:opacity-60" style={{ color: "var(--text-secondary)" }}>
            Fil
          </Link>
          <Link href="/quartiers" className="transition-opacity hover:opacity-60" style={{ color: "var(--text-secondary)" }}>
            Quartiers
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            className="hidden md:block text-[13px] font-medium transition-opacity hover:opacity-60"
            style={{ color: "var(--text-secondary)" }}
          >
            Se connecter
          </button>
          <button
            className="text-[13px] font-semibold text-white px-3.5 py-1.5 rounded-lg transition-opacity hover:opacity-90"
            style={{ background: "var(--green)" }}
          >
            S&apos;inscrire
          </button>
        </div>
      </div>
    </header>
  );
}
