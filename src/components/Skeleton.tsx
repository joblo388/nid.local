/**
 * Skeleton loading primitives.
 * No external dependencies — uses the .skeleton-pulse class defined in globals.css.
 */

/* ── Primitives ──────────────────────────────────────────────────────────── */

export function SkeletonLine({
  width = "100%",
  height = 12,
  style,
}: {
  width?: string | number;
  height?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="skeleton-pulse"
      style={{ width, height, borderRadius: 6, ...style }}
    />
  );
}

export function SkeletonCircle({ size = 32 }: { size?: number }) {
  return (
    <div
      className="skeleton-pulse"
      style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0 }}
    />
  );
}

/* ── SkeletonPostCard ────────────────────────────────────────────────────── */
/* Mirrors PostCard: left vote bar (desktop), right content area with badge,
   two title lines, a meta line, and a footer row. */

export function SkeletonPostCard() {
  return (
    <div
      className="rounded-xl"
      style={{
        background: "var(--bg-card)",
        border: "0.5px solid var(--border)",
      }}
    >
      <div className="flex gap-0">
        {/* Vote column — hidden on mobile, matches PostCard */}
        <div className="hidden md:flex">
          <div
            className="flex flex-col items-center gap-2 py-4 px-3 rounded-l-xl shrink-0"
            style={{ background: "var(--bg-secondary)", minWidth: 52 }}
          >
            <SkeletonLine width={18} height={18} style={{ borderRadius: 4 }} />
            <SkeletonLine width={22} height={10} />
            <SkeletonLine width={18} height={18} style={{ borderRadius: 4 }} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 px-4 py-3 space-y-3">
          {/* Badge + quartier */}
          <div className="flex items-center gap-2">
            <SkeletonLine width={56} height={16} style={{ borderRadius: 6 }} />
            <SkeletonLine width={72} height={12} />
            <SkeletonLine width={40} height={10} />
          </div>

          {/* Title — two lines */}
          <div className="space-y-1.5">
            <SkeletonLine width="85%" height={14} />
            <SkeletonLine width="55%" height={14} />
          </div>

          {/* Excerpt / body */}
          <SkeletonLine width="70%" height={11} />

          {/* Footer */}
          <div className="flex items-center gap-4 pt-1">
            <SkeletonCircle size={16} />
            <SkeletonLine width={60} height={10} />
            <SkeletonCircle size={16} />
            <SkeletonLine width={50} height={10} />
            <div className="ml-auto">
              <SkeletonLine width={36} height={10} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── SkeletonListingCard ─────────────────────────────────────────────────── */
/* Mirrors mp-listing-card: image placeholder (200px or full-width mobile) +
   body with price, title, address, specs, footer. */

export function SkeletonListingCard() {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "0.5px solid var(--border)",
        borderRadius: 12,
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "200px 1fr",
      }}
      className="skeleton-listing-card"
    >
      {/* Image placeholder */}
      <div
        className="skeleton-pulse"
        style={{
          minHeight: 160,
          borderRadius: 0,
        }}
      />

      {/* Body */}
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Price */}
        <SkeletonLine width={120} height={18} />
        {/* Type + quartier */}
        <SkeletonLine width={140} height={10} />
        {/* Title */}
        <SkeletonLine width="80%" height={13} />
        {/* Address */}
        <SkeletonLine width="60%" height={10} />
        {/* Specs row */}
        <div className="flex items-center gap-3 pt-1">
          <SkeletonLine width={48} height={10} />
          <SkeletonLine width={48} height={10} />
          <SkeletonLine width={56} height={10} />
        </div>
        {/* Footer */}
        <div
          className="flex items-center justify-between"
          style={{ marginTop: "auto", paddingTop: 8, borderTop: "0.5px solid var(--border)" }}
        >
          <SkeletonLine width={56} height={10} />
          <SkeletonCircle size={28} />
        </div>
      </div>

      {/* Responsive override: on small screens the grid becomes single-column */}
      <style>{`
        @media (max-width: 500px) {
          .skeleton-listing-card {
            grid-template-columns: 1fr !important;
          }
          .skeleton-listing-card > div:first-child {
            min-height: 140px !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ── SkeletonPostDetail ──────────────────────────────────────────────────── */
/* Mimics the post detail page article: badge, title, body paragraphs, footer */

export function SkeletonPostDetail() {
  return (
    <div
      className="rounded-xl"
      style={{
        background: "var(--bg-card)",
        border: "0.5px solid var(--border)",
        padding: 24,
      }}
    >
      {/* Badge + quartier */}
      <div className="flex items-center gap-2 mb-4">
        <SkeletonLine width={60} height={18} style={{ borderRadius: 6 }} />
        <SkeletonLine width={80} height={14} />
      </div>

      {/* Title */}
      <div className="mb-5 space-y-2">
        <SkeletonLine width="90%" height={18} />
        <SkeletonLine width="60%" height={18} />
      </div>

      {/* Body paragraphs */}
      <div className="space-y-2 mb-6">
        <SkeletonLine width="100%" height={12} />
        <SkeletonLine width="95%" height={12} />
        <SkeletonLine width="85%" height={12} />
        <SkeletonLine width="40%" height={12} />
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-4"
        style={{ borderTop: "0.5px solid var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <SkeletonLine width={80} height={10} />
          <SkeletonLine width={100} height={10} />
          <SkeletonLine width={50} height={10} />
        </div>
        <SkeletonLine width={28} height={28} style={{ borderRadius: 6 }} />
      </div>
    </div>
  );
}
