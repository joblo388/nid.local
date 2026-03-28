"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { quartierBySlug } from "@/lib/data";

type HistoryPost = {
  type: "post";
  id: string;
  titre: string;
  categorie: string;
  quartierSlug: string;
  consulteLe: string;
};

type HistoryListing = {
  type: "listing";
  id: string;
  titre: string;
  prix: number;
  typeBien: string;
  quartierSlug: string;
  imageUrl: string | null;
  consulteLe: string;
};

type HistoryItem = HistoryPost | HistoryListing;

const badgeLabels: Record<string, string> = {
  alerte: "Alerte", question: "Question", vente: "Vente",
  location: "Location", renovation: "Conseil", voisinage: "Voisinage",
  construction: "Construction", legal: "Legal", financement: "Financement",
  copropriete: "Co-propriete",
};

const typeLabels: Record<string, string> = {
  unifamiliale: "Unifamiliale", condo: "Condo", duplex: "Duplex",
  triplex: "Triplex", quadruplex: "Quadruplex",
};

export function RecentlyViewed() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setItems(data.slice(0, 10)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (items.length === 0) return null;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
    >
      <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
        <h2 className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
          Consulte recemment
        </h2>
      </div>
      <div>
        {items.map((item, i) => {
          const quartier = quartierBySlug[item.quartierSlug];
          const quartierNom = quartier?.nom ?? item.quartierSlug;

          if (item.type === "post") {
            return (
              <Link
                key={`post-${item.id}`}
                href={`/post/${item.id}`}
                className="flex items-center gap-3 px-4 py-2.5 transition-colors hover-bg"
                style={{ borderBottom: i < items.length - 1 ? "0.5px solid var(--border)" : "none" }}
              >
                <span
                  className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold"
                  style={{ background: "var(--blue-bg)", color: "var(--blue-text)" }}
                >
                  P
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
                    {item.titre}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md" style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}>
                      {badgeLabels[item.categorie] ?? item.categorie}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                      {quartierNom}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] shrink-0" style={{ color: "var(--text-tertiary)" }}>
                  {timeAgo(item.consulteLe)}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={`listing-${item.id}`}
              href={`/annonces/${item.id}`}
              className="flex items-center gap-3 px-4 py-2.5 transition-colors hover-bg"
              style={{ borderBottom: i < items.length - 1 ? "0.5px solid var(--border)" : "none" }}
            >
              <span
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold"
                style={{ background: "var(--amber-bg)", color: "var(--amber-text)" }}
              >
                $
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
                  {item.titre}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-semibold" style={{ color: "var(--green)" }}>
                    {item.prix.toLocaleString("fr-CA")} $
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                    {typeLabels[item.typeBien] ?? item.typeBien} - {quartierNom}
                  </span>
                </div>
              </div>
              <span className="text-[10px] shrink-0" style={{ color: "var(--text-tertiary)" }}>
                {timeAgo(item.consulteLe)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function timeAgo(d: string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return "aujourd'hui";
  if (days === 1) return "hier";
  if (days < 7) return `il y a ${days}j`;
  return new Date(d).toLocaleDateString("fr-CA", { day: "numeric", month: "short" });
}
