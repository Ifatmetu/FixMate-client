"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Wrench } from "lucide-react"

import { formatCurrency } from "@/lib/format"
import type { Service } from "@/lib/types"

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [category, setCategory] = useState("all")

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch("/api/server/services/approved", {
          cache: "no-store",
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data?.message ?? "Failed to load services")
        }

        setServices(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(
          err instanceof TypeError
            ? "Cannot reach the API server. Please try again later."
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

  const categories = useMemo(
    () =>
      Array.from(
        new Set(services.map((service) => service.category).filter(Boolean))
      ),
    [services]
  )

  const visibleServices =
    category === "all"
      ? services
      : services.filter((service) => service.category === category)

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">
            FixMate services
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            Find a trusted repair service
          </h1>

          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Browse services approved by our admin team and offered by verified
            technicians.
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                category === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300"
              }`}
            >
              All
            </button>

            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  category === item
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {/* Services */}
        <div className="mt-8">
          {isLoading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading services...
            </p>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          ) : visibleServices.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
              <Wrench className="mx-auto h-8 w-8 text-gray-400" />

              <h2 className="mt-3 font-semibold text-gray-900 dark:text-white">
                No approved services yet
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Services appear here after an admin approves them.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleServices.map((service) => (
                <article
                  key={service._id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
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
                        <Wrench className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-semibold text-gray-900 dark:text-white">
                        {service.title}
                      </h2>

                      <span className="shrink-0 text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(service.price)}
                      </span>
                    </div>

                    {/* Category */}
                    <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                      {service.category}
                    </p>

                    {/* Description */}
                    {service.description && (
                      <p className="mt-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
                        {service.description}
                      </p>
                    )}

                    {/* Area + Mode */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />

                        {service.serviceArea || "Area not specified"}
                      </span>

                      <span>{service.serviceMode || "Home Service"}</span>
                    </div>

                    {/* Technician */}
                    {service.technicianName && (
                      <p className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                        By{" "}
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {service.technicianName}
                        </span>
                      </p>
                    )}

                    {/* Details Button */}
                    <Link
                      href={`/services/${service._id}`}
                      className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
