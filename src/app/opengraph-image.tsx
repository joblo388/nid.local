import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "nid.local — Forum immobilier du Québec";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #D4742A 0%, #8B3A0F 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* House icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
          >
            {/* Roof */}
            <path d="M40 8 L72 38 L64 38 L64 68 L16 68 L16 38 L8 38 Z" fill="rgba(255,255,255,0.9)" />
            {/* Door */}
            <rect x="32" y="44" width="16" height="24" rx="2" fill="#D4742A" />
            {/* Doorknob */}
            <circle cx="44" cy="57" r="2" fill="rgba(255,255,255,0.8)" />
          </svg>
        </div>

        {/* Main title */}
        <div style={{ display: "flex", alignItems: "baseline", marginBottom: 12 }}>
          <span
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-2px",
            }}
          >
            nid
          </span>
          <span
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "-2px",
            }}
          >
            .local
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: "rgba(255,255,255,0.8)",
            marginBottom: 48,
            letterSpacing: "0.5px",
          }}
        >
          Forum immobilier du Québec
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 400,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "1px",
          }}
        >
          Calculatrices · Données de marché · Communauté
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
