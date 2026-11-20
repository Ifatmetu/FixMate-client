import { jsonError, proxyApi, requireApiRole } from "@/lib/api-server"

type Context = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Context) {
  const guard = await requireApiRole(["admin"])

  if (guard.error) return guard.error

  const { id } = await params

  if (!/^[a-f\d]{24}$/i.test(id)) {
    return jsonError(400, "Invalid service ID")
  }

  let body: { action?: unknown }

  try {
    body = await request.json()
  } catch {
    return jsonError(400, "Invalid request body")
  }

  if (body?.action !== "approve" && body?.action !== "reject") {
    return jsonError(400, "Action must be approve or reject")
  }

  return proxyApi(`/services/${id}/${body.action}`, { method: "PATCH" })
}
