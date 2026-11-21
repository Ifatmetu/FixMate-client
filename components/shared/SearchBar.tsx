"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Search, X } from "lucide-react"

interface Service {
  _id: string
  title: string
  category?: string
  technicianName?: string
  price?: number
  image?: string
  imageUrl?: string
}

export default function SearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)

  const searchRef = useRef<HTMLDivElement>(null)

  // =========================
  // FETCH APPROVED SERVICES
  // =========================
  useEffect(() => {
    if (!open) return

    const fetchServices = async () => {
      try {
        setLoading(true)

        const response = await fetch("/api/server/services/approved", {
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch services")
        }

        const data = await response.json()

        setServices(Array.isArray(data) ? data : data.services || [])
      } catch (error) {
        console.error("Search fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [open])

  // =========================
  // CLOSE WHEN CLICK OUTSIDE
  // =========================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // =========================
  // FILTER SERVICES
  // =========================
  const filteredServices =
    query.trim().length === 0
      ? []
      : services.filter((service) => {
          const searchText = query.toLowerCase()

          return (
            service.title?.toLowerCase().includes(searchText) ||
            service.technicianName?.toLowerCase().includes(searchText) ||
            service.category?.toLowerCase().includes(searchText)
          )
        })

  return (
    <div ref={searchRef} className="relative">
      {/* =========================
          SEARCH BUTTON
      ========================= */}
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Search services"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
        >
          <Search className="h-5 w-5" />
        </button>
      ) : (
        /* =========================
           SEARCH INPUT
        ========================= */
        <div className="relative w-72 sm:w-80">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search service or technician..."
            className="h-10 w-full rounded-lg border border-gray-300 bg-white pr-9 pl-9 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950"
          />

          <button
            type="button"
            onClick={() => {
              setQuery("")
              setOpen(false)
            }}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* =========================
          SEARCH RESULTS
      ========================= */}
      {open && query.trim() && (
        <div className="absolute top-12 right-0 z-50 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
          {loading ? (
            <div className="px-4 py-4 text-sm text-gray-500">Searching...</div>
          ) : filteredServices.length === 0 ? (
            <div className="px-4 py-5 text-center">
              <Search className="mx-auto h-5 w-5 text-gray-400" />

              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                No services found
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Try another service or technician name.
              </p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {filteredServices.map((service) => (
                <Link
                  key={service._id}
                  href={`/services/${service._id}`}
                  onClick={() => {
                    setOpen(false)
                    setQuery("")
                  }}
                  className="flex gap-3 border-b border-gray-100 px-4 py-3 transition hover:bg-blue-50 dark:border-gray-800 dark:hover:bg-gray-800"
                >
                  {/* Image */}
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                    {service.imageUrl || service.image ? (
                      <img
                        src={service.imageUrl || service.image}
                        alt={service.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {service.title}
                    </p>

                    {service.technicianName && (
                      <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                        Technician: {service.technicianName}
                      </p>
                    )}

                    {service.category && (
                      <p className="mt-1 text-xs text-blue-600 capitalize dark:text-blue-400">
                        {service.category}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
