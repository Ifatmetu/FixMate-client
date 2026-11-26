import { betterAuth } from "better-auth"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { MongoClient, type CollectionOptions, type Db } from "mongodb"
import { admin } from "better-auth/plugins"

const mongoUrl = process.env.BETTER_AUTH_DB_URL

if (!mongoUrl) {
  throw new Error("BETTER_AUTH_DB_URL is not defined")
}

const mongoUri: string = mongoUrl

const baseURL =
  process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_BETTER_AUTH_URL

if (!baseURL) {
  throw new Error("BETTER_AUTH_URL is not defined")
}

const localOrigins =
  process.env.NODE_ENV === "production"
    ? []
    : [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
      ]

const mongoOptions = {
  maxPoolSize: 10,
  minPoolSize: 0,
  maxIdleTimeMS: 60000,
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
}

declare global {
  var _mongoAuthClient: MongoClient | undefined
}

function getMongoClient() {
  if (!globalThis._mongoAuthClient) {
    const client = new MongoClient(mongoUri, mongoOptions)

    // A failed initial connection closes the driver's topology. Dropping the
    // cached client here lets the next request connect with a fresh one
    // instead of reusing a permanently closed topology.
    client.on("topologyClosed", () => {
      if (globalThis._mongoAuthClient === client) {
        globalThis._mongoAuthClient = undefined
      }
    })

    globalThis._mongoAuthClient = client
  }

  return globalThis._mongoAuthClient
}

// Better Auth captures this object when `auth` is created. Resolve the client
// per operation so a closed topology from a previous invocation is never used.
const db = {
  collection(name: string, options?: CollectionOptions) {
    return getMongoClient().db("FixMate").collection(name, options)
  },
} as unknown as Db

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

  // Better Auth rejects requests whose Origin is not trusted. Keep the
  // production URL, allow local dev URLs, and include Vercel's generated
  // preview and production hosts so sign-in/sign-up work everywhere.
  trustedOrigins: [
    baseURL,
    "https://*.vercel.app",
    ...localOrigins,
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
  ],

  database: mongodbAdapter(db),

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
