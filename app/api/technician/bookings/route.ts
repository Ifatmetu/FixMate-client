import { proxyApi, requireApiRole } from "@/lib/api-server"

export async function GET() {
  const guard = await requireApiRole(["technician"])

  if (guard.error) return guard.error

  const query = new URLSearchParams({ technicianId: guard.user.id })

  return proxyApi(`/bookings?${query.toString()}`)
}
