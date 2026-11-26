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
  const session = await auth.api.getSession({
    headers: await headers(),
    // Read the role from the database, not from a cached session cookie, so a
    // role change takes effect immediately (e.g. a customer becoming a tech).
    query: { disableCookieCache: true },
  })

  if (!session?.user) return null

  // Older accounts can have a null role. Better Auth's defaultRole and the
  // dashboard both treat those users as customers, so the API should too.
  return {
    ...session.user,
    role: session.user.role || "customer",
  }
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

type CustomerGuard =
  | { error: Response; user?: never }
  | { error?: undefined; user: ApiSessionUser }

// Repair requests are customer-only. Technicians get an explicit denial so a
// role mix-up can never silently create a booking.
export async function requireCustomer(): Promise<CustomerGuard> {
  const user = await getApiSessionUser()

  if (!user) {
    return { error: jsonError(401, "You must be signed in.") }
  }

  if (user.role === "technician") {
    return {
      error: jsonError(403, "Technicians cannot send repair requests."),
    }
  }

  if (user.role !== "customer") {
    return {
      error: jsonError(403, "Only customers can send repair requests."),
    }
  }

  return { user }
}

export async function proxyApi(path: string, init?: RequestInit) {
  try {
    const forwarded = new Headers(init?.headers)
    const cookie = (await headers()).get("cookie")

    if (cookie && !forwarded.has("cookie")) {
      forwarded.set("cookie", cookie)
    }

    const upstream = await fetch(`${apiServerUrl}${path}`, {
      ...init,
      headers: forwarded,
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
