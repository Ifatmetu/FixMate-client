"use client"

import { useEffect, useState } from "react"
import { Check, ClipboardList, X } from "lucide-react"
import toast from "react-hot-toast"

import {
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/dashboard/DashboardContent"
import { formatCurrency, formatDate, pickField } from "@/lib/format"
import type { Booking } from "@/lib/types"

type BookingAction = "accept" | "decline"

export default function TechnicianRequestsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingId, setUpdatingId] = useState("")
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setIsLoading(true)

        const response = await fetch("/api/technician/bookings", {
          cache: "no-store",
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data?.message ?? "Failed to load requests")
        }

        setBookings(Array.isArray(data) ? data : [])
        setError("")
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load requests"
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadRequests()
  }, [reloadKey])

  const updateRequest = async (id: string, action: BookingAction) => {
    try {
      setUpdatingId(id)

      const response = await fetch(`/api/technician/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to update request")
      }

      toast.success(
        action === "accept"
          ? "Request accepted. The customer can now pay."
          : "Request declined."
      )

      setReloadKey((key) => key + 1)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update request"
      )
    } finally {
      setUpdatingId("")
    }
  }

  return (
    <>
      <PageHeader
        title="Service Requests"
        description="Review repair requests for your services and respond to customers."
      />

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading requests...
        </p>
      ) : error ? (
        <EmptyState title="Could not load requests" description={error} />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No requests yet"
          description="New requests will appear here as soon as customers send them."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {bookings.map((booking) => {
            const status = booking.status ?? "pending"
            const isBusy = updatingId === booking._id
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
                      Customer
                    </dt>
                    <dd className="text-right text-gray-900 dark:text-white">
                      {pickField(booking, [
                        "customerName",
                        "customerEmail",
                      ])}
                    </dd>
                  </div>

                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500 dark:text-gray-400">Phone</dt>
                    <dd className="text-right text-gray-900 dark:text-white">
                      {pickField(booking, ["phone"])}
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

                {status === "pending" && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => updateRequest(booking._id, "accept")}
                      className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Accept
                    </button>

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => updateRequest(booking._id, "decline")}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <X className="h-3.5 w-3.5" />
                      Decline
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
