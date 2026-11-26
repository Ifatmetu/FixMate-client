import { proxyApi, requireApiRole } from "@/lib/api-server"

export async function GET() {
  const guard = await requireApiRole(["customer"])

  if (guard.error) return guard.error

  return proxyApi("/payments")
}
