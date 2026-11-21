import { getApiSessionUser, jsonError, proxyApi } from "@/lib/api-server"

export async function POST(request: Request) {
  const user = await getApiSessionUser()

  if (!user) return jsonError(401, "You must be signed in.")

  let payload: FormData

  try {
    payload = await request.formData()
  } catch {
    return jsonError(400, "Expected multipart form data")
  }

  return proxyApi("/profile-image", { method: "POST", body: payload })
}
