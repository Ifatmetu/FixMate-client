"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, Menu } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import Sidebar from "@/components/dashboard/Sidebar"

type Role = "customer" | "technician" | "admin"

function normalizeRole(role: unknown): Role {
  return role === "technician" || role === "admin" ? role : "customer"
}

function isRouteAllowed(role: Role, pathname: string) {
  if (pathname === "/dashboard" || pathname === "/dashboard/profile") {
    return true
  }

  const prefix = `/dashboard/${role}`

  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const { data: session, isPending } = authClient.useSession()

  const userId = session?.user?.id
  const isAuthenticated = Boolean(userId)
  const role = normalizeRole(session?.user?.role)
  const isAllowed = isRouteAllowed(role, pathname)

  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      router.replace("/sign-in")
    }
  }, [isPending, isAuthenticated, router])

  useEffect(() => {
    if (!isPending && isAuthenticated && !isAllowed) {
      router.replace("/dashboard")
    }
  }, [isPending, isAuthenticated, isAllowed, router])

  const handleSignOut = async () => {
    setIsSigningOut(true)

    try {
      await authClient.signOut()
      router.replace("/sign-in")
    } finally {
      setIsSigningOut(false)
    }
  }

  if (isPending || !isAuthenticated || !isAllowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {isPending ? "Loading..." : "Redirecting..."}
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Sidebar
        role={role}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="min-h-screen lg:ml-72">
        <div className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200 bg-white/90 px-4 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90 sm:px-6">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open navigation menu"
            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {session?.user?.name ?? "Your account"}
            </p>
            <p className="text-xs capitalize text-gray-500 dark:text-gray-400">
              {role}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isSigningOut ? "Signing out..." : "Sign out"}
            </span>
          </button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
