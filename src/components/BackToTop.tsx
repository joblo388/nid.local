"use client";
import { useState, useEffect } from "react";
import { useLocale } from "@/lib/useLocale";

export function BackToTop() {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t("backtotop")}
      className="fixed z-50 flex items-center justify-center w-10 h-10 rounded-full transition-opacity"
      style={{
        bottom: 80, right: 20,
        background: "var(--bg-card)", border: "0.5px solid var(--border)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={2}><path d="M2 9l5-5 5 5"/></svg>
    </button>
  );
}
