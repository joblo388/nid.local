"use client";

import { useState, useEffect } from "react";

type ThemeMode = "auto" | "light" | "dark";

function getThemeCookie(): ThemeMode {
  if (typeof document === "undefined") return "auto";
  const match = document.cookie.match(/(?:^|; )theme=(\w+)/);
  const val = match?.[1];
  if (val === "light" || val === "dark") return val;
  return "auto";
}

function setThemeCookie(mode: ThemeMode) {
  document.cookie = `theme=${mode};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
}

function applyThemeClass(mode: ThemeMode) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  if (mode === "dark") root.classList.add("dark");
  else if (mode === "light") root.classList.add("light");
}

const CYCLE: ThemeMode[] = ["auto", "light", "dark"];

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("auto");

  useEffect(() => {
    const saved = getThemeCookie();
    setMode(saved);
    applyThemeClass(saved);
  }, []);

  function cycle() {
    const idx = CYCLE.indexOf(mode);
    const next = CYCLE[(idx + 1) % CYCLE.length];
    setMode(next);
    setThemeCookie(next);
    applyThemeClass(next);
  }

  return (
    <button
      onClick={cycle}
      className="flex items-center justify-center transition-opacity hover:opacity-70"
      style={{
        minHeight: "44px",
        minWidth: "44px",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--text-tertiary)",
        padding: 0,
      }}
      aria-label={
        mode === "auto" ? "Thème : automatique" :
        mode === "light" ? "Thème : clair" :
        "Thème : sombre"
      }
      title={
        mode === "auto" ? "Automatique (système)" :
        mode === "light" ? "Mode clair" :
        "Mode sombre"
      }
    >
      {mode === "light" && (
        /* Sun icon */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}
      {mode === "dark" && (
        /* Moon icon */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
      {mode === "auto" && (
        /* Auto icon — half circle */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 0 1 0 18" fill="currentColor" stroke="none" />
        </svg>
      )}
    </button>
  );
}
