"use client";

import { useState } from "react";
import { ConciergeModal } from "@/components/ConciergeModal";

export function ConciergeCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "var(--amber-bg)",
          border: "0.5px solid var(--amber-text)",
        }}
      >
        <div className="px-4 py-4">
          <h3
            className="text-[13px] font-semibold leading-snug"
            style={{ color: "var(--text-primary)" }}
          >
            On publie votre annonce pour vous
          </h3>
          <p
            className="text-[11px] font-medium mt-0.5"
            style={{ color: "var(--amber-text)" }}
          >
            Gratuit, réponse en 24h
          </p>
          <p
            className="text-[11px] mt-2 leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Envoyez-nous les infos de votre propriété et on s&apos;occupe de
            créer une belle annonce pour vous.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="btn-press"
            style={{
              marginTop: 10,
              width: "100%",
              fontSize: 12,
              fontWeight: 600,
              padding: "8px 0",
              borderRadius: 9999,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              background: "var(--amber-text)",
              color: "#fff",
              transition: "opacity 0.15s",
            }}
          >
            Soumettre ma propriété
          </button>
        </div>
      </div>

      <ConciergeModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
