"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

type ReviewItem = {
  id: string;
  note: number;
  commentaire: string | null;
  listingId: string | null;
  creeLe: string;
  reviewer: { id: string; username: string; image: string | null };
};

type ReviewData = {
  moyenne: number;
  count: number;
  repartition: Record<number, number>;
  reviews: ReviewItem[];
};

type Props = {
  sellerId: string;
  compact?: boolean;
};

function StarIcon({ filled, half, size = 14 }: { filled: boolean; half?: boolean; size?: number }) {
  if (half) {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" style={{ flexShrink: 0 }}>
        <defs>
          <linearGradient id="halfStar">
            <stop offset="50%" stopColor="var(--amber-text)" />
            <stop offset="50%" stopColor="var(--border)" />
          </linearGradient>
        </defs>
        <path
          d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.5L10 13.47 5.06 16.1 6 10.6l-4-3.9 5.61-.87L10 1z"
          fill="url(#halfStar)"
        />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ flexShrink: 0 }}>
      <path
        d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.5L10 13.47 5.06 16.1 6 10.6l-4-3.9 5.61-.87L10 1z"
        fill={filled ? "var(--amber-text)" : "var(--border)"}
      />
    </svg>
  );
}

function StarsDisplay({ note, size = 14 }: { note: number; size?: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (note >= i) {
      stars.push(<StarIcon key={i} filled size={size} />);
    } else if (note >= i - 0.5) {
      stars.push(<StarIcon key={i} filled={false} half size={size} />);
    } else {
      stars.push(<StarIcon key={i} filled={false} size={size} />);
    }
  }
  return <span style={{ display: "inline-flex", gap: 1, alignItems: "center" }}>{stars}</span>;
}

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);

  return (
    <span style={{ display: "inline-flex", gap: 2, cursor: "pointer" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
        >
          <svg width={22} height={22} viewBox="0 0 20 20">
            <path
              d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.5L10 13.47 5.06 16.1 6 10.6l-4-3.9 5.61-.87L10 1z"
              fill={(hover || value) >= n ? "var(--amber-text)" : "var(--border)"}
              style={{ transition: "fill 0.1s" }}
            />
          </svg>
        </span>
      ))}
    </span>
  );
}

function timeAgo(d: string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return "aujourd'hui";
  if (days === 1) return "hier";
  if (days < 7) return `il y a ${days} j`;
  if (days < 30) return `il y a ${Math.floor(days / 7)} sem.`;
  if (days < 365) return `il y a ${Math.floor(days / 30)} mois`;
  return `il y a ${Math.floor(days / 365)} an${Math.floor(days / 365) > 1 ? "s" : ""}`;
}

