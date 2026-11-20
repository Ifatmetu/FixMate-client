"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ClipboardList,
  Receipt,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react"

import {
  PageHeader,
  StatCard,
} from "@/components/dashboard/DashboardContent"

type AdminStats = {
  users: number
  services: number
  pendingServices: number
  bookings: number
  payments: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch("/api/admin/stats", {
          cache: "no-store",
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data?.message ?? "Failed to load statistics")
        }

        setStats(data as AdminStats)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load statistics"
        )
      }
    }

    loadStats()
  }, [])

  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        description="An overview of users, services, bookings and transactions."
      />

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Users"
          value={stats?.users ?? "—"}
          hint="Registered accounts"
          icon={Users}
        />

        <StatCard
          label="Services"
          value={stats?.services ?? "—"}
          hint="Listed services"
          icon={Wrench}
        />

        <StatCard
          label="Bookings"
          value={stats?.bookings ?? "—"}
          hint="All bookings"
          icon={ClipboardList}
        />

        <StatCard
          label="Transactions"
          value={stats?.payments ?? "—"}
          hint="Recorded payments"
          icon={Receipt}
        />
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-blue-600" />

            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {stats?.pendingServices
                  ? `${stats.pendingServices} service(s) waiting for approval`
                  : "All submitted services are reviewed"}
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Customers only see services after you approve them.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/admin/services"
            className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Review services
          </Link>
        </div>
      </div>
    </>
  )
}
