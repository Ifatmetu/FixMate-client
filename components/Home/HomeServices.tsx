import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPin, Wrench } from "lucide-react"

import { formatCurrency } from "@/lib/format"
import type { Service } from "@/lib/types"

const MAX_SERVICES = 9

const apiServerUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"
).replace(/\/$/, "")

export default async function HomeServices() {
  let services: Service[] = []

  try {
    const response = await fetch(`${apiServerUrl}/services/approved`, {
      cache: "no-store",
    })

    if (response.ok) {
      const data = await response.json()

      if (Array.isArray(data)) {
        services = data.slice(0, MAX_SERVICES)
      }
    }
  } catch (error) {
    console.error("Failed to load home page services:", error)
  }

  return (
    <section
      id="services"
      data-section="services"
      className="scroll-mt-16 bg-gray-50 px-4 py-16 sm:px-6 lg:px-8 dark:bg-gray-950"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-400">
              FixMate services
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
              Services you can book
            </h2>

            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Trusted technicians for your devices and home appliances.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-[#1D4ED8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1E3A8A]"
          >
            View All Services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Services */}
        {services.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
            <Wrench className="mx-auto h-8 w-8 text-gray-400" />

            <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
              No services yet
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Approved services will appear here soon.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service._id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Image */}
                <div className="relative h-44 bg-gray-100 dark:bg-gray-800">
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
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {service.title}
                    </h3>

                    <span className="shrink-0 text-base font-bold text-gray-900 dark:text-white">
                      {formatCurrency(service.price)}
                    </span>
                  </div>

                  {/* Category */}
                  {service.category && (
                    <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                      {service.category}
                    </p>
                  )}

                  {/* Description */}
                  {service.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                      {service.description}
                    </p>
                  )}

                  {/* Area */}
                  <p className="mt-4 inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <MapPin className="h-3.5 w-3.5" />

                    {service.serviceArea || "Area not specified"}
                  </p>

                  {/* Details */}
                  <Link
                    href={`/services/${service._id}`}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
