import type { NextConfig } from "next"

const apiServerUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"
).replace(/\/$/, "")

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/server/services/approved",
        destination: `${apiServerUrl}/services/approved`,
      },
      {
        source: "/api/server/services/:id",
        destination: `${apiServerUrl}/services/:id`,
      },
      {
        source: "/api/server/bookings",
        destination: `${apiServerUrl}/bookings`,
      },
    ]
  },
}

export default nextConfig
