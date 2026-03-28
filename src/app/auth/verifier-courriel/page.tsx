"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function Content() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="text-center space-y-4">
      {error === "expire" ? (
        <>
          <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center"
            style={{ background: "var(--red-bg)" }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--red-text)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Lien expiré</p>
          <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
            Ce lien de vérification a expiré. Connectez-vous pour en recevoir un nouveau.
          </p>
          <Link href="/auth/connexion" className="inline-block text-[13px] font-medium transition-opacity hover:opacity-70" style={{ color: "var(--green)" }}>
            Se connecter
          </Link>
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center"
            style={{ background: "var(--blue-bg)" }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--blue-text)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Vérifiez votre courriel</p>
          <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
            Un lien de vérification vous a été envoyé. Cliquez dessus pour activer votre compte.
          </p>
          <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
            Le lien expire dans 24 heures. Vérifiez vos courriels indésirables si vous ne le trouvez pas.
          </p>
          <Link href="/" className="inline-block text-[13px] font-medium transition-opacity hover:opacity-70" style={{ color: "var(--green)" }}>
            Continuer sans vérifier →
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifierCourrielPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-page)" }}>
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="text-[22px] font-black tracking-tight">
            <span style={{ color: "var(--text-primary)" }}>nid</span>
            <span style={{ color: "var(--green)" }}>.local</span>
          </Link>
        </div>
        <div className="rounded-2xl p-8" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
          <Suspense>
            <Content />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
