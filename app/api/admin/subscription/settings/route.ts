import { jsonError, proxyApi, requireApiRole } from "@/lib/api-server"

export async function GET() {
  const guard = await requireApiRole(["admin"])

  if (guard.error) return guard.error

  return proxyApi("/subscription/settings")
}

export async function PATCH(request: Request) {
  const guard = await requireApiRole(["admin"])

  if (guard.error) return guard.error

  let body: { amount?: unknown }

  try {
    body = await request.json()
  } catch {
    return jsonError(400, "Invalid request body")
  }

  const amount = Number(body?.amount)

  if (!Number.isFinite(amount) || amount <= 0) {
    return jsonError(400, "Amount must be greater than 0")
  }

  return proxyApi("/subscription/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  })
}
