"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ClipboardList, PlusCircle, Wrench } from "lucide-react"

import {
  EmptyState,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/components/dashboard/DashboardContent"
import { formatCurrency } from "@/lib/format"
import type { Service } from "@/lib/types"

const statusRank: Record<string, number> = {
  approved: 0,
  pending: 1,
  rejected: 2,
}

export default function TechnicianDashboardPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

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

  const myServices = [...services].sort(
    (a, b) =>
      (statusRank[a.approvalStatus ?? "pending"] ?? 1) -
      (statusRank[b.approvalStatus ?? "pending"] ?? 1)
  )
  const approved = services.filter(
    (service) => service.approvalStatus === "approved"
  ).length
  const pending = services.filter(
    (service) => (service.approvalStatus ?? "pending") === "pending"
  ).length
  const rejected = services.filter(
    (service) => service.approvalStatus === "rejected"
  ).length

  return (
    <>
      <PageHeader
        title="Technician Dashboard"
        description="Manage the services you offer and track admin approvals."
        action={
          <Link
            href="/dashboard/technician/add-service"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Add service
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Approved services"
          value={isLoading ? "—" : approved}
          hint="Visible to customers"
          icon={Wrench}
        />

        <StatCard
          label="Pending approval"
          value={isLoading ? "—" : pending}
          hint="Waiting for admin review"
          icon={ClipboardList}
        />

        <StatCard
          label="Rejected"
          value={isLoading ? "—" : rejected}
          hint="Need a new submission"
          icon={PlusCircle}
        />
      </div>

      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your services
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Admin-approved services are marked green and visible to customers.
            </p>
          </div>

          <Link
            href="/dashboard/technician/my-services"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
          >
            View all my services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading your services...
          </p>
        ) : error ? (
          <EmptyState title="Could not load services" description={error} />
        ) : myServices.length === 0 ? (
          <EmptyState
            icon={Wrench}
            title="No services yet"
            description="Add your first service and it will appear here with its approval status."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {myServices.map((service) => (
              <div
                key={service._id}
                className="flex gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
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
                      <Wrench className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="truncate font-semibold text-gray-900 dark:text-white">
                      {service.title}
                    </h3>

                    <StatusBadge status={service.approvalStatus} />
                  </div>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {service.category}
                  </p>

                  <p className="mt-2 text-sm font-bold text-gray-900 dark:text-white">
                    {formatCurrency(service.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
