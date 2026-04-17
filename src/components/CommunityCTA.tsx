import Link from "next/link";
import { getServerLocale } from "@/lib/serverLocale";
import { ctaContent } from "./CommunityCTA.content";

interface CommunityCTAProps {
  titre?: string;
  description?: string;
  contexte?: "hypotheque" | "plex" | "achat" | "estimation" | "donnees" | "quartiers" | "taxe" | "general";
}

export async function CommunityCTA({ titre, description, contexte = "general" }: CommunityCTAProps) {
  const locale = await getServerLocale();
  const c = ctaContent[locale];
  const msg = c.contexts[contexte];
  const finalTitre = titre || msg.titre;
  const finalDesc = description || msg.description;

  return (
    <div
      className="rounded-xl p-6 space-y-4"
      style={{ background: "var(--green-light-bg)", border: "0.5px solid var(--border)" }}
    >
      <div className="text-center space-y-2">
        <h2 className="text-[16px] font-bold" style={{ color: "var(--green-text)" }}>
          {finalTitre}
        </h2>
        <p className="text-[13px] leading-relaxed max-w-lg mx-auto" style={{ color: "var(--green-text)", opacity: 0.85 }}>
          {finalDesc}
        </p>
      </div>

      <div className="flex items-center justify-center gap-6 py-2">
        {c.stats.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <svg className="w-4 h-4" style={{ color: "var(--green-text)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="text-[12px] font-medium" style={{ color: "var(--green-text)" }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link
          href="/nouveau-post"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--green)" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {c.askQuestion}
        </Link>
        <Link
          href="/auth/inscription"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-80"
          style={{ background: "var(--bg-card)", color: "var(--green-text)", border: "0.5px solid var(--border)" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          {c.createAccount}
        </Link>
      </div>

      <p className="text-[11px] text-center" style={{ color: "var(--green-text)", opacity: 0.6 }}>
        {c.signupNote}
      </p>
    </div>
  );
}
