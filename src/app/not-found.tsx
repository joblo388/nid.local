import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-page)" }}>
      <div className="text-center space-y-4">
        <p className="text-[72px] font-black leading-none" style={{ color: "var(--border-secondary)" }}>404</p>
        <h1 className="text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>
          Page introuvable
        </h1>
        <p className="text-[14px]" style={{ color: "var(--text-tertiary)" }}>
          Cette page n&apos;existe pas ou a été supprimée.
        </p>
        <Link
          href="/"
          className="inline-block mt-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--green)" }}
        >
          Retour au fil
        </Link>
      </div>
    </div>
  );
}
