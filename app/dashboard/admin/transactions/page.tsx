"use client"

import { useEffect, useState } from "react"

import {
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/dashboard/DashboardContent"
import { formatCurrency, formatDate, pickField } from "@/lib/format"
import type { Payment } from "@/lib/types"

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const response = await fetch("/api/admin/payments", {
          cache: "no-store",
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data?.message ?? "Failed to load transactions")
        }

        setPayments(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load transactions"
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadPayments()
  }, [])

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Review all recorded payments and payouts."
      />

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading transactions...
        </p>
      ) : error ? (
        <EmptyState title="Could not load transactions" description={error} />
      ) : payments.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          description="Payments will appear here once they are recorded."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-950 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {payments.map((payment) => {
                const rawAmount = pickField(payment, ["amount", "price"])

                return (
                  <tr key={payment._id}>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {pickField(payment, [
                        "customerName",
                        "name",
                        "userEmail",
                        "email",
                      ])}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {pickField(payment, ["serviceTitle", "title", "service"])}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {rawAmount === "—" ? "—" : formatCurrency(rawAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={payment.status ?? "pending"} />
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {formatDate(payment.createdAt)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
