"use client";

import { useLocale } from "@/lib/useLocale";

export function LanguageSwitcher() {
  const { locale } = useLocale();

  function setLang(lang: "fr" | "en") {
    if (lang === locale) return;
    document.cookie = `locale=${lang};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
    window.location.reload();
  }

  return (
    <span className="flex items-center gap-0.5 select-none" style={{ fontSize: "12px", minHeight: "44px" }}>
      <button
        onClick={() => setLang("fr")}
        className="transition-opacity hover:opacity-70 px-1.5 py-1"
        style={{
          color: locale === "fr" ? "var(--green)" : "var(--text-tertiary)",
          fontWeight: locale === "fr" ? 700 : 400,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "12px",
          lineHeight: 1,
        }}
      >
        FR
      </button>
      <span style={{ color: "var(--text-tertiary)", fontSize: "10px" }}>/</span>
      <button
        onClick={() => setLang("en")}
        className="transition-opacity hover:opacity-70 px-1.5 py-1"
        style={{
          color: locale === "en" ? "var(--green)" : "var(--text-tertiary)",
          fontWeight: locale === "en" ? 700 : 400,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "12px",
          lineHeight: 1,
        }}
      >
        EN
      </button>
    </span>
  );
}
