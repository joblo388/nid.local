"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export function SuggestionForm() {
  const { data: session } = useSession();
  const [sujet, setSujet] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [erreur, setErreur] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setLoading(true);
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sujet, message, email: session?.user?.email ?? email }),
      });
      const data = await res.json();
      if (!res.ok) { setErreur(data.error ?? "Erreur"); return; }
      setSent(true);
    } catch {
      setErreur("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--green-light-bg)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--green-text)" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 6, color: "var(--text-primary)" }}>Merci pour ta suggestion!</div>
        <div style={{ fontSize: 13, color: "var(--text-tertiary)" }}>L&apos;équipe nid.local va la lire et y répondre si nécessaire.</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {!session && (
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)", marginBottom: 5, display: "block" }}>Votre courriel <span style={{ fontWeight: 400 }}>(optionnel — pour qu&apos;on puisse vous répondre)</span></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@courriel.com"
              style={{ width: "100%", fontSize: 13, padding: "10px 12px", borderRadius: 8, border: "0.5px solid var(--border-secondary)", background: "var(--bg-card)", color: "var(--text-primary)", fontFamily: "inherit", outline: "none" }}
            />
          </div>
        )}

        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)", marginBottom: 5, display: "block" }}>Sujet</label>
          <select
            value={sujet}
            onChange={(e) => setSujet(e.target.value)}
            required
            style={{ width: "100%", fontSize: 13, padding: "10px 12px", borderRadius: 8, border: "0.5px solid var(--border-secondary)", background: "var(--bg-card)", color: "var(--text-primary)", fontFamily: "inherit", outline: "none" }}
          >
            <option value="">— Choisir un sujet —</option>
            <option value="Nouvelle fonctionnalité">Nouvelle fonctionnalité</option>
            <option value="Amélioration existante">Amélioration d&apos;une fonctionnalité existante</option>
            <option value="Bug ou problème">Bug ou problème technique</option>
            <option value="Données de marché">Données de marché manquantes ou incorrectes</option>
            <option value="Contenu">Suggestion de contenu</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)", marginBottom: 5, display: "block" }}>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            minLength={10}
            rows={5}
            placeholder="Décrivez votre suggestion en détail..."
            style={{ width: "100%", fontSize: 13, padding: "10px 12px", borderRadius: 8, border: "0.5px solid var(--border-secondary)", background: "var(--bg-card)", color: "var(--text-primary)", fontFamily: "inherit", outline: "none", resize: "vertical", lineHeight: 1.6 }}
          />
        </div>

        {erreur && (
          <div style={{ padding: "8px 12px", borderRadius: 8, background: "var(--red-bg)", color: "var(--red-text)", fontSize: 12 }}>{erreur}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: "10px", borderRadius: 8, background: "var(--green)", color: "white", border: "none", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", opacity: loading ? 0.5 : 1 }}
        >
          {loading ? "Envoi..." : "Envoyer la suggestion"}
        </button>
      </div>
    </form>
  );
}
