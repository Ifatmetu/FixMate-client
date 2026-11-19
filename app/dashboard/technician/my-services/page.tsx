"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Wrench, MapPin, DollarSign } from "lucide-react"

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

export default function TechnicianServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadServices = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:5000"

        const response = await fetch(
          `${API_URL}/services`,
          {
            cache: "no-store",
          }
        )

        if (!response.ok) {
          const result = await response.json().catch(() => null)

          throw new Error(
            result?.message ||
              "Failed to load services"
          )
        }

        const data = await response.json()

        setServices(
          Array.isArray(data) ? data : []
        )
      } catch (err) {
        console.error(
          "Failed to load services:",
          err
        )

        setError(
          err instanceof TypeError
            ? "Cannot reach the API server. Make sure the backend is running."
            : err instanceof Error
              ? err.message
              : "Failed to load services"
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
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div
              key={service._id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              {/* =========================
                  Service Image
              ========================= */}

              <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    unoptimized
                    className="object-cover transition duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Wrench className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* =========================
                  Card Content
              ========================= */}

              <div className="p-5">
                {/* Title + Status */}

                <div className="flex items-start justify-between gap-3">
                  <h2 className="line-clamp-2 font-semibold text-gray-900 dark:text-white">
                    {service.title}
                  </h2>

                  <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium capitalize text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                    {service.approvalStatus ??
                      "pending"}
                  </span>
                </div>

                {/* Category */}

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {service.category}
                </p>

                {/* Description */}

                {service.description && (
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    {service.description}
                  </p>
                )}

                {/* Price */}

                <div className="mt-4 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-orange-500" />

                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ৳{service.price}
                  </p>
                </div>

                {/* Service Area */}

                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="h-4 w-4" />

                  <span>
                    {service.serviceArea}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}