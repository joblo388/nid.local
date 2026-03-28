"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { villes, quartiers } from "@/lib/data";

const TYPES = [
  { value: "unifamiliale", label: "Unifamiliale" },
  { value: "condo", label: "Condo" },
  { value: "duplex", label: "Duplex" },
  { value: "triplex", label: "Triplex" },
  { value: "quadruplex", label: "Quadruplex" },
];

const TYPE_LABELS: Record<string, string> = Object.fromEntries(TYPES.map((t) => [t.value, t.label]));

interface Alerte {
  id: string;
  villeSlug: string | null;
  quartierSlug: string | null;
  type: string | null;
  prixMax: number | null;
  prixMin: number | null;
  chambresMin: number | null;
  active: boolean;
  creeLe: string;
}

export default function AlertesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [villeSlug, setVilleSlug] = useState("");
  const [quartierSlug, setQuartierSlug] = useState("");
  const [type, setType] = useState("");
  const [prixMin, setPrixMin] = useState("");
  const [prixMax, setPrixMax] = useState("");
  const [chambresMin, setChambresMin] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const filteredQuartiers = villeSlug
    ? quartiers.filter((q) => q.villeSlug === villeSlug)
    : quartiers;

  const fetchAlertes = useCallback(async () => {
    try {
      const res = await fetch("/api/alertes");
      if (res.ok) {
        const data = await res.json();
        setAlertes(data.alertes);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/connexion?callbackUrl=/alertes");
      return;
    }
    if (status === "authenticated") {
      fetchAlertes();
    }
  }, [status, router, fetchAlertes]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/alertes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          villeSlug: villeSlug || null,
          quartierSlug: quartierSlug || null,
          type: type || null,
          prixMin: prixMin ? parseInt(prixMin) : null,
          prixMax: prixMax ? parseInt(prixMax) : null,
          chambresMin: chambresMin ? parseInt(chambresMin) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur lors de la création.");
        return;
      }

      // Reset form and refresh list
      setVilleSlug("");
      setQuartierSlug("");
      setType("");
      setPrixMin("");
      setPrixMax("");
      setChambresMin("");
      fetchAlertes();
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: string) => {
    const res = await fetch(`/api/alertes/${id}`, { method: "PATCH" });
    if (res.ok) {
      const data = await res.json();
      setAlertes((prev) =>
        prev.map((a) => (a.id === id ? { ...a, active: data.alerte.active } : a)),
      );
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/alertes/${id}`, { method: "DELETE" });
    if (res.ok) {
      setAlertes((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const villeBySlug = Object.fromEntries(villes.map((v) => [v.slug, v]));
  const quartierBySlug = Object.fromEntries(quartiers.map((q) => [q.slug, q]));

  const describeAlerte = (a: Alerte) => {
    const parts: string[] = [];
    if (a.type) parts.push(TYPE_LABELS[a.type] ?? a.type);
    if (a.quartierSlug) parts.push(quartierBySlug[a.quartierSlug]?.nom ?? a.quartierSlug);
    else if (a.villeSlug) parts.push(villeBySlug[a.villeSlug]?.nom ?? a.villeSlug);
    if (a.prixMin && a.prixMax)
      parts.push(`${a.prixMin.toLocaleString("fr-CA")} $ – ${a.prixMax.toLocaleString("fr-CA")} $`);
    else if (a.prixMin) parts.push(`min ${a.prixMin.toLocaleString("fr-CA")} $`);
    else if (a.prixMax) parts.push(`max ${a.prixMax.toLocaleString("fr-CA")} $`);
    if (a.chambresMin) parts.push(`${a.chambresMin}+ ch.`);
    return parts.length > 0 ? parts.join(" · ") : "Toutes les annonces";
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
        <Header />
        <main className="max-w-[700px] mx-auto px-5 py-6">
          <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>Chargement...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[700px] mx-auto px-5 py-6 pb-20 md:pb-6">
        <h1 className="text-[22px] font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          Alertes marketplace
        </h1>
        <p className="text-[13px] mb-6" style={{ color: "var(--text-tertiary)" }}>
          Recevez un courriel quand une annonce correspond à vos critères.
        </p>

        {/* Create form */}
        <div
          className="rounded-xl p-5 mb-6"
          style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
        >
          <h2 className="text-[14px] font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Nouvelle alerte
          </h2>

          <form onSubmit={handleCreate}>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              {/* Ville */}
              <div>
                <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  Ville
                </label>
                <select
                  value={villeSlug}
                  onChange={(e) => {
                    setVilleSlug(e.target.value);
                    setQuartierSlug("");
                  }}
                  className="w-full rounded-lg px-3 py-2 text-[13px]"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "0.5px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">Toutes les villes</option>
                  {villes.map((v) => (
                    <option key={v.slug} value={v.slug}>{v.nom}</option>
                  ))}
                </select>
              </div>

              {/* Quartier */}
              <div>
                <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  Quartier
                </label>
                <select
                  value={quartierSlug}
                  onChange={(e) => setQuartierSlug(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-[13px]"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "0.5px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">Tous les quartiers</option>
                  {filteredQuartiers.map((q) => (
                    <option key={q.slug} value={q.slug}>{q.nom}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  Type de propriété
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-[13px]"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "0.5px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">Tous les types</option>
                  {TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Chambres min */}
              <div>
                <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  Chambres minimum
                </label>
                <select
                  value={chambresMin}
                  onChange={(e) => setChambresMin(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-[13px]"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "0.5px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">Peu importe</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}+</option>
                  ))}
                </select>
              </div>

              {/* Prix min */}
              <div>
                <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  Prix minimum ($)
                </label>
                <input
                  type="number"
                  value={prixMin}
                  onChange={(e) => setPrixMin(e.target.value)}
                  placeholder="Ex: 200000"
                  className="w-full rounded-lg px-3 py-2 text-[13px]"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "0.5px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              {/* Prix max */}
              <div>
                <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  Prix maximum ($)
                </label>
                <input
                  type="number"
                  value={prixMax}
                  onChange={(e) => setPrixMax(e.target.value)}
                  placeholder="Ex: 500000"
                  className="w-full rounded-lg px-3 py-2 text-[13px]"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "0.5px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            {error && (
              <p className="text-[12px] mt-3" style={{ color: "var(--red-text)" }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-4 px-5 py-2 rounded-lg text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--green)" }}
            >
              {submitting ? "Création..." : "Créer l'alerte"}
            </button>
          </form>
        </div>

        {/* Existing alerts */}
        <h2 className="text-[14px] font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
          Mes alertes ({alertes.length})
        </h2>

        {alertes.length === 0 ? (
          <div
            className="rounded-xl px-6 py-12 text-center"
            style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
          >
            <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
              Aucune alerte pour l&apos;instant. Créez-en une ci-dessus.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {alertes.map((a) => (
              <div
                key={a.id}
                className="rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3"
                style={{
                  background: "var(--bg-card)",
                  border: "0.5px solid var(--border)",
                  opacity: a.active ? 1 : 0.55,
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
                    {describeAlerte(a)}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                    Créée le {new Date(a.creeLe).toLocaleDateString("fr-CA")}
                    {!a.active && (
                      <span
                        className="ml-2 inline-block px-2 py-0.5 rounded-lg text-[10px] font-medium"
                        style={{ background: "var(--bg-secondary)", color: "var(--text-tertiary)" }}
                      >
                        Désactivée
                      </span>
                    )}
                    {a.active && (
                      <span
                        className="ml-2 inline-block px-2 py-0.5 rounded-lg text-[10px] font-medium"
                        style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}
                      >
                        Active
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 mt-2 sm:mt-0">
                  {/* Toggle button */}
                  <button
                    onClick={() => handleToggle(a.id)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-opacity hover:opacity-80"
                    style={{
                      background: a.active ? "var(--bg-secondary)" : "var(--green-light-bg)",
                      color: a.active ? "var(--text-secondary)" : "var(--green-text)",
                      border: "0.5px solid var(--border)",
                    }}
                    title={a.active ? "Désactiver" : "Activer"}
                  >
                    {a.active ? "Désactiver" : "Activer"}
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-opacity hover:opacity-80"
                    style={{
                      background: "var(--red-bg)",
                      color: "var(--red-text)",
                      border: "0.5px solid var(--border)",
                    }}
                    title="Supprimer"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
