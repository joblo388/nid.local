"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/useLocale";

export default function MotDePasseOubliePage() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? t("auth.error_generic"));
        return;
      }
      setSubmitted(true);
    } catch {
      setError(t("auth.error_generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-page)" }}>
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="text-[22px] font-black tracking-tight">
            <span style={{ color: "var(--text-primary)" }}>nid</span>
            <span style={{ color: "var(--green)" }}>.local</span>
          </Link>
          <p className="text-[13px] mt-2" style={{ color: "var(--text-tertiary)" }}>
            {t("auth.reset_password")}
          </p>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
        >
          {submitted ? (
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
                {t("auth.email_sent")}
              </p>
              <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
                {t("auth.email_sent_desc")}
              </p>
              <Link
                href="/auth/connexion"
                className="inline-block mt-2 text-[13px] font-medium transition-opacity hover:opacity-70"
                style={{ color: "var(--green)" }}
              >
                {t("auth.back_to_login")}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
                {t("auth.reset_desc")}
              </p>
              <div>
                <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  {t("auth.email")}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.email_placeholder")}
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
                {loading ? t("auth.sending") : t("auth.send_link")}
              </button>
            </form>
          )}
        </div>

        {!submitted && (
          <p className="text-center text-[13px] mt-5" style={{ color: "var(--text-tertiary)" }}>
            <Link href="/auth/connexion" className="font-semibold transition-opacity hover:opacity-70" style={{ color: "var(--green)" }}>
              {t("auth.back_to_login")}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
