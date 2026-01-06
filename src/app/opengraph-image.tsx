import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#ffffff",
          padding: 64,
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  border: "3px solid #fff",
                }}
              />
            </div>
            <div style={{ fontSize: 54, fontWeight: 800, letterSpacing: -1 }}>
              {siteConfig.name}
            </div>
          </div>
          <div style={{ fontSize: 30, color: "#d4d4d8", maxWidth: 980 }}>
            {siteConfig.description}
          </div>
          <div style={{ fontSize: 22, color: "#a1a1aa" }}>
            CAC • LTV • ROAS • Payback • Churn
          </div>
        </div>
      </div>
    ),
    size,
  );
}

