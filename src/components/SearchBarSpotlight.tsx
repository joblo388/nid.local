"use client";

import { useState, useEffect } from "react";

export function SearchBarSpotlight() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="hidden lg:block flex-1 max-w-[480px] h-[36px]" />;
  }

  return (
    <button
      onClick={() =>
        document.dispatchEvent(
          new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
        )
      }
      className="hidden lg:flex items-center gap-2 flex-1 max-w-[480px] px-4 py-2 rounded-xl transition-colors hover:opacity-80"
      style={{
        background: "var(--bg-secondary)",
        border: "0.5px solid var(--border)",
        cursor: "text",
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--text-tertiary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <span className="flex-1 text-left text-[13px]" style={{ color: "var(--text-tertiary)" }}>
        Rechercher sur nid.local...
      </span>
      <span
        className="text-[11px] font-medium px-1.5 py-0.5 rounded"
        style={{
          background: "var(--bg-page)",
          border: "0.5px solid var(--border)",
          color: "var(--text-tertiary)",
        }}
      >
        ⌘K
      </span>
    </button>
  );
}
