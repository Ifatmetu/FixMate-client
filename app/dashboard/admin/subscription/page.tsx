"use client"

import { useEffect, useState } from "react"
import { CreditCard, RefreshCw } from "lucide-react"
import toast from "react-hot-toast"

import {
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/dashboard/DashboardContent"
import { formatCurrency } from "@/lib/format"
import type { ManagedTechnicianSubscription } from "@/lib/types"

type SubscriptionData = {
  freeLimit: number
  amount: number
  technicians: ManagedTechnicianSubscription[]
}

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"

export default function AdminSubscriptionPage() {
  const [data, setData] = useState<SubscriptionData | null>(null)
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [savingAmount, setSavingAmount] = useState(false)
  const [busyId, setBusyId] = useState("")
  const [error, setError] = useState("")
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/admin/subscription/technicians", {
          cache: "no-store",
        })

        const result = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(result?.message ?? "Failed to load subscriptions")
        }

        setData(result as SubscriptionData)
        setAmount(String(result?.amount ?? ""))
        setError("")
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load subscriptions"
        )
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [reloadKey])

  const saveAmount = async (event: React.FormEvent) => {
    event.preventDefault()

    const numericAmount = Number(amount)

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      toast.error("Enter an amount greater than 0")
      return
    }

    try {
      setSavingAmount(true)

      const response = await fetch("/api/admin/subscription/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: numericAmount }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to save amount")
      }

      setData((current) =>
        current ? { ...current, amount: numericAmount } : current
      )
      toast.success("Subscription amount updated")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save amount")
    } finally {
      setSavingAmount(false)
    }
  }

  const toggleSubscription = async (
    technician: ManagedTechnicianSubscription
  ) => {
    const nextStatus = technician.isSubscribed ? "inactive" : "active"

    if (
      technician.isSubscribed &&
      !window.confirm(
        `Revoke the subscription for ${technician.name || technician.email}?`
      )
    ) {
      return
    }

    try {
      setBusyId(technician.id)

      const response = await fetch(`/api/admin/subscription/${technician.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to update subscription")
      }

      setData((current) =>
        current
          ? {
              ...current,
              technicians: current.technicians.map((item) =>
                item.id === technician.id
                  ? { ...item, isSubscribed: nextStatus === "active" }
                  : item
              ),
            }
          : current
      )

      toast.success(
        nextStatus === "active"
          ? "Subscription activated"
          : "Subscription revoked"
      )
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update subscription"
      )
    } finally {
      setBusyId("")
    }
  }

  return (
    <>
      <PageHeader
        title="Technician subscriptions"
        description="Set the subscription amount. Stripe payments activate automatically; manual payments can be activated here."
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

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Subscription amount
              </h2>
            </div>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Each technician can submit{" "}
              <strong>{data?.freeLimit ?? 3} services for free</strong>. After
              that, collect this one-time amount and activate their subscription
              to let them add unlimited services.
            </p>
          </div>

          <form
            onSubmit={saveAmount}
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end"
          >
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Amount (BDT)
              </span>
              <input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className={`${inputClass} sm:w-40`}
                placeholder="1000"
              />
            </label>

            <button
              type="submit"
              disabled={savingAmount}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingAmount ? "Saving..." : "Save amount"}
            </button>
          </form>
        </div>

        {data && (
          <p className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
            Current amount: <strong>{formatCurrency(data.amount)}</strong>{" "}
            (one-time)
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Technicians
        </h2>

        {isLoading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading technicians...
          </p>
        ) : !data || data.technicians.length === 0 ? (
          <EmptyState
            title="No technicians yet"
            description="Registered technicians will appear here."
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase dark:bg-gray-950 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Technician</th>
                  <th className="px-4 py-3 font-medium">Services</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {data.technicians.map((technician) => {
                  const limitReached =
                    technician.serviceCount >= technician.freeLimit

                  return (
                    <tr key={technician.id}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {technician.name || "—"}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {technician.email || "—"}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={
                            limitReached && !technician.isSubscribed
                              ? "font-semibold text-red-600 dark:text-red-400"
                              : "text-gray-600 dark:text-gray-300"
                          }
                        >
                          {technician.serviceCount} / {technician.freeLimit}
                        </span>
                        {limitReached && !technician.isSubscribed && (
                          <p className="mt-0.5 text-xs text-red-500">
                            Limit reached
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge
                          status={
                            technician.isSubscribed ? "active" : "inactive"
                          }
                        />
                      </td>

                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleSubscription(technician)}
                          disabled={busyId === technician.id}
                          className={
                            technician.isSubscribed
                              ? "rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                              : "rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                          }
                        >
                          {busyId === technician.id
                            ? "Saving..."
                            : technician.isSubscribed
                              ? "Revoke"
                              : "Mark paid & activate"}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}
