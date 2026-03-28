import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f4f0",
          borderRadius: "36px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            position: "relative",
          }}
        >
          {/* Roof */}
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "56px solid transparent",
              borderRight: "56px solid transparent",
              borderBottom: "46px solid #1a1a18",
              marginBottom: "-2px",
            }}
          />
          {/* Body */}
          <div
            style={{
              width: "92px",
              height: "64px",
              background: "#1a1a18",
              borderRadius: "0 0 8px 8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Door */}
            <div
              style={{
                width: "28px",
                height: "42px",
                background: "#D4742A",
                borderRadius: "14px 14px 0 0",
                position: "absolute",
                bottom: "0",
              }}
            />
          </div>
          {/* Green dot */}
          <div
            style={{
              width: "16px",
              height: "16px",
              background: "#D4742A",
              borderRadius: "50%",
              position: "absolute",
              top: "6px",
              right: "-8px",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
