"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="text-center space-y-3">
        <p className="text-[14px]" style={{ color: "var(--red-text)" }}>
          Lien invalide ou expiré.
        </p>
        <Link href="/auth/mot-de-passe-oublie" className="text-[13px] font-medium underline" style={{ color: "var(--green)" }}>
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/auth/connexion"), 2500);
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="text-center space-y-3">
        <div
          className="w-12 h-12 rounded-full mx-auto flex items-center justify-center"
          style={{ background: "var(--green-light-bg)" }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--green)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>
          Mot de passe mis à jour
        </p>
        <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
          Redirection vers la connexion…
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
          Nouveau mot de passe
        </label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
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
          Confirmer le mot de passe
        </label>
        <input
          type="password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
          className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none transition-all"
          style={{
            background: "var(--bg-secondary)",
            border: "0.5px solid var(--border)",
            color: "var(--text-primary)",
          }}
        />
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
        {loading ? "Mise à jour..." : "Réinitialiser le mot de passe"}
      </button>
    </form>
  );
}

export default function ReinitialiserMotDePassePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-page)" }}>
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="text-[22px] font-black tracking-tight">
            <span style={{ color: "var(--text-primary)" }}>nid</span>
            <span style={{ color: "var(--green)" }}>.local</span>
          </Link>
          <p className="text-[13px] mt-2" style={{ color: "var(--text-tertiary)" }}>
            Choisir un nouveau mot de passe
          </p>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
        >
          <Suspense>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
