import { proxyApi, requireApiRole } from "@/lib/api-server"

export async function GET() {
  const guard = await requireApiRole(["admin"])

  if (guard.error) return guard.error

  return proxyApi("/services")
}
