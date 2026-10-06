import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@merchant-payments/payments",
    "@merchant-payments/ui-tokens",
  ],
};

export default nextConfig;
