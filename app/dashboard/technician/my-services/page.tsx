"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Plus, Wrench } from "lucide-react"
import toast from "react-hot-toast"

import {
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/dashboard/DashboardContent"
import { formatCurrency, formatDate } from "@/lib/format"
import type { ApprovalStatus, Service } from "@/lib/types"

type Filter = "all" | ApprovalStatus

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
]

export default function TechnicianServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [filter, setFilter] = useState<Filter>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [busyId, setBusyId] = useState("")

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch("/api/technician/services", {
          cache: "no-store",
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data?.message ?? "Failed to load services")
        }

        setServices(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load services")
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()
  }, [])

  const toggleAvailability = async (service: Service) => {
    const nextAvailability =
      service.availability === "unavailable" ? "available" : "unavailable"

    try {
      setBusyId(service._id)

      const response = await fetch(`/api/technician/services/${service._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability: nextAvailability }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to update availability")
      }

      setServices((current) =>
        current.map((item) =>
          item._id === service._id
            ? { ...item, availability: nextAvailability }
            : item
        )
      )

      toast.success(
        nextAvailability === "available"
          ? "Service is now available to customers"
          : "Service is now unavailable"
      )
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update availability"
      )
    } finally {
      setBusyId("")
    }
  }

  const countFor = (value: Filter) =>
    value === "all"
      ? services.length
      : services.filter(
          (service) => (service.approvalStatus ?? "pending") === value
        ).length

  const visibleServices =
    filter === "all"
      ? services
      : services.filter(
          (service) => (service.approvalStatus ?? "pending") === filter
        )

  return (
    <>
      <PageHeader
        title="My Services"
        description="All services you submitted — pending, approved, and rejected."
        action={
          <Link
            href="/dashboard/technician/add-service"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add service
          </Link>
        }
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
          icon={Wrench}
          title={
            services.length === 0 ? "No services yet" : `No ${filter} services`
          }
          description={
            services.length === 0
              ? "Add your first service; it will appear here with all the other services you submit."
              : "Services with this approval status will appear here."
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleServices.map((service) => (
            <div
              key={service._id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Wrench className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    {service.title}
                  </h2>

                  <StatusBadge status={service.approvalStatus ?? "pending"} />
                </div>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {service.category}
                </p>

                {service.description && (
                  <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                    {service.description}
                  </p>
                )}

                <p className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(service.price)}
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {service.serviceArea || "No area"} · Submitted{" "}
                  {formatDate(service.createdAt)}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-950/50">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {service.approvalStatus !== "approved"
                      ? "Availability can be changed after approval"
                      : service.availability === "unavailable"
                        ? "Unavailable to customers"
                        : "Available to customers"}
                  </span>

                  {service.approvalStatus === "approved" && (
                    <button
                      type="button"
                      onClick={() => toggleAvailability(service)}
                      disabled={busyId === service._id}
                      className="shrink-0 rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 transition hover:border-blue-600 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    >
                      {busyId === service._id
                        ? "Saving..."
                        : service.availability === "unavailable"
                          ? "Mark available"
                          : "Mark unavailable"}
                    </button>
                  )}
                </div>

                {service.approvalStatus === "rejected" && (
                  <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
                    This service was not approved. Update it and submit again.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
