"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
// signIn is still used for Google OAuth button
import Link from "next/link";

export default function InscriptionPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (username.length < 3 || username.length > 20)
      return setError("Le nom d'utilisateur doit faire entre 3 et 20 caractères.");
    if (!/^[a-z0-9_]+$/.test(username))
      return setError("Nom d'utilisateur invalide (lettres, chiffres, _ seulement).");
    if (password.length < 8)
      return setError("Le mot de passe doit faire au moins 8 caractères.");

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, website }),
      });

      const text = await res.text();
      let data: { error?: string; success?: boolean } = {};
      try { data = JSON.parse(text); } catch { /* HTML error page */ }

      if (!res.ok) {
        setError(data.error ?? `Erreur ${res.status} — vérifie la console du serveur.`);
        setLoading(false);
        return;
      }

      // Rediriger vers la page de vérification courriel
      router.push(`/auth/verifier-courriel?email=${encodeURIComponent(email)}`);
    } catch {
      setError("Impossible de contacter le serveur.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-page)" }}>
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-[22px] font-black tracking-tight">
            <span style={{ color: "var(--text-primary)" }}>nid</span>
            <span style={{ color: "var(--green)" }}>.local</span>
          </Link>
          <p className="text-[13px] mt-2" style={{ color: "var(--text-tertiary)" }}>
            Rejoignez la communauté québécoise
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
        >
          {/* Google */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl text-[14px] font-medium transition-opacity hover:opacity-80"
            style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "0.5px solid var(--border)" }}
          >
            <GoogleIcon />
            Continuer avec Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-[0.5px]" style={{ background: "var(--border)" }} />
            <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>ou</span>
            <div className="flex-1 h-[0.5px]" style={{ background: "var(--border)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Nom d&apos;utilisateur
              </label>
              <div className="relative">
                <span
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] select-none"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  @
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  placeholder="votre_pseudo"
                  maxLength={20}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl text-[14px] outline-none transition-all"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "0.5px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              <p className="text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                Lettres, chiffres et _ · 3–20 caractères
              </p>
            </div>

            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Courriel
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none transition-all"
                style={{
                  background: "var(--bg-secondary)",
                  border: "0.5px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 caractères"
                className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none transition-all"
                style={{
                  background: "var(--bg-secondary)",
                  border: "0.5px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* Honeypot — invisible to humans, bots fill it */}
            <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true" tabIndex={-1}>
              <label>Website</label>
              <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} autoComplete="off" tabIndex={-1} />
            </div>

            {error && (
              <p className="text-[12px] px-3 py-2 rounded-lg" style={{ background: "var(--red-bg)", color: "var(--red-text)" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: "var(--green)" }}
            >
              {loading ? "Création du compte..." : "Créer mon compte"}
            </button>
          </form>

          <p className="text-[11px] text-center" style={{ color: "var(--text-tertiary)" }}>
            En créant un compte, vous acceptez les conditions d&apos;utilisation.
          </p>
        </div>

        <p className="text-center text-[13px] mt-5" style={{ color: "var(--text-tertiary)" }}>
          Déjà un compte ?{" "}
          <Link href="/auth/connexion" className="font-semibold transition-opacity hover:opacity-70" style={{ color: "var(--green)" }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
    </svg>
  );
}
