"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Mail, MapPin, Wrench } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import toast from "react-hot-toast"

import { authClient } from "@/lib/auth-client"
import { formatCurrency } from "@/lib/format"
import type { Service } from "@/lib/types"

export default function ServiceDetailsPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()

  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const [service, setService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showRequest, setShowRequest] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requestForm, setRequestForm] = useState({
    customerName: "",
    customerEmail: "",
    phone: "",
    preferredDate: "",
    message: "",
  })

  useEffect(() => {
    if (!id || isSessionPending || session?.user) return

    router.replace(`/sign-in?redirect=${encodeURIComponent(`/services/${id}`)}`)
  }, [id, isSessionPending, session?.user, router])

  useEffect(() => {
    if (!id) return

    const loadService = async () => {
      try {
        const response = await fetch(
          `/api/server/services/${encodeURIComponent(id)}`,
          { cache: "no-store" }
        )

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data?.message ?? "Failed to load service details")
        }

        setService(data)
      } catch (err) {
        setError(
          err instanceof TypeError
            ? "Cannot reach the API server. Please try again later."
            : err instanceof Error
              ? err.message
              : "Failed to load service details"
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadService()
  }, [id])

  const handleRequestChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    setRequestForm((current) => ({ ...current, [name]: value }))
  }

  const submitRequest = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!service) return

    const customerName =
      requestForm.customerName.trim() || session?.user?.name || ""
    const customerEmail =
      requestForm.customerEmail.trim() || session?.user?.email || ""

    if (!customerName || !customerEmail) {
      toast.error("Please provide your name and email")
      return
    }

    try {
      setIsSubmitting(true)

      // The API route resolves the service and the signed-in customer so the
      // booking is always linked to the correct technician.
      const response = await fetch("/api/customer/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service._id,
          customerName,
          customerEmail,
          phone: requestForm.phone,
          preferredDate: requestForm.preferredDate,
          message: requestForm.message,
        }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to send repair request")
      }

      toast.success("Repair request sent. The technician will contact you.")
      setShowRequest(false)
      setRequestForm({
        customerName: "",
        customerEmail: "",
        phone: "",
        preferredDate: "",
        message: "",
      })
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send repair request"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  /* Loading */
  if (isLoading || isSessionPending || !session?.user) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading service details...
          </p>
        </div>
      </main>
    )
  }

  /* Error / unavailable */
  if (
    error ||
    !service ||
    service.approvalStatus !== "approved" ||
    service.availability === "unavailable"
  ) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error ||
              (service
                ? "This service is not available."
                : "Service not found")}
          </div>

          <Link
            href="/services"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>

        {/* Main Details */}
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="relative min-h-[350px] bg-gray-100 dark:bg-gray-800">
              {service.image ? (
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[350px] items-center justify-center">
                  <Wrench className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Service Information */}
          <div>
            {/* Category */}
            <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">
              {service.category}
            </p>

            {/* Title */}
            <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
              {service.title}
            </h1>

            {/* Price */}
            <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(service.price)}
            </p>

            {/* Technician */}
            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">
              <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-400">
                Service Technician
              </p>

              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>

                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {service.technicianName || "Technician"}
                  </p>

                  {service.technicianEmail && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                      <Mail className="h-3.5 w-3.5" />
                      {service.technicianEmail}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Service Information */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <MapPin className="h-5 w-5 text-blue-600" />

                <span>{service.serviceArea || "Area not specified"}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <Wrench className="h-5 w-5 text-blue-600" />

                <span>{service.serviceMode || "Home Service"}</span>
              </div>
            </div>

            {/* Request Repair */}
            <button
              type="button"
              onClick={() => setShowRequest((value) => !value)}
              className="mt-8 w-full rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              {showRequest ? "Cancel request" : "Request Repair"}
            </button>

            {showRequest && (
              <form
                onSubmit={submitRequest}
                className="mt-4 space-y-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Repair request details
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    name="customerName"
                    value={requestForm.customerName}
                    onChange={handleRequestChange}
                    placeholder={session?.user?.name || "Your name"}
                    aria-label="Your name"
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />

                  <input
                    name="customerEmail"
                    type="email"
                    value={requestForm.customerEmail}
                    onChange={handleRequestChange}
                    placeholder={session?.user?.email || "Your email"}
                    aria-label="Your email"
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />

                  <input
                    name="phone"
                    value={requestForm.phone}
                    onChange={handleRequestChange}
                    placeholder="Phone number"
                    aria-label="Phone number"
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />

                  <input
                    name="preferredDate"
                    type="date"
                    value={requestForm.preferredDate}
                    onChange={handleRequestChange}
                    aria-label="Preferred date"
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />
                </div>

                <textarea
                  name="message"
                  value={requestForm.message}
                  onChange={handleRequestChange}
                  rows={3}
                  placeholder="Describe the problem (optional)"
                  aria-label="Describe the problem"
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Sending..." : "Send request"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Service Description
          </h2>

          <p className="mt-3 text-sm leading-7 whitespace-pre-line text-gray-600 dark:text-gray-300">
            {service.description || "No description provided."}
          </p>
        </div>

        {/* Technician Information */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Technician Information
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Name
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                {service.technicianName || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Email
              </p>

              <p className="mt-1 text-sm font-semibold break-all text-gray-900 dark:text-white">
                {service.technicianEmail || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Service Area
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                {service.serviceArea || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Service Mode
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                {service.serviceMode || "Home Service"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
