"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { CheckCircle2, Loader2, XCircle } from "lucide-react"

type State = "loading" | "success" | "error"

export default function SubscriptionSuccess({
  sessionId,
}: {
  sessionId: string
}) {
  const [state, setState] = useState<State>("loading")
  const [message, setMessage] = useState("")
  const requested = useRef(false)

  useEffect(() => {
    if (!sessionId || requested.current) return

    requested.current = true

    const confirmPayment = async () => {
      try {
        const response = await fetch("/api/subscription/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data?.message ?? "Could not confirm your payment")
        }

        setState("success")
      } catch (err) {
        setState("error")
        setMessage(
          err instanceof Error ? err.message : "Could not confirm your payment"
        )
      }
    }

    confirmPayment()
  }, [sessionId])

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        {state === "loading" && (
          <>
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />

            <h1 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Confirming your subscription...
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Please wait while we activate your subscription.
            </p>
          </>
        )}

        {state === "success" && (
          <>
            <CheckCircle2 className="mx-auto h-10 w-10 text-green-600 dark:text-green-400" />

            <h1 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Payment successful
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Your subscription is active. You can now add unlimited services.
            </p>
          </>
        )}

        {state === "error" && (
          <>
            <XCircle className="mx-auto h-10 w-10 text-red-600 dark:text-red-400" />

            <h1 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Payment could not be confirmed
            </h1>

            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {message}
            </p>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              If you completed the payment, please refresh this page or contact
              support.
            </p>
          </>
        )}

        <Link
          href="/dashboard/technician/subscription"
          className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Go to my subscription
        </Link>
      </div>
    </main>
  )
}
