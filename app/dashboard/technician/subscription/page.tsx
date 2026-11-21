"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  RefreshCw,
} from "lucide-react"
import toast from "react-hot-toast"

import {
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/dashboard/DashboardContent"
import { formatCurrency } from "@/lib/format"
import type { TechnicianSubscriptionStatus } from "@/lib/types"

export default function TechnicianSubscriptionPage() {
  const [status, setStatus] = useState<TechnicianSubscriptionStatus | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/technician/subscription", {
          cache: "no-store",
        })

        const result = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(result?.message ?? "Failed to load subscription")
        }

        setStatus(result as TechnicianSubscriptionStatus)
        setError("")
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load subscription"
        )
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [reloadKey])

  const limitReached =
    status !== null && status.serviceCount >= status.freeLimit

  const startCheckout = async () => {
    try {
      setCheckoutLoading(true)

      const response = await fetch("/api/subscription/checkout", {
        method: "POST",
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result?.message ?? "Could not start payment")
      }

      if (typeof result?.url !== "string" || !result.url) {
        throw new Error("Stripe did not return a checkout URL")
      }

      window.location.assign(result.url)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not start payment"
      )
      setCheckoutLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        title="My subscription"
        description="Your free service limit and subscription status."
        action={
          <button
            type="button"
            onClick={() => {
              setIsLoading(true)
              setReloadKey((key) => key + 1)
            }}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        }
      />

      {error ? (
        <EmptyState title="Could not load subscription" description={error} />
      ) : isLoading || !status ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading subscription...
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Service limit
                </h2>
              </div>

              <StatusBadge
                status={status.isSubscribed ? "active" : "inactive"}
              />
            </div>

            <div className="mt-6">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {status.serviceCount}
                    <span className="text-lg font-medium text-gray-400">
                      {" "}
                      / {status.freeLimit}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    services submitted
                  </p>
                </div>

                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {status.isSubscribed
                    ? "Unlimited"
                    : `${status.remaining} left`}
                </p>
              </div>

              {!status.isSubscribed && (
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                      width: `${Math.min(
                        (status.serviceCount / status.freeLimit) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {status.isSubscribed
                ? "Subscription active"
                : "Unlock unlimited services"}
            </h2>

            {status.isSubscribed ? (
              <>
                <div className="mt-4 flex items-start gap-3 rounded-lg bg-green-50 p-4 dark:bg-green-950/40">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />

                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                      You can add unlimited services.
                    </p>
                    <p className="mt-1 text-xs text-green-700 dark:text-green-400">
                      One-time subscription amount:{" "}
                      {formatCurrency(
                        status.subscription?.amount ?? status.amount
                      )}
                    </p>
                  </div>
                </div>

                <Link
                  href="/dashboard/technician/add-service"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Add a service
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <>
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  {limitReached
                    ? "You have used all your free services. "
                    : "Pay the one-time amount of "}
                  {!limitReached && (
                    <strong className="text-gray-900 dark:text-white">
                      {formatCurrency(status.amount)}
                    </strong>
                  )}
                  {limitReached
                    ? "Subscribe to keep adding services."
                    : " securely with Stripe to unlock unlimited services."}
                </p>

                <button
                  type="button"
                  onClick={startCheckout}
                  disabled={checkoutLoading}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {checkoutLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CreditCard className="h-4 w-4" />
                  )}
                  {checkoutLoading ? "Opening payment..." : "Get Subscription"}
                </button>

                <ol className="mt-5 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      1
                    </span>
                    Click <strong>Get Subscription</strong> and complete the
                    payment with Stripe.
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      2
                    </span>
                    Your subscription activates automatically after payment.
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      3
                    </span>
                    Return here and add unlimited services.
                  </li>
                </ol>

                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  Prefer manual payment? Pay the admin directly and ask them to
                  activate your subscription from the Subscriptions page.
                </p>

                {limitReached && (
                  <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                    New services are blocked until your subscription is active.
                  </p>
                )}
              </>
            )}
          </section>
        </div>
      )}
    </>
  )
}
