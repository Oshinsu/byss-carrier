import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  async redirects() {
    return [
      { source: "/orion", destination: "https://orion.byssgroup.fr", permanent: false },
      { source: "/byss-emploi", destination: "https://byssemploi.fr", permanent: false },
      { source: "/random", destination: "https://random.byssgroup.fr", permanent: false },
      { source: "/moostik", destination: "https://moostik.byssgroup.fr", permanent: false },
      { source: "/jurassic-wars", destination: "https://jurassicwars.byssgroup.fr", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.anthropic.com https://openrouter.ai https://api.replicate.com https://gamma-api.polymarket.com https://boamp-datadila.opendatasoft.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
