import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.metrickittools.com" }],
        destination: "https://metrickittools.com/:path*",
        permanent: true,
      },
      {
        source: "/saas-metrics/cac-payback-period-calculato",
        destination: "/saas-metrics/cac-payback-period-calculator",
        permanent: true,
      },
      {
        source: "/guides/cac-payback-guid",
        destination: "/guides/cac-payback-guide",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
