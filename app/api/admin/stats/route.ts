import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { jsonError, proxyApi, requireApiRole } from "@/lib/api-server"
import type { Booking, Payment, Service } from "@/lib/types"

async function readArray(response: Response): Promise<unknown[]> {
  if (!response.ok) throw new Error("Failed to load dashboard data")

  const data = await response.json()

  return Array.isArray(data) ? data : []
}

export async function GET() {
  const guard = await requireApiRole(["admin"])

  if (guard.error) return guard.error

  try {
    const [userResult, servicesResponse, bookingsResponse, paymentsResponse] =
      await Promise.all([
        auth
          .api.listUsers({
            headers: await headers(),
            query: { limit: 1 },
          })
          .catch(() => null),
        proxyApi("/services"),
        proxyApi("/bookings"),
        proxyApi("/payments"),
      ])

    if (
      !servicesResponse.ok ||
      !bookingsResponse.ok ||
      !paymentsResponse.ok
    ) {
      return jsonError(502, "Cannot reach the API server")
    }

    const services = (await readArray(servicesResponse)) as Service[]
    const bookings = (await readArray(bookingsResponse)) as Booking[]
    const payments = (await readArray(paymentsResponse)) as Payment[]

    return Response.json({
      users: userResult?.total ?? 0,
      services: services.length,
      pendingServices: services.filter(
        (service) => (service.approvalStatus ?? "pending") === "pending"
      ).length,
      bookings: bookings.length,
      payments: payments.length,
    })
  } catch (error) {
    console.error("Failed to build admin stats:", error)

    return jsonError(500, "Failed to load dashboard statistics")
  }
}
