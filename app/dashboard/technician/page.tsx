"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Inbox,
  PlusCircle,
  Wrench,
} from "lucide-react"

import {
  EmptyState,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/components/dashboard/DashboardContent"
import { formatCurrency, formatDate, pickField } from "@/lib/format"
import type {
  Booking,
  Service,
  TechnicianSubscriptionStatus,
} from "@/lib/types"

const statusRank: Record<string, number> = {
  approved: 0,
  pending: 1,
  rejected: 2,
}

export default function TechnicianDashboardPage() {
  const [services, setServices] = useState<Service[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [subscription, setSubscription] =
    useState<TechnicianSubscriptionStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [servicesResponse, bookingsResponse, subscriptionResponse] =
          await Promise.all([
            fetch("/api/technician/services", { cache: "no-store" }),
            fetch("/api/technician/bookings", { cache: "no-store" }),
            fetch("/api/technician/subscription", { cache: "no-store" }),
          ])

        const [servicesData, bookingsData, subscriptionData] =
          await Promise.all([
            servicesResponse.json().catch(() => ({})),
            bookingsResponse.json().catch(() => ({})),
            subscriptionResponse.json().catch(() => ({})),
          ])

        if (!servicesResponse.ok) {
          throw new Error(
            servicesData?.message ?? "Failed to load your services"
          )
        }

        if (!bookingsResponse.ok) {
          throw new Error(
            bookingsData?.message ?? "Failed to load service requests"
          )
        }

        setServices(Array.isArray(servicesData) ? servicesData : [])
        setBookings(Array.isArray(bookingsData) ? bookingsData : [])
        setSubscription(
          subscriptionResponse.ok
            ? (subscriptionData as TechnicianSubscriptionStatus)
            : null
        )
        setError("")
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data"
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
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

  const newRequests = bookings.filter(
    (booking) => booking.status === "requested" || booking.status === "pending"
  ).length
  const acceptedRequests = bookings.filter(
    (booking) => booking.status === "accepted"
  ).length
  const earnings = bookings
    .filter((booking) => booking.status === "paid")
    .reduce((total, booking) => total + (Number(booking.servicePrice) || 0), 0)
  const recentBookings = bookings.slice(0, 4)

  return (
    <>
      <PageHeader
        title="Technician Dashboard"
        description="Manage your services and respond to customer repair requests."
        action={
          <Link
            href="/dashboard/technician/add-service"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Add service
          </Link>
        }
      />

      {error ? (
        <EmptyState title="Could not load dashboard" description={error} />
      ) : (
        <>
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

            <StatCard
              label="New requests"
              value={isLoading ? "—" : newRequests}
              hint="Waiting for your response"
              icon={Inbox}
            />

            <StatCard
              label="Accepted requests"
              value={isLoading ? "—" : acceptedRequests}
              hint="Customers can pay now"
              icon={CheckCircle2}
            />

            <StatCard
              label="Earnings"
              value={isLoading ? "—" : formatCurrency(earnings)}
              hint="From paid bookings"
              icon={CreditCard}
            />
          </div>

          {!isLoading && subscription && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <CreditCard className="mt-0.5 h-5 w-5 text-blue-600" />

                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      {subscription.isSubscribed
                        ? "Subscription active — unlimited services"
                        : `${subscription.serviceCount} of ${subscription.freeLimit} free services used`}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {subscription.isSubscribed
                        ? "You can keep adding services without a limit."
                        : `Pay ${formatCurrency(subscription.amount)} once with Stripe to unlock unlimited services.`}
                    </p>
                  </div>
                </div>

                <Link
                  href="/dashboard/technician/subscription"
                  className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Manage subscription
                </Link>
              </div>
            </div>
          )}

          <section className="mt-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Your services
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Admin-approved services are marked green and visible to
                  customers.
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

          <section className="mt-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent service requests
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  New requests are waiting for your accept or decline decision.
                </p>
              </div>

              <Link
                href="/dashboard/technician/requests"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
              >
                View all requests
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {isLoading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading your requests...
              </p>
            ) : recentBookings.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="No requests yet"
                description="Customer requests for your services will appear here."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {recentBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="min-w-0 font-semibold text-gray-900 dark:text-white">
                        {pickField(booking, [
                          "serviceTitle",
                          "title",
                          "service",
                        ])}
                      </h3>

                      <StatusBadge status={booking.status ?? "pending"} />
                    </div>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {pickField(booking, ["customerName", "customerEmail"])}
                    </p>

                    <p className="mt-2 text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(booking.servicePrice)}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                      Preferred {formatDate(booking.preferredDate)} · Requested{" "}
                      {formatDate(booking.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </>
  )
}
