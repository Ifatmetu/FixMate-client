"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Check, Wrench, X } from "lucide-react"
import toast from "react-hot-toast"

import {
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/dashboard/DashboardContent"
import { formatCurrency, formatDate } from "@/lib/format"
import type { Service } from "@/lib/types"

type Filter = "all" | "pending" | "approved" | "rejected"

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
]

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [filter, setFilter] = useState<Filter>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState("")
  const [error, setError] = useState("")
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true)

        const response = await fetch("/api/admin/services", {
          cache: "no-store",
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data?.message ?? "Failed to load services")
        }

        setServices(Array.isArray(data) ? data : [])
        setError("")
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load services"
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()
  }, [reloadKey])

  const updateStatus = async (
    id: string,
    action: "approve" | "reject"
  ) => {
    try {
      setUpdatingId(id)

      const response = await fetch(`/api/admin/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to update service")
      }

      toast.success(
        action === "approve"
          ? "Service approved and visible to customers"
          : "Service rejected"
      )

      setReloadKey((key) => key + 1)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update service"
      )
    } finally {
      setUpdatingId("")
    }
  }

  const visibleServices =
    filter === "all"
      ? services
      : services.filter(
          (service) => (service.approvalStatus ?? "pending") === filter
        )

  const countFor = (value: Filter) =>
    value === "all"
      ? services.length
      : services.filter(
          (service) => (service.approvalStatus ?? "pending") === value
        ).length

  return (
    <>
      <PageHeader
        title="Manage Services"
        description="Review technician submissions and approve the ones customers can see."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              filter === option.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            {option.label} ({countFor(option.value)})
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading services...
        </p>
      ) : error ? (
        <EmptyState title="Could not load services" description={error} />
      ) : visibleServices.length === 0 ? (
        <EmptyState
          title="No services in this view"
          description="Technician submissions will appear here for review."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {visibleServices.map((service) => {
            const status = service.approvalStatus ?? "pending"
            const isBusy = updatingId === service._id

            return (
              <div
                key={service._id}
                className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
              >
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={88}
                    height={72}
                    unoptimized
                    className="h-20 w-20 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Wrench className="h-6 w-6 text-gray-400" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      {service.title}
                    </h2>
                    <StatusBadge status={status} />
                  </div>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {service.category} · {formatCurrency(service.price)}
                  </p>

                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    By {service.technicianName || "Unknown technician"} ·{" "}
                    {service.serviceArea || "No area"} ·{" "}
                    {formatDate(service.createdAt)}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {status !== "approved" && (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => updateStatus(service._id, "approve")}
                        className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve
                      </button>
                    )}

                    {status !== "rejected" && (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => updateStatus(service._id, "reject")}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        <X className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
