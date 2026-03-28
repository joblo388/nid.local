import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "96px",
        }}
      >
        {/* House shape */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            position: "relative",
          }}
        >
          {/* Roof - triangle using borders */}
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "160px solid transparent",
              borderRight: "160px solid transparent",
              borderBottom: "130px solid #1a1a18",
              marginBottom: "-4px",
            }}
          />
          {/* House body */}
          <div
            style={{
              width: "260px",
              height: "180px",
              background: "#1a1a18",
              borderRadius: "0 0 24px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Door */}
            <div
              style={{
                width: "80px",
                height: "120px",
                background: "#1D9E75",
                borderRadius: "40px 40px 0 0",
                position: "absolute",
                bottom: "0",
              }}
            />
          </div>
          {/* Green dot */}
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "#1D9E75",
              borderRadius: "50%",
              position: "absolute",
              top: "20px",
              right: "-20px",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
