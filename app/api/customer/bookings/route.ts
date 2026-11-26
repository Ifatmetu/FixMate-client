import {
  jsonError,
  proxyApi,
  requireApiRole,
  requireCustomer,
} from "@/lib/api-server"

type BookingRequest = {
  serviceId?: unknown
  customerName?: unknown
  customerEmail?: unknown
  phone?: unknown
  preferredDate?: unknown
  message?: unknown
}

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

export async function GET() {
  const guard = await requireApiRole(["customer"])

  if (guard.error) return guard.error

  return proxyApi("/bookings")
}

export async function POST(request: Request) {
  const guard = await requireCustomer()

  if (guard.error) return guard.error

  let body: BookingRequest

  try {
    body = await request.json()
  } catch {
    return jsonError(400, "Invalid request body")
  }

  const serviceId = asText(body?.serviceId)

  if (!serviceId) {
    return jsonError(400, "A service is required")
  }

  // Look the service up server-side so the technician and price can never be
  // spoofed by the booking form.
  const serviceResponse = await proxyApi(
    `/services/${encodeURIComponent(serviceId)}`
  )

  if (!serviceResponse.ok) {
    if (serviceResponse.status === 404) {
      return jsonError(404, "Service not found")
    }

    return serviceResponse
  }

  const service = (await serviceResponse.json().catch(() => null)) as Record<
    string,
    unknown
  > | null

  if (!service) {
    return jsonError(502, "Could not load service details")
  }

  const customerName = asText(guard.user.name) || asText(body?.customerName)
  const customerEmail = asText(guard.user.email) || asText(body?.customerEmail)

  if (!customerName || !customerEmail) {
    return jsonError(400, "Please provide your name and email")
  }

  const payload = {
    serviceId: service._id ?? serviceId,
    serviceTitle: service.title ?? "",
    servicePrice: Number(service.price) || 0,
    technicianId: service.technicianId ?? null,
    technicianName: service.technicianName ?? "",
    customerName,
    customerEmail,
    phone: asText(body?.phone),
    preferredDate: asText(body?.preferredDate),
    message: asText(body?.message),
    status: "pending",
  }

  return proxyApi("/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
}
