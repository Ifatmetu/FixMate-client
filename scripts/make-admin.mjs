import { MongoClient } from "mongodb"

const mongoUrl = process.env.BETTER_AUTH_DB_URL
const email = process.argv[2]?.trim().toLowerCase()

if (!mongoUrl) {
  console.error("BETTER_AUTH_DB_URL is not defined")
  process.exit(1)
}

if (!email) {
  console.error("Usage: npm run make-admin -- you@example.com")
  process.exit(1)
}

const client = new MongoClient(mongoUrl)

try {
  await client.connect()

  const db = client.db("FixMate")

  const result = await db.collection("user").findOneAndUpdate(
    { email },
    {
      $set: {
        role: "admin",
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  )

  if (!result) {
    console.error(`No account found for ${email}. Sign up first.`)
    process.exitCode = 1
  } else {
    console.log(`${result.email} is now an admin.`)
  }
} catch (error) {
  console.error("Failed to set admin role:", error)
  process.exitCode = 1
} finally {
  await client.close()
}
