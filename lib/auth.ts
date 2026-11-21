import { betterAuth } from "better-auth"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { MongoClient } from "mongodb"
import { admin } from "better-auth/plugins"

const mongoUrl = process.env.BETTER_AUTH_DB_URL

if (!mongoUrl) {
  throw new Error("BETTER_AUTH_DB_URL is not defined")
}

const baseURL =
  process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_BETTER_AUTH_URL

if (!baseURL) {
  throw new Error("BETTER_AUTH_URL is not defined")
}

const client = new MongoClient(mongoUrl)

const db = client.db("FixMate")

const signupRoles = ["customer", "technician"] as const

type SignupRole = (typeof signupRoles)[number]

// The admin plugin owns `user.role` and marks it `input: false`, so the
// browser cannot send it. This maps the public input to a safe value and
// deliberately never allows `admin`.
function safeSignupRole(value: unknown): SignupRole {
  if (
    typeof value === "string" &&
    signupRoles.includes(value.toLowerCase() as SignupRole)
  ) {
    return value.toLowerCase() as SignupRole
  }

  return "customer"
}

export const auth = betterAuth({
  baseURL,

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      phone: {
        type: "string",
        input: true,
        required: false,
      },

      area: {
        type: "string",
        input: true,
        required: false,
      },

      // Public signup input only. The real `role` is set in the create hook
      // below; this field is never returned to the browser.
      signupRole: {
        type: "string",
        input: true,
        required: false,
        returned: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        async before(user) {
          const requestedRole = (user as Record<string, unknown>).signupRole

          // Leave other creation paths (Google/admin-created users) alone.
          if (typeof requestedRole !== "string") return

          const role = safeSignupRole(requestedRole)

          return {
            data: {
              role,
              signupRole: role,
            },
          }
        },
      },
    },
  },

  plugins: [
    admin({
      defaultRole: "customer",
      adminRoles: ["admin"],
    }),
  ],

  socialProviders:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : undefined,
})
