import { jsonError, proxyApi, requireApiRole } from "@/lib/api-server"

type Context = { params: Promise<{ id: string }> }

type PayRequest = {
  action?: unknown
  method?: unknown
  reference?: unknown
}

export async function PATCH(request: Request, { params }: Context) {
  const guard = await requireApiRole(["customer"])

  if (guard.error) return guard.error

  const { id } = await params

  if (!/^[a-f\d]{24}$/i.test(id)) {
    return jsonError(400, "Invalid booking ID")
  }

  let body: PayRequest

  try {
    body = await request.json()
  } catch {
    return jsonError(400, "Invalid request body")
  }

  if (body?.action !== "pay") {
    return jsonError(400, "Action must be pay")
  }

  const method = body.method === "stripe" ? "stripe" : "manual"
  const reference =
    typeof body.reference === "string"
      ? body.reference.trim().slice(0, 100)
      : ""

  return proxyApi(`/bookings/${id}/pay`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerId: guard.user.id,
      method,
      paymentReference: reference || null,
    }),
  })
}
