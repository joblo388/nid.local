"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function Content() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const email = searchParams.get("email") ?? "";
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [resendError, setResendError] = useState("");

  async function handleResend() {
    if (!email || resending) return;
    setResending(true);
    setResendMsg("");
    setResendError("");

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setResendMsg("Courriel envoy\u00e9 ! V\u00e9rifiez votre bo\u00eete de r\u00e9ception.");
      } else {
        setResendError(data.error ?? "Une erreur est survenue.");
      }
    } catch {
      setResendError("Impossible de contacter le serveur.");
    } finally {
      setResending(false);
    }
  }

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
          <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>Lien expir\u00e9</p>
          <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
            Ce lien de v\u00e9rification a expir\u00e9. Renvoyez-en un nouveau.
          </p>
          {email ? (
            <>
              <button
                onClick={handleResend}
                disabled={resending}
                className="w-full py-2.5 rounded-lg text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: "var(--green)" }}
              >
                {resending ? "Envoi en cours..." : "Renvoyer le courriel"}
              </button>
              {resendMsg && (
                <p className="text-[12px] px-3 py-2 rounded-lg" style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}>
                  {resendMsg}
                </p>
              )}
              {resendError && (
                <p className="text-[12px] px-3 py-2 rounded-lg" style={{ background: "var(--red-bg)", color: "var(--red-text)" }}>
                  {resendError}
                </p>
              )}
            </>
          ) : (
            <Link href="/auth/connexion" className="inline-block text-[13px] font-medium transition-opacity hover:opacity-70" style={{ color: "var(--green)" }}>
              Se connecter pour renvoyer le courriel
            </Link>
          )}
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center"
            style={{ background: "var(--green-light-bg)" }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--green-text)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>V\u00e9rifiez votre bo\u00eete de r\u00e9ception</p>
          <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
            Un courriel de v\u00e9rification a \u00e9t\u00e9 envoy\u00e9{email ? ` \u00e0 ${email}` : ""}. Cliquez sur le lien pour activer votre compte.
          </p>
          <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
            Le lien expire dans 24 heures. V\u00e9rifiez vos courriels ind\u00e9sirables si vous ne le trouvez pas.
          </p>
          {email && (
            <>
              <button
                onClick={handleResend}
                disabled={resending}
                className="w-full py-2.5 rounded-lg text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: "var(--green)" }}
              >
                {resending ? "Envoi en cours..." : "Renvoyer le courriel"}
              </button>
              {resendMsg && (
                <p className="text-[12px] px-3 py-2 rounded-lg" style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}>
                  {resendMsg}
                </p>
              )}
              {resendError && (
                <p className="text-[12px] px-3 py-2 rounded-lg" style={{ background: "var(--red-bg)", color: "var(--red-text)" }}>
                  {resendError}
                </p>
              )}
            </>
          )}
          <Link href="/auth/connexion" className="inline-block text-[13px] font-medium transition-opacity hover:opacity-70" style={{ color: "var(--text-tertiary)" }}>
            Retour \u00e0 la connexion
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
        <div className="rounded-xl p-8" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
          <Suspense>
            <Content />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
