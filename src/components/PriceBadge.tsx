"use client";

interface PriceBadgeProps {
  prix: number;
  estimatedValue: number | null;
  compact?: boolean;
}

export function PriceBadge({ prix, estimatedValue, compact = false }: PriceBadgeProps) {
  if (estimatedValue == null) return null;

  const ratio = prix / estimatedValue;
  let label: string;
  let bg: string;
  let fg: string;

  if (ratio <= 0.9) {
    label = "Bon prix";
    bg = "var(--green-light-bg)";
    fg = "var(--green-text)";
  } else if (ratio <= 1.05) {
    label = "Prix march\u00e9";
    bg = "var(--amber-bg)";
    fg = "var(--amber-text)";
  } else {
    label = "Au-dessus du march\u00e9";
    bg = "var(--red-bg)";
    fg = "var(--red-text)";
  }

  if (compact) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 3,
          padding: "2px 6px",
          borderRadius: 6,
          fontSize: 10,
          fontWeight: 600,
          background: bg,
          color: fg,
          lineHeight: 1.3,
        }}
      >
        {label}
      </span>
    );
  }

  const estimatedFormatted = estimatedValue.toLocaleString("fr-CA");

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: 2,
        padding: "4px 8px",
        borderRadius: 8,
        background: bg,
        lineHeight: 1.3,
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 600, color: fg }}>{label}</span>
      <span style={{ fontSize: 10, color: fg, opacity: 0.8 }}>
        Estimation: {estimatedFormatted} $
      </span>
    </div>
  );
}
