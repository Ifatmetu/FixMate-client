"use client"

import { useEffect, useState } from "react"
import { ClipboardList, CreditCard } from "lucide-react"
import toast from "react-hot-toast"

import {
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/dashboard/DashboardContent"
import { formatCurrency, formatDate, pickField } from "@/lib/format"
import type { Booking } from "@/lib/types"

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [payingId, setPayingId] = useState("")
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setIsLoading(true)

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
  }, [reloadKey])

  const payNow = async (id: string) => {
    try {
      setPayingId(id)

      const response = await fetch(`/api/customer/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "pay" }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to record payment")
      }

      toast.success("Payment successful")
      setReloadKey((key) => key + 1)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to record payment"
      )
    } finally {
      setPayingId("")
    }
  }

  return (
    <>
      <PageHeader
        title="My Bookings"
        description="Track your repair requests and pay once a technician accepts."
      />

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading bookings...
        </p>
      ) : error ? (
        <EmptyState title="Could not load bookings" description={error} />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No bookings yet"
          description="Once you book a repair, it will appear here."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {bookings.map((booking) => {
            const status = booking.status ?? "pending"
            const isBusy = payingId === booking._id
            const message =
              typeof booking.message === "string"
                ? booking.message.trim()
                : ""

            return (
              <div
                key={booking._id}
                className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      {pickField(booking, [
                        "serviceTitle",
                        "title",
                        "service",
                      ])}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(booking.servicePrice)}
                    </p>
                  </div>

                  <StatusBadge status={status} />
                </div>

                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500 dark:text-gray-400">
                      Technician
                    </dt>
                    <dd className="text-right text-gray-900 dark:text-white">
                      {pickField(booking, ["technicianName"])}
                    </dd>
                  </div>

                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500 dark:text-gray-400">
                      Preferred date
                    </dt>
                    <dd className="text-right text-gray-900 dark:text-white">
                      {formatDate(booking.preferredDate)}
                    </dd>
                  </div>

                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500 dark:text-gray-400">
                      Requested
                    </dt>
                    <dd className="text-right text-gray-900 dark:text-white">
                      {formatDate(booking.createdAt)}
                    </dd>
                  </div>
                </dl>

                {message && (
                  <p className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-950 dark:text-gray-300">
                    {message}
                  </p>
                )}

                {status === "accepted" && (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => payNow(booking._id)}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <CreditCard className="h-4 w-4" />
                    {isBusy ? "Processing..." : "Pay Now"}
                  </button>
                )}

                {status === "paid" && (
                  <p className="mt-4 text-sm text-blue-600 dark:text-blue-400">
                    Payment complete. Your technician has been notified.
                  </p>
                )}

                {status === "declined" && (
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    This request was declined by the technician.
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
