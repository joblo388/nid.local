"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

type ReviewUser = {
  id: string;
  username: string | null;
  name: string | null;
  image: string | null;
};

type Review = {
  id: string;
  securite: number;
  transport: number;
  commerces: number;
  ecoles: number;
  ambiance: number;
  commentaire: string | null;
  creeLe: string;
  user: ReviewUser;
};

type UserReview = {
  id: string;
  securite: number;
  transport: number;
  commerces: number;
  ecoles: number;
  ambiance: number;
  commentaire: string | null;
} | null;

type Averages = Record<string, number>;

const CRITERIA: { key: string; label: string }[] = [
  { key: "securite", label: "Securite" },
  { key: "transport", label: "Transport" },
  { key: "commerces", label: "Commerces" },
  { key: "ecoles", label: "Ecoles" },
  { key: "ambiance", label: "Ambiance" },
];

/* ---------- SVG star icon ---------- */
function Star({ filled, onClick, interactive }: { filled: boolean; onClick?: () => void; interactive?: boolean }) {
  return (
    <svg
      onClick={onClick}
      width={interactive ? "32" : "18"}
      height={interactive ? "32" : "18"}
      viewBox="0 0 24 24"
      fill={filled ? "var(--amber-text)" : "none"}
      stroke={filled ? "var(--amber-text)" : "var(--border-secondary)"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ cursor: interactive ? "pointer" : "default", flexShrink: 0 }}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function StarRatingDisplay({ value, size = 14 }: { value: number; size?: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg
        key={i}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={i <= Math.round(value) ? "var(--amber-text)" : "none"}
        stroke={i <= Math.round(value) ? "var(--amber-text)" : "var(--border-secondary)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }
  return <span style={{ display: "flex", gap: "1px", alignItems: "center" }}>{stars}</span>;
}

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <span
      style={{ display: "flex", gap: "4px", alignItems: "center" }}
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          onMouseEnter={() => setHover(i)}
          onClick={() => onChange(i)}
        >
          <Star filled={i <= (hover || value)} interactive />
        </span>
      ))}
    </span>
  );
}

