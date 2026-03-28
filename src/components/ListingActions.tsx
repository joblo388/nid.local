"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  listingId: string;
  statut: string;
};

export function ListingActions({ listingId, statut: initialStatut }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<"view" | "delete" | "status">("view");
  const [loading, setLoading] = useState(false);
  const [statut, setStatut] = useState(initialStatut);

  async function handleStatusChange(newStatut: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/annonces/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: newStatut }),
      });
      if (res.ok) {
        setStatut(newStatut);
        setMode("view");
        window.location.reload();
      }
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/annonces/${listingId}`, { method: "DELETE" });
      if (res.ok) router.push("/annonces");
    } catch { /* ignore */ }
    setLoading(false);
  }

  if (mode === "status") {
    return (
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "0.5px solid var(--border)" }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Changer le statut</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {statut !== "active" && (
            <button onClick={() => handleStatusChange("active")} disabled={loading} style={{ fontSize: 12, padding: "7px 14px", borderRadius: 8, background: "var(--green)", color: "white", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
              Remettre active
            </button>
          )}
          {statut !== "vendu" && (
            <button onClick={() => handleStatusChange("vendu")} disabled={loading} style={{ fontSize: 12, padding: "7px 14px", borderRadius: 8, background: "var(--green-light-bg)", color: "var(--green-text)", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
              Marquer vendu
            </button>
          )}
          {statut !== "retire" && (
            <button onClick={() => handleStatusChange("retire")} disabled={loading} style={{ fontSize: 12, padding: "7px 14px", borderRadius: 8, background: "var(--bg-secondary)", color: "var(--text-tertiary)", border: "0.5px solid var(--border)", cursor: "pointer", fontFamily: "inherit" }}>
              Retirer
            </button>
          )}
          <button onClick={() => setMode("view")} style={{ fontSize: 12, color: "var(--text-tertiary)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Annuler</button>
        </div>
      </div>
    );
  }

  if (mode === "delete") {
    return (
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "0.5px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Supprimer définitivement ?</span>
        <button onClick={handleDelete} disabled={loading} style={{ fontSize: 12, padding: "6px 14px", borderRadius: 8, background: "var(--red-text)", color: "white", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
          {loading ? "…" : "Confirmer"}
        </button>
        <button onClick={() => setMode("view")} style={{ fontSize: 12, color: "var(--text-tertiary)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Annuler</button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "0.5px solid var(--border)", display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Link
        href={`/annonces/${listingId}/modifier`}
        style={{ fontSize: 12, padding: "7px 14px", borderRadius: 8, background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "0.5px solid var(--border)", textDecoration: "none", fontWeight: 500 }}
      >
        Modifier
      </Link>
      <button
        onClick={() => setMode("status")}
        style={{ fontSize: 12, padding: "7px 14px", borderRadius: 8, background: "var(--green-light-bg)", color: "var(--green-text)", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}
      >
        {statut === "active" ? "Marquer vendu" : statut === "vendu" ? "Remettre active" : "Changer statut"}
      </button>
      <button
        onClick={() => setMode("delete")}
        style={{ fontSize: 12, padding: "7px 14px", borderRadius: 8, background: "transparent", color: "var(--red-text)", border: "none", cursor: "pointer", fontFamily: "inherit" }}
      >
        Supprimer
      </button>
    </div>
  );
}