export function SellerRating({ sellerId, compact = false }: Props) {
  const { data: session } = useSession();
  const [data, setData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formNote, setFormNote] = useState(0);
  const [formComment, setFormComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = useCallback(() => {
    fetch(`/api/users/${sellerId}/reviews`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sellerId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function submitReview() {
    if (formNote < 1 || formNote > 5) {
      setError("Choisissez une note entre 1 et 5.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/users/${sellerId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: formNote, commentaire: formComment || null }),
      });
      if (res.ok) {
        setShowForm(false);
        setFormNote(0);
        setFormComment("");
        fetchReviews();
      } else {
        const d = await res.json();
        setError(d.error ?? "Erreur lors de l'envoi.");
      }
    } catch {
      setError("Erreur reseau.");
    }
    setSubmitting(false);
  }

  if (loading) {
    return compact ? (
      <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>...</span>
    ) : null;
  }

  if (!data) return null;

  // --- Compact mode ---
  if (compact) {
    if (data.count === 0) return null;
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-tertiary)" }}>
        <StarsDisplay note={data.moyenne} size={12} />
        <span style={{ fontWeight: 500, color: "var(--amber-text)" }}>{data.moyenne.toFixed(1)}</span>
        <span>({data.count} avis)</span>
      </span>
    );
  }

  // --- Full mode ---
  const isOwnProfile = session?.user?.id === sellerId;
  const hasReviewed = data.reviews.some((r) => r.reviewer.id === session?.user?.id);

  return (
    <div
      className="rounded-xl"
      style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", padding: "16px 20px" }}
    >
      <h2 className="text-[13px] font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
        Reputation vendeur
      </h2>

      {data.count === 0 ? (
        <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
          Aucun avis pour l&apos;instant.
        </p>
      ) : (
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Left: average */}
          <div style={{ textAlign: "center", minWidth: 80 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.1 }}>
              {data.moyenne.toFixed(1)}
            </div>
            <StarsDisplay note={data.moyenne} size={16} />
            <div className="text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>
              {data.count} avis
            </div>
          </div>

          {/* Right: star breakdown */}
          <div style={{ flex: 1, minWidth: 140 }}>
            {[5, 4, 3, 2, 1].map((star) => {
              const cnt = data.repartition[star] ?? 0;
              const pct = data.count > 0 ? (cnt / data.count) * 100 : 0;
              return (
                <div key={star} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span className="text-[11px]" style={{ width: 12, textAlign: "right", color: "var(--text-tertiary)" }}>{star}</span>
                  <svg width={10} height={10} viewBox="0 0 20 20" style={{ flexShrink: 0 }}>
                    <path
                      d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.5L10 13.47 5.06 16.1 6 10.6l-4-3.9 5.61-.87L10 1z"
                      fill="var(--amber-text)"
                    />
                  </svg>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: "var(--bg-secondary)", overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, background: "var(--amber-text)", transition: "width 0.3s" }} />
                  </div>
                  <span className="text-[11px]" style={{ width: 20, textAlign: "right", color: "var(--text-tertiary)" }}>{cnt}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Leave a review button */}
      {session?.user?.id && !isOwnProfile && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "0.5px solid var(--border)" }}>
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="text-[12px] font-medium"
              style={{
                color: "var(--green)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontFamily: "inherit",
              }}
            >
              {hasReviewed ? "Modifier mon avis" : "Laisser un avis"}
            </button>
          ) : (
            <div>
              <div style={{ marginBottom: 8 }}>
                <label className="text-[12px]" style={{ color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>
                  Votre note
                </label>
                <StarInput value={formNote} onChange={setFormNote} />
              </div>
              <textarea
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                placeholder="Commentaire (optionnel)"
                style={{
                  width: "100%",
                  fontSize: 13,
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "0.5px solid var(--border-secondary)",
                  background: "var(--bg-card)",
                  color: "var(--text-primary)",
                  fontFamily: "inherit",
                  outline: "none",
                  resize: "none",
                  height: 60,
                  lineHeight: 1.5,
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-secondary)")}
              />
              {error && (
                <p className="text-[11px] mt-1" style={{ color: "var(--red-text)" }}>{error}</p>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 8, justifyContent: "flex-end" }}>
                <button
                  onClick={() => { setShowForm(false); setError(""); }}
                  className="text-[12px]"
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "0.5px solid var(--border-secondary)",
                    background: "transparent",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={submitReview}
                  disabled={submitting || formNote < 1}
                  className="text-[12px] font-medium"
                  style={{
                    padding: "6px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: "var(--green)",
                    color: "white",
                    cursor: formNote < 1 ? "not-allowed" : "pointer",
                    opacity: formNote < 1 ? 0.5 : 1,
                    fontFamily: "inherit",
                  }}
                >
                  {submitting ? "Envoi..." : "Envoyer"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Individual reviews */}
      {data.reviews.length > 0 && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "0.5px solid var(--border)", display: "flex", flexDirection: "column", gap: 10 }}>
          {data.reviews.map((review) => (
            <div key={review.id} style={{ display: "flex", gap: 10 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "var(--green-light-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--green-text)",
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                {review.reviewer.image ? (
                  <Image src={review.reviewer.image} alt="" width={30} height={30} className="rounded-full object-cover" />
                ) : (
                  review.reviewer.username[0]?.toUpperCase() ?? "?"
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span className="text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>
                    {review.reviewer.username}
                  </span>
                  <StarsDisplay note={review.note} size={11} />
                  <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                    {timeAgo(review.creeLe)}
                  </span>
                </div>
                {review.commentaire && (
                  <p className="text-[12px]" style={{ color: "var(--text-secondary)", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                    {review.commentaire}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
