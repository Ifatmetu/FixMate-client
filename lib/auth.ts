import { betterAuth } from "better-auth"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { MongoClient } from "mongodb"

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
      role: {
        type: ["admin", "customer", "technician"],
        input: true,
        defaultValue: "customer",
      },
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
    },
  },

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