/* ---------- Main component ---------- */
export function QuartierReviews({ quartierSlug }: { quartierSlug: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [averages, setAverages] = useState<Averages>({});
  const [total, setTotal] = useState(0);
  const [userReview, setUserReview] = useState<UserReview>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    securite: 0,
    transport: 0,
    commerces: 0,
    ecoles: 0,
    ambiance: 0,
    commentaire: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/quartiers/${quartierSlug}/reviews`);
      if (!res.ok) return;
      const data = await res.json();
      setReviews(data.reviews);
      setAverages(data.averages);
      setTotal(data.total);
      setUserReview(data.userReview);
      if (data.userReview) {
        setFormData({
          securite: data.userReview.securite,
          transport: data.userReview.transport,
          commerces: data.userReview.commerces,
          ecoles: data.userReview.ecoles,
          ambiance: data.userReview.ambiance,
          commentaire: data.userReview.commentaire ?? "",
        });
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [quartierSlug]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  function handleOpenForm() {
    if (!session) {
      router.push(`/auth/connexion?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    // Validate all criteria selected
    for (const c of CRITERIA) {
      if (formData[c.key as keyof typeof formData] === 0) {
        setFormError("Veuillez noter tous les critères.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/quartiers/${quartierSlug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          securite: formData.securite,
          transport: formData.transport,
          commerces: formData.commerces,
          ecoles: formData.ecoles,
          ambiance: formData.ambiance,
          commentaire: formData.commentaire.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setFormError(data.error ?? "Erreur lors de la soumission.");
        return;
      }
      setShowForm(false);
      await fetchReviews();
    } catch {
      setFormError("Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  }

  const overallAvg =
    total > 0
      ? Math.round(
          ((averages.securite ?? 0) +
            (averages.transport ?? 0) +
            (averages.commerces ?? 0) +
            (averages.ecoles ?? 0) +
            (averages.ambiance ?? 0)) /
            5 *
            10
        ) / 10
      : 0;

  if (loading) {
    return (
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
      >
        <div className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
          Chargement des avis...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Summary card */}
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-bold" style={{ color: "var(--text-primary)" }}>
            Avis sur le quartier
          </h2>
          <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
            {total} avis
          </span>
        </div>

        {total > 0 ? (
          <div className="flex gap-5 items-start">
            {/* Big overall score */}
            <div className="flex flex-col items-center gap-1" style={{ minWidth: "60px" }}>
              <span
                className="text-[28px] font-bold leading-none"
                style={{ color: "var(--text-primary)" }}
              >
                {overallAvg.toFixed(1)}
              </span>
              <StarRatingDisplay value={overallAvg} size={12} />
              <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                / 5
              </span>
            </div>

            {/* Criteria bars */}
            <div className="flex-1 space-y-2">
              {CRITERIA.map((c) => {
                const val = averages[c.key] ?? 0;
                const pct = (val / 5) * 100;
                return (
                  <div key={c.key} className="flex items-center gap-2">
                    <span
                      className="text-[11px] w-[70px] shrink-0"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {c.label}
                    </span>
                    <div
                      className="flex-1 h-[6px] rounded-full overflow-hidden"
                      style={{ background: "var(--bg-secondary)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: "var(--green)",
                        }}
                      />
                    </div>
                    <span
                      className="text-[11px] w-[24px] text-right tabular-nums"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {val.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
            Aucun avis pour l&apos;instant. Soyez le premier !
          </p>
        )}

        {/* CTA button */}
        {!showForm && (
          <button
            onClick={handleOpenForm}
            className="mt-4 w-full py-2 rounded-lg text-[13px] font-semibold transition-opacity hover:opacity-90"
            style={{
              background: userReview ? "var(--bg-secondary)" : "var(--green)",
              color: userReview ? "var(--text-secondary)" : "#fff",
              border: userReview ? "0.5px solid var(--border)" : "none",
            }}
          >
            {userReview ? "Modifier mon avis" : "Donner mon avis"}
          </button>
        )}

        {/* Inline form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div
              className="rounded-lg p-4 space-y-3"
              style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)" }}
            >
              {CRITERIA.map((c) => (
                <div key={c.key} className="flex items-center justify-between">
                  <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
                    {c.label}
                  </span>
                  <StarRatingInput
                    value={formData[c.key as keyof typeof formData] as number}
                    onChange={(v) =>
                      setFormData((prev) => ({ ...prev, [c.key]: v }))
                    }
                  />
                </div>
              ))}

              <div>
                <textarea
                  value={formData.commentaire}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, commentaire: e.target.value }))
                  }
                  placeholder="Commentaire optionnel..."
                  maxLength={1000}
                  rows={3}
                  className="w-full rounded-lg p-2.5 text-[12px] resize-none outline-none"
                  style={{
                    background: "var(--bg-card)",
                    border: "0.5px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            {formError && (
              <p className="text-[11px]" style={{ color: "var(--red-text)" }}>
                {formError}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2 rounded-lg text-[13px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: "var(--green)", color: "#fff" }}
              >
                {submitting ? "Envoi..." : userReview ? "Mettre à jour" : "Publier mon avis"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg text-[13px] transition-opacity hover:opacity-70"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-secondary)",
                  border: "0.5px solid var(--border)",
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Individual reviews list */}
      {reviews.length > 0 && (
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "var(--bg-card)",
            border: "0.5px solid var(--border)",
          }}
        >
          {reviews.map((review, idx) => {
            const reviewAvg =
              (review.securite + review.transport + review.commerces + review.ecoles + review.ambiance) / 5;
            return (
              <div
                key={review.id}
                className="p-4"
                style={idx > 0 ? { borderTop: "0.5px solid var(--border)" } : undefined}
              >
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {/* Avatar */}
                  {review.user.image ? (
                    <img
                      src={review.user.image}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: "var(--green)" }}
                    >
                      {(review.user.username ?? review.user.name ?? "?")[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>
                    {review.user.username ?? review.user.name ?? "Anonyme"}
                  </span>
                  <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                    {new Date(review.creeLe).toLocaleDateString("fr-CA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="ml-auto flex items-center gap-1">
                    <StarRatingDisplay value={reviewAvg} size={11} />
                    <span
                      className="text-[11px] font-medium tabular-nums"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {reviewAvg.toFixed(1)}
                    </span>
                  </span>
                </div>

                {/* Individual criteria as small inline badges */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 mb-1.5">
                  {CRITERIA.map((c) => (
                    <span key={c.key} className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                      {c.label}{" "}
                      <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
                        {review[c.key as keyof Review] as number}/5
                      </span>
                    </span>
                  ))}
                </div>

                {review.commentaire && (
                  <p className="text-[12px] mt-1" style={{ color: "var(--text-secondary)" }}>
                    {review.commentaire}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
