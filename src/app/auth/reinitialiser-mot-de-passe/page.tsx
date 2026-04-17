"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/lib/useLocale";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLocale();
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
          {t("auth.invalid_link")}
        </p>
        <Link href="/auth/mot-de-passe-oublie" className="text-[13px] font-medium underline" style={{ color: "var(--green)" }}>
          {t("auth.request_new_link")}
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError(t("auth.passwords_mismatch"));
      return;
    }
    if (password.length < 8) {
      setError(t("auth.password_min"));
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
        setError(data.error ?? t("auth.error_generic"));
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/auth/connexion"), 2500);
    } catch {
      setError(t("auth.error_generic"));
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
          {t("auth.password_updated")}
        </p>
        <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
          {t("auth.redirecting")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
          {t("auth.new_password")}
        </label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
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
          {t("auth.confirm_password")}
        </label>
        <input
          type="password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
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
        {loading ? t("auth.loading") : t("auth.reset_password")}
      </button>
    </form>
  );
}

export default function ReinitialiserMotDePassePage() {
  const { t } = useLocale();
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-page)" }}>
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="text-[22px] font-black tracking-tight">
            <span style={{ color: "var(--text-primary)" }}>nid</span>
            <span style={{ color: "var(--green)" }}>.local</span>
          </Link>
          <p className="text-[13px] mt-2" style={{ color: "var(--text-tertiary)" }}>
            {t("auth.new_password_choose")}
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
