"use client"

import { useEffect, useState } from "react"
import { CreditCard } from "lucide-react"

import {
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/dashboard/DashboardContent"
import { formatCurrency, formatDate, pickField } from "@/lib/format"
import type { Payment } from "@/lib/types"

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setIsLoading(true)

        const response = await fetch("/api/customer/payments", {
          cache: "no-store",
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data?.message ?? "Failed to load payments")
        }

        setPayments(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load payments")
      } finally {
        setIsLoading(false)
      }
    }

    loadPayments()
  }, [])

  return (
    <>
      <PageHeader
        title="Payment History"
        description="Review payments you have made for your repairs."
      />

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading payments...
        </p>
      ) : payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No payments yet"
          description="Your completed payments will appear here."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {payments.map((payment) => {
            const reference =
              typeof payment.paymentReference === "string"
                ? payment.paymentReference
                : ""

            return (
              <div
                key={payment._id}
                className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      {pickField(payment, ["serviceTitle", "title", "service"])}
                    </h2>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(payment.createdAt)}
                    </p>
                  </div>

                  <StatusBadge status={payment.status ?? "paid"} />
                </div>

                <p className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(payment.amount ?? payment.servicePrice)}
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {pickField(payment, ["technicianName", "technicianId"])}
                  {" · "}
                  {String(payment.method ?? "manual").toUpperCase()}
                </p>

                {reference && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    TrxID: {reference}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
