import { proxyApi, requireApiRole } from "@/lib/api-server"

export async function GET() {
  const guard = await requireApiRole(["technician"])

  if (guard.error) return guard.error

  return proxyApi("/bookings")
}
