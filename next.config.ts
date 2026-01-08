import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "metrickittools.com" }],
        destination: "https://www.metrickittools.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
