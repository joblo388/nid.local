"use client";

import { Badge, badgeCouleurs } from "@/lib/badges";

const badgeIcons: Record<string, React.ReactNode> = {
  pen: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
  edit: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  trophy: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3h14M9 3v2a3 3 0 006 0V3M5 3a2 2 0 00-2 2v2a4 4 0 004 4h0M19 3a2 2 0 012 2v2a4 4 0 01-4 4h0M7 11v1a5 5 0 0010 0v-1M8 21h8m-4-4v4" />
    </svg>
  ),
  "thumb-up": (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
    </svg>
  ),
  star: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  chat: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  medal: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15a5 5 0 100-10 5 5 0 000 10zM8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
    </svg>
  ),
  home: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
    </svg>
  ),
};

export function BadgeIcon({ name }: { name: string }) {
  return <>{badgeIcons[name] ?? null}</>;
}

function BadgePill({ badge }: { badge: Badge }) {
  const c = badgeCouleurs[badge.couleur];
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium leading-none whitespace-nowrap relative group badge-shimmer"
      style={{ background: c.bg, color: c.text, border: "0.5px solid var(--border)" }}
    >
      <BadgeIcon name={badge.icon} />
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
