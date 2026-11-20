import { headers } from "next/headers"

import { auth } from "@/lib/auth"

const apiServerUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"
).replace(/\/$/, "")

export type ApiSessionUser = {
  id: string
  name?: string | null
  email?: string | null
  role?: string | null
}

type RoleGuard =
  | { error: Response; user?: never }
  | { error?: undefined; user: ApiSessionUser }

export function jsonError(status: number, message: string) {
  return Response.json({ success: false, message }, { status })
}

export async function getApiSessionUser(): Promise<ApiSessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() })

  return session?.user ?? null
}

export async function requireApiRole(roles: string[]): Promise<RoleGuard> {
  const user = await getApiSessionUser()

  if (!user) {
    return { error: jsonError(401, "You must be signed in.") }
  }

  if (!user.role || !roles.includes(user.role)) {
    return { error: jsonError(403, "You do not have permission to do that.") }
  }

  return { user }
}

export async function proxyApi(path: string, init?: RequestInit) {
  try {
    const upstream = await fetch(`${apiServerUrl}${path}`, {
      ...init,
      cache: "no-store",
    })

    const body = await upstream.text()

    return new Response(body, {
      status: upstream.status,
      headers: {
        "content-type":
          upstream.headers.get("content-type") ?? "application/json",
      },
    })
  } catch (error) {
    console.error("Failed to reach the API server:", error)

    return jsonError(
      502,
      "Cannot reach the API server. Make sure the backend is running."
    )
  }
}
