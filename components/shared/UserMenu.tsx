"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronDown,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react"
import { authClient } from "@/lib/auth-client"
import toast from "react-hot-toast"

export default function UserMenu() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const { data: session, isPending } = authClient.useSession()

  // Session loading
  if (isPending) {
    return (
      <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
    )
  }

  // =========================
  // NOT LOGGED IN
  // =========================
  if (!session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/sign-in"
          className="rounded-lg px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-800"
        >
          Sign In
        </Link>

        <Link
          href="/sign-up"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Sign Up
        </Link>
      </div>
    )
  }

  const user = session.user

  // User image
  const image = user.image

  // User name
  const name = user.name || "User"

  // User role
  const role = user.role || "customer"

  // First letter fallback
  const initial = name.charAt(0).toUpperCase()

  const handleSignOut = async () => {
    try {
      await authClient.signOut()

      toast.success("Signed out successfully")

      setOpen(false)

      router.push("/")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Failed to sign out")
    }
  }

  return (
    <div className="relative">
      {/* ================= USER BUTTON ================= */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {/* Profile Image */}
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-9 w-9 rounded-full border-2 border-blue-500 object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            {initial}
          </div>
        )}

        {/* Name */}
        <div className="hidden text-left sm:block">
          <p className="max-w-32 truncate text-sm font-semibold text-gray-900 dark:text-white">
            {name}
          </p>

          <p className="text-xs capitalize text-gray-500 dark:text-gray-400">
            {role}
          </p>
        </div>

        <ChevronDown
          className={`hidden h-4 w-4 text-gray-500 transition-transform sm:block ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ================= DROPDOWN ================= */}
      {open && (
        <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-800 dark:bg-gray-900">
          {/* User Info */}
          <div className="border-b border-gray-200 px-3 py-3 dark:border-gray-800">
            <div className="flex items-center gap-3">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                  {initial}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {name}
                </p>

                <p className="text-xs capitalize text-blue-600 dark:text-blue-400">
                  {role}
                </p>
              </div>
            </div>
          </div>

          {/* Profile */}
          <Link
            href="/dashboard/profile"
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
          >
            <User className="h-4 w-4" />
            Profile
          </Link>

          {/* Dashboard */}
          <Link
            href={`/dashboard/${role}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          {/* Sign Out */}
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}