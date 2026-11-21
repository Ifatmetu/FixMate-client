import { jsonError, proxyApi, requireApiRole } from "@/lib/api-server"

type Context = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Context) {
  const guard = await requireApiRole(["technician"])

  if (guard.error) return guard.error

  const { id } = await params

  if (!/^[a-f\d]{24}$/i.test(id)) {
    return jsonError(400, "Invalid booking ID")
  }

  let body: { action?: unknown }

  try {
    body = await request.json()
  } catch {
    return jsonError(400, "Invalid request body")
  }

  if (body?.action !== "accept" && body?.action !== "decline") {
    return jsonError(400, "Action must be accept or decline")
  }

  const serverAction = body.action === "decline" ? "reject" : body.action

  return proxyApi(`/bookings/${id}/${serverAction}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ technicianId: guard.user.id }),
  })
}
