interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

function svg(props: IconProps, d: string, viewBox = "0 0 24 24") {
  return (
    <svg
      className={props.className}
      width={props.size ?? 20}
      height={props.size ?? 20}
      viewBox={viewBox}
      fill="none"
      stroke={props.color ?? "currentColor"}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

// --- Navigation / Tool icons ---

export function IconHome(p: IconProps) {
  return svg(p, "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10");
}

export function IconChart(p: IconProps) {
  return (
    <svg className={p.className} width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
    </svg>
  );
}

export function IconCalculator(p: IconProps) {
  return (
    <svg className={p.className} width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 6h8" /><path d="M8 10h2" /><path d="M14 10h2" /><path d="M8 14h2" /><path d="M14 14h2" /><path d="M8 18h2" /><path d="M14 18h2" />
    </svg>
  );
}

export function IconDollar(p: IconProps) {
  return svg(p, "M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6");
}

export function IconBuilding(p: IconProps) {
  return (
    <svg className={p.className} width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="1" /><path d="M9 22V18h6v4" /><path d="M8 6h2" /><path d="M14 6h2" /><path d="M8 10h2" /><path d="M14 10h2" /><path d="M8 14h2" /><path d="M14 14h2" />
    </svg>
  );
}

export function IconLandmark(p: IconProps) {
  return (
    <svg className={p.className} width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" /><path d="M5 21V7l7-4 7 4v14" /><path d="M9 21v-4h6v4" />
    </svg>
  );
}

export function IconScale(p: IconProps) {
  return (
    <svg className={p.className} width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" /><path d="M5 7l7-4 7 4" /><path d="M3 13l2-6 2 6a4 4 0 01-4 0z" /><path d="M17 13l2-6 2 6a4 4 0 01-4 0z" />
    </svg>
  );
}

export function IconRuler(p: IconProps) {
  return (
    <svg className={p.className} width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.73 18l-8-14a2 2 0 00-3.46 0l-8 14A2 2 0 004 21h16a2 2 0 001.73-3z" /><path d="M12 9v4" /><path d="M12 17h.01" />
    </svg>
  );
}

export function IconLightbulb(p: IconProps) {
  return (
    <svg className={p.className} width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" />
    </svg>
  );
}

export function IconUsers(p: IconProps) {
  return (
    <svg className={p.className} width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

export function IconSearch(p: IconProps) {
  return (
    <svg className={p.className} width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

export function IconBook(p: IconProps) {
  return (
    <svg className={p.className} width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}

export function IconGraduation(p: IconProps) {
  return (
    <svg className={p.className} width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10l-10-6L2 10l10 6 10-6z" /><path d="M6 12v5c0 2 3 4 6 4s6-2 6-4v-5" /><path d="M22 10v6" />
    </svg>
  );
}

export function IconReceipt(p: IconProps) {
  return (
    <svg className={p.className} width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2z" /><path d="M8 8h8" /><path d="M8 12h8" /><path d="M8 16h4" />
    </svg>
  );
}

export function IconBookOpen(p: IconProps) {
  return (
    <svg className={p.className} width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  );
}

// --- Badge icons ---

export function IconPen(p: IconProps) {
  return svg(p, "M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z");
}

export function IconEdit(p: IconProps) {
  return (
    <svg className={p.className} width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

export function IconTrophy(p: IconProps) {
  return (
    <svg className={p.className} width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v2a2 2 0 01-2 2h-2" /><path d="M6 3v6a6 6 0 0012 0V3" /><path d="M12 15v4" /><path d="M8 21h8" />
    </svg>
  );
}

export function IconThumbUp(p: IconProps) {
  return svg(p, "M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z M2 13h2v9H2z");
}

export function IconStar(p: IconProps) {
  return svg(p, "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z");
}

export function IconChat(p: IconProps) {
  return svg(p, "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z");
}

export function IconMedal(p: IconProps) {
  return (
    <svg className={p.className} width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="14" r="6" /><path d="M8 2v6" /><path d="M16 2v6" /><path d="M12 8V2" />
    </svg>
  );
}

// --- Professional tag icons ---

export function IconHammer(p: IconProps) {
  return svg(p, "M15.12 7.88l-3.54 3.54 M9.88 14.12L6 18l-2-2 3.88-3.88 M14 4l6 6-8 8-6-6 8-8z");
}

export function IconBolt(p: IconProps) {
  return svg(p, "M13 2L3 14h9l-1 8 10-12h-9l1-8z");
}

export function IconWrench(p: IconProps) {
  return svg(p, "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z");
}

export function IconWood(p: IconProps) {
  return (
    <svg className={p.className} width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20" /><path d="M5 20V8l7-5 7 5v12" /><path d="M10 20v-6h4v6" /><path d="M9 10h6" />
    </svg>
  );
}

export function IconHomeHeart(p: IconProps) {
  return (
    <svg className={p.className} width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path d="M12 13c-1-2-4-2-4 0s4 5 4 5 4-3 4-5-3-2-4 0z" />
    </svg>
  );
}

export function IconKey(p: IconProps) {
  return svg(p, "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4");
}

export function IconEye(p: IconProps) {
  return (
    <svg className={p.className} width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none" stroke={p.color ?? "currentColor"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}
