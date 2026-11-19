"use client"

import { useEffect, useState } from "react"
import { Wrench } from "lucide-react"

import {
  EmptyState,
  PageHeader,
} from "@/components/dashboard/DashboardContent"

type Service = {
  _id: string
  title: string
  category: string
  description?: string
  image?: string
  price: number
  serviceArea: string
  approvalStatus?: string
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"

export default function TechnicianServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch(`${API_URL}/services`, {
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error("Failed to load services")
        }

        const data = await response.json()

        setServices(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load services"
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()
  }, [])

  return (
    <>
      <PageHeader
        title="My Services"
        description="Manage the services you currently offer."
      />

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading services...
        </p>
      ) : error ? (
        <EmptyState
          icon={Wrench}
          title="Could not load services"
          description={error}
        />
      ) : services.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No services yet"
          description="Services you add will appear here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div
              key={service._id}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {service.title}
                </h2>

                <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium capitalize text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                  {service.approvalStatus ?? "pending"}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {service.category}
              </p>

              <p className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                ৳{service.price}
              </p>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {service.serviceArea}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
