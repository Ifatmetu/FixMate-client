import { jsonError, proxyApi, requireApiRole } from "@/lib/api-server"

export async function GET() {
  const guard = await requireApiRole(["technician"])

  if (guard.error) return guard.error

  const query = new URLSearchParams({ technicianId: guard.user.id })

  return proxyApi(`/services?${query.toString()}`)
}

export async function POST(request: Request) {
  const guard = await requireApiRole(["technician"])

  if (guard.error) return guard.error

  let payload: FormData

  try {
    payload = await request.formData()
  } catch {
    return jsonError(400, "Expected multipart form data")
  }

  payload.append("technicianId", guard.user.id)

  if (guard.user.name) {
    payload.append("technicianName", guard.user.name)
  }

  if (guard.user.email) {
    payload.append("technicianEmail", guard.user.email)
  }

  return proxyApi("/services", { method: "POST", body: payload })
}
