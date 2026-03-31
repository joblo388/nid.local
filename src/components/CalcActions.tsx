"use client";

import { useState } from "react";

export function CalcActions() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      /* fallback silencieux */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="flex items-center justify-between rounded-lg mt-4"
      style={{
        background: "var(--bg-secondary)",
        border: "0.5px solid var(--border)",
        padding: "14px 16px",
      }}
    >
      <p
        className="text-[13px] font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        Garder une trace de ce calcul
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="rounded-lg text-[12px] font-medium transition-colors"
          style={{
            padding: "6px 12px",
            border: "0.5px solid var(--border)",
            background: "transparent",
            color: "var(--text-secondary)",
            cursor: "pointer",
          }}
        >
          {copied ? "Lien copi\u00e9!" : "Copier le lien"}
        </button>
        <button
          onClick={() => window.print()}
          className="rounded-lg text-[12px] font-medium transition-colors"
          style={{
            padding: "6px 12px",
            border: "0.5px solid var(--border)",
            background: "transparent",
            color: "var(--text-secondary)",
            cursor: "pointer",
          }}
        >
          Imprimer
        </button>
      </div>
    </div>
  );
}
