"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/lib/useLocale";

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const rawCallback = searchParams.get("callbackUrl") ?? "/";
  const callbackUrl = rawCallback.startsWith("/") && !rawCallback.startsWith("//") ? rawCallback : "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.code === "email_not_verified" || res?.error?.includes("email_not_verified")) {
        setError("email_not_verified");
        setLoading(false);
        return;
      }

      if (res?.error) {
        setError(t("auth.error_credentials"));
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError(t("auth.error_generic"));
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "var(--bg-page)" }}>
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="text-[22px] font-black tracking-tight">
            <span style={{ color: "var(--text-primary)" }}>nid</span>
            <span style={{ color: "var(--green)" }}>.local</span>
          </Link>
          <p className="text-[13px] mt-2" style={{ color: "var(--text-tertiary)" }}>
            {t("auth.connexion")}
          </p>
        </div>

        <div
          className="rounded-xl p-6 space-y-4"
          style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
        >
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl text-[14px] font-medium transition-opacity hover:opacity-80"
            style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "0.5px solid var(--border)" }}
          >
            <GoogleIcon />
            {t("auth.google")}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-[0.5px]" style={{ background: "var(--border)" }} />
            <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{t("common.ou")}</span>
            <div className="flex-1 h-[0.5px]" style={{ background: "var(--border)" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>
                  {t("auth.password")}
                </label>
                <Link
                  href="/auth/mot-de-passe-oublie"
                  className="text-[11px] transition-opacity hover:opacity-70"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {t("auth.forgot_password")}
                </Link>
              </div>
              <input
                type="password"
                required
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

            {error && error !== "email_not_verified" && error !== "verification_sent" && (
              <p className="text-[12px] px-3 py-2 rounded-lg" style={{ background: "var(--red-bg)", color: "var(--red-text)" }}>
                {error}
              </p>
            )}
            {error === "email_not_verified" && (
              <div className="px-3 py-3 rounded-lg space-y-2" style={{ background: "var(--amber-bg)", border: "0.5px solid var(--amber-text)" }}>
                <p className="text-[12px] font-semibold" style={{ color: "var(--amber-text)" }}>
                  {t("auth.verify_email")}
                </p>
                <p className="text-[11px]" style={{ color: "var(--amber-text)" }}>
                  {t("auth.verify_email_desc")}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      setError("");
                      try {
                        const r = await fetch("/api/auth/resend-verification", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email }),
                        });
                        if (r.ok) setError("verification_sent");
                        else setError(t("auth.error_generic"));
                      } catch {
                        setError(t("auth.error_generic"));
                      }
                    }}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-lg"
                    style={{ background: "var(--green)", color: "#fff", border: "none", cursor: "pointer" }}
                  >
                    {t("auth.resend")}
                  </button>
                </div>
              </div>
            )}
            {error === "verification_sent" && (
              <p className="text-[12px] px-3 py-2 rounded-lg" style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}>
                {t("auth.reset_sent")}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: "var(--green)" }}
            >
              {loading ? t("auth.loading") : t("auth.connexion")}
            </button>
          </form>
        </div>

        <p className="text-center text-[13px] mt-5" style={{ color: "var(--text-tertiary)" }}>
          {t("auth.no_account")}{" "}
          <Link href="/auth/inscription" className="font-semibold transition-opacity hover:opacity-70" style={{ color: "var(--green)" }}>
            {t("auth.inscription")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense>
      <ConnexionForm />
    </Suspense>
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
