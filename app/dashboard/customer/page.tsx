"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  ClipboardList,
  CreditCard,
  Wrench,
} from "lucide-react"

import {
  EmptyState,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/components/dashboard/DashboardContent"
import { formatCurrency, formatDate, pickField } from "@/lib/format"
import type { Booking } from "@/lib/types"

export default function CustomerDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await fetch("/api/customer/bookings", {
          cache: "no-store",
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data?.message ?? "Failed to load bookings")
        }

        setBookings(Array.isArray(data) ? data : [])
        setError("")
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load bookings"
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadBookings()
  }, [])

  const totalBookings = bookings.length
  const activeRequests = bookings.filter(
    (booking) => booking.status === "accepted"
  ).length
  const payments = bookings.filter(
    (booking) => booking.status === "paid"
  ).length
  const recentBookings = bookings.slice(0, 4)

  return (
    <>
      <PageHeader
        title="Customer Dashboard"
        description="Keep track of your repair requests and payments in one place."
        action={
          <Link
            href="/services"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Browse services
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total bookings"
          value={isLoading ? "—" : totalBookings}
          hint="Your repair requests"
          icon={ClipboardList}
        />

        <StatCard
          label="Active requests"
          value={isLoading ? "—" : activeRequests}
          hint="Accepted by a technician"
          icon={Wrench}
        />

        <StatCard
          label="Payments"
          value={isLoading ? "—" : payments}
          hint="Completed payments"
          icon={CreditCard}
        />
      </div>

      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent activity
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your latest repair requests and their current status.
            </p>
          </div>

          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
          >
            View all bookings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading your activity...
          </p>
        ) : error ? (
          <EmptyState title="Could not load activity" description={error} />
        ) : recentBookings.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No activity yet"
            description="Book a repair from the services page and it will show up here."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="min-w-0 font-semibold text-gray-900 dark:text-white">
                    {pickField(booking, [
                      "serviceTitle",
                      "title",
                      "service",
                    ])}
                  </h3>

                  <StatusBadge status={booking.status ?? "pending"} />
                </div>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {pickField(booking, ["technicianName"])} ·{" "}
                  {formatCurrency(booking.servicePrice)}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  Requested {formatDate(booking.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
