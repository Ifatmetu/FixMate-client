import {
  adminClient,
  inferAdditionalFields,
} from "better-auth/client/plugins"
import { adminAc, defaultAc } from "better-auth/plugins/admin/access"
import { createAuthClient } from "better-auth/react"

import type { auth } from "@/lib/auth"

const noAccessRole = defaultAc.newRole({ user: [], session: [] })

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient({
      roles: {
        admin: adminAc,
        customer: noAccessRole,
        technician: noAccessRole,
      },
    }),
  ],
})

export const { signIn, signUp, signOut, useSession } = authClient
