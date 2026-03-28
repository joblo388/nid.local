"use client";

import { Badge, badgeCouleurs } from "@/lib/badges";

function BadgePill({ badge }: { badge: Badge }) {
  const c = badgeCouleurs[badge.couleur];
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium leading-none whitespace-nowrap relative group"
      style={{ background: c.bg, color: c.text, border: "0.5px solid var(--border)" }}
    >
      <span>{badge.icon}</span>
      <span className="whitespace-nowrap">{badge.nom}</span>
      {/* Tooltip */}
      <span
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded-md text-[10px] font-normal max-w-[200px] text-center whitespace-normal opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50"
        style={{
          background: "var(--text-primary)",
          color: "var(--bg-card)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        {badge.description}
      </span>
    </span>
  );
}

export function BadgeDisplay({
  badges,
  compact = false,
}: {
  badges: Badge[];
  compact?: boolean;
}) {
  if (badges.length === 0) return null;

  const visible = compact ? badges.slice(0, 2) : badges;
  const hidden = compact ? badges.length - visible.length : 0;

  return (
    <span className="inline-flex items-center gap-1 flex-wrap">
      {visible.map((b) => (
        <BadgePill key={b.id} badge={b} />
      ))}
      {hidden > 0 && (
        <span
          className="text-[10px] font-medium"
          style={{ color: "var(--text-tertiary)" }}
        >
          +{hidden}
        </span>
      )}
    </span>
  );
}
