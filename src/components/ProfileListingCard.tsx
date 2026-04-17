"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/useLocale";

type Props = {
  listing: {
    id: string;
    titre: string;
    prix: number;
    adresse: string;
    statut: string;
    nbVues: number;
    nbClics: number;
    imageUrl: string | null;
  };
  isOwn: boolean;
};

const statusColors: Record<string, { bg: string; text: string; labelKey: string }> = {
  active: { bg: "var(--green-light-bg)", text: "var(--green-text)", labelKey: "listing.remettre_active" },
  vendu: { bg: "var(--red-bg)", text: "var(--red-text)", labelKey: "listing.marquer_vendu" },
  retire: { bg: "var(--bg-secondary)", text: "var(--text-tertiary)", labelKey: "listing.retirer" },
};

export function ProfileListingCard({ listing, isOwn }: Props) {
  const router = useRouter();
  const { t } = useLocale();
  const [showActions, setShowActions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const status = statusColors[listing.statut] ?? statusColors.active;

  async function changeStatus(newStatut: string) {
    setLoading(true);
    await fetch(`/api/annonces/${listing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: newStatut }),
    });
    router.refresh();
    setLoading(false);
    setShowActions(false);
  }

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/annonces/${listing.id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <div
      className="rounded-xl transition-colors"
      style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
    >
      <Link
        href={`/annonces/${listing.id}`}
        className="flex gap-3 px-4 py-3 transition-colors hover-bg"
        style={{ borderRadius: "12px 12px 0 0" }}
      >
        <div
          className="w-16 h-16 rounded-lg shrink-0 flex items-center justify-center overflow-hidden"
          style={{ background: "var(--bg-secondary)" }}
        >
          {listing.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={listing.imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="var(--text-tertiary)" strokeWidth="1">
              <rect x="2" y="10" width="28" height="20" rx="2" /><path d="M2 14l14-10 14 10" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-[14px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
              {listing.prix.toLocaleString("fr-CA")} $
            </p>
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0"
              style={{ background: status.bg, color: status.text }}
            >
              {t(status.labelKey)}
            </span>
          </div>
          <p className="text-[13px] truncate" style={{ color: "var(--text-secondary)" }}>
            {listing.titre}
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            {listing.adresse} · {listing.nbVues} {t("common.vues")} · {listing.nbClics} clics
          </p>
        </div>
      </Link>

      {/* Owner actions */}
      {isOwn && (
        <div
          className="px-4 py-2"
          style={{ borderTop: "0.5px solid var(--border)" }}
        >
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>{t("common.supprimer")} ?</span>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="text-[11px] font-medium px-2.5 py-1 rounded-md"
                style={{ background: "var(--red-bg)", color: "var(--red-text)", border: "none", cursor: "pointer", fontFamily: "inherit" }}
              >
                {loading ? "\u2026" : t("common.confirmer")}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-[11px]"
                style={{ color: "var(--text-tertiary)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
              >
                {t("common.annuler")}
              </button>
            </div>
          ) : showActions ? (
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/annonces/${listing.id}/modifier`}
                className="text-[11px] font-medium px-2.5 py-1 rounded-md"
                style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "0.5px solid var(--border)" }}
              >
                {t("common.modifier")}
              </Link>
              {listing.statut === "active" ? (
                <button
                  onClick={() => changeStatus("vendu")}
                  disabled={loading}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-md"
                  style={{ background: "var(--green-light-bg)", color: "var(--green-text)", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                >
                  {t("listing.marquer_vendu")}
                </button>
              ) : (
                <button
                  onClick={() => changeStatus("active")}
                  disabled={loading}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-md"
                  style={{ background: "var(--green-light-bg)", color: "var(--green-text)", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                >
                  {t("listing.remettre_active")}
                </button>
              )}
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-[11px]"
                style={{ color: "var(--red-text)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
              >
                {t("common.supprimer")}
              </button>
              <button
                onClick={() => setShowActions(false)}
                className="text-[11px]"
                style={{ color: "var(--text-tertiary)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", marginLeft: "auto" }}
              >
                {t("common.fermer")}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowActions(true)}
              className="text-[11px] font-medium transition-opacity hover:opacity-70"
              style={{ color: "var(--text-tertiary)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
            >
              {t("common.modifier")} ›
            </button>
          )}
        </div>
      )}
    </div>
  );
}
