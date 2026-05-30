import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "@mantine/core",
      "@mantine/hooks",
      "@mantine/form",
      "@mantine/notifications",
      "@mantine/dates",
      "@mantine/charts",
      "@tabler/icons-react",
    ],
  },
  async rewrites() {
    const apiURL = process.env.NEXT_PUBLIC_API_URL ;
    return [
      {
        source: "/api/:path*",
        destination: `${apiURL}/api/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);