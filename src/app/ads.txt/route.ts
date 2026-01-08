import { NextResponse } from "next/server";

function getAdsensePublisherId() {
  const explicit =
    process.env.ADSENSE_PUBLISHER_ID ||
    process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ||
    "";
  const trimmed = explicit.trim();
  if (trimmed) return trimmed;

  const client = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "").trim();
  if (client.startsWith("ca-pub-")) return `pub-${client.slice("ca-pub-".length)}`;
  return "";
}

export function GET() {
  const publisherId = getAdsensePublisherId();

  const lines: string[] = [
    "# ads.txt for MetricKit",
    "# Set ADSENSE_PUBLISHER_ID (or NEXT_PUBLIC_ADSENSE_PUBLISHER_ID) to output your AdSense record.",
  ];

  if (publisherId) {
    lines.push(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`);
  } else {
    lines.push("# google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0");
  }

  return new NextResponse(lines.join("\n") + "\n", {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}

