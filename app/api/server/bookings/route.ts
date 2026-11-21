import { jsonError, proxyApi } from "@/lib/api-server"

const methodNotAllowed = () =>
  jsonError(405, "Repair requests must be sent to /api/customer/bookings")

// Public read-only proxy for bookings. Creating a booking must go through the
// authenticated customer route, never through this unauthenticated endpoint.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.toString()

  return proxyApi(query ? `/bookings?${query}` : "/bookings")
}

export const POST = methodNotAllowed
export const PUT = methodNotAllowed
export const PATCH = methodNotAllowed
export const DELETE = methodNotAllowed
