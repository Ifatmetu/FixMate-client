import { jsonError, proxyApi, requireApiRole } from "@/lib/api-server"

type Context = { params: Promise<{ technicianId: string }> }

type SubscriptionRequest = {
  status?: unknown
  notes?: unknown
}

export async function PATCH(request: Request, { params }: Context) {
  const guard = await requireApiRole(["admin"])

  if (guard.error) return guard.error

  const { technicianId } = await params

  if (!/^[a-f\d]{24}$/i.test(technicianId)) {
    return jsonError(400, "Invalid technician ID")
  }

  let body: SubscriptionRequest

  try {
    body = await request.json()
  } catch {
    return jsonError(400, "Invalid request body")
  }

  if (body?.status !== "active" && body?.status !== "inactive") {
    return jsonError(400, "Status must be active or inactive")
  }

  return proxyApi(`/subscription/${technicianId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: body.status,
      activatedBy: guard.user.id,
      notes: typeof body.notes === "string" ? body.notes : "",
    }),
  })
}
