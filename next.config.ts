import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/saas-metrics/cac-payback-period-calculato",
        destination: "/saas-metrics/cac-payback-period-calculator",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
