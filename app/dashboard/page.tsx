"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (isPending || !session?.user) return

    const role = session.user.role

    if (role === "admin") {
      router.replace("/dashboard/admin")
    } else if (role === "technician") {
      router.replace("/dashboard/technician")
    } else {
      router.replace("/dashboard/customer")
    }
  }, [isPending, session?.user, router])

  return (
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Redirecting to your dashboard...
    </p>
  )
}
