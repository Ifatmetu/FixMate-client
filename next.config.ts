import type { NextConfig } from "next"

const apiServerUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"
).replace(/\/$/, "")

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/server/:path*",
        destination: `${apiServerUrl}/:path*`,
      },
    ]
  },
}

export default nextConfig
