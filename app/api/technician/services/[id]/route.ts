import { jsonError, proxyApi, requireApiRole } from "@/lib/api-server"

type Context = { params: Promise<{ id: string }> }

type AvailabilityRequest = { availability?: unknown }

export async function PATCH(request: Request, { params }: Context) {
  const guard = await requireApiRole(["technician"])

  if (guard.error) return guard.error

  const { id } = await params

  if (!/^[a-f\d]{24}$/i.test(id)) {
    return jsonError(400, "Invalid service ID")
  }

  let body: AvailabilityRequest

  try {
    body = await request.json()
  } catch {
    return jsonError(400, "Invalid request body")
  }

  if (
    body?.availability !== "available" &&
    body?.availability !== "unavailable"
  ) {
    return jsonError(400, "Availability must be available or unavailable")
  }

  // The backend only updates approved services owned by this technician, so a
  // rejected or somebody else's service can never be toggled here.
  return proxyApi(`/services/${id}/availability`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      availability: body.availability,
    }),
  })
}
