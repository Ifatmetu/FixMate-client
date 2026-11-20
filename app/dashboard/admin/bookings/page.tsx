"use client"

import { useEffect, useState } from "react"

import {
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/dashboard/DashboardContent"
import { formatDate, pickField } from "@/lib/format"
import type { Booking } from "@/lib/types"

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await fetch("/api/admin/bookings", {
          cache: "no-store",
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data?.message ?? "Failed to load bookings")
        }

        setBookings(Array.isArray(data) ? data : [])
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

  return (
    <>
      <PageHeader
        title="Manage Bookings"
        description="Track every booking across the platform."
      />

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading bookings...
        </p>
      ) : error ? (
        <EmptyState title="Could not load bookings" description={error} />
      ) : bookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="Bookings will appear here as soon as they are created."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-950 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-4 py-3 text-gray-900 dark:text-white">
                    {pickField(booking, [
                      "customerName",
                      "name",
                      "userEmail",
                      "email",
                    ])}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {pickField(booking, [
                      "serviceTitle",
                      "title",
                      "service",
                    ])}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={booking.status ?? "pending"} />
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {formatDate(booking.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
