import { proxyApi } from "@/lib/api-server"

type FulfillResult =
  { ok: true } | { ok: false; status: number; message: string }

/**
 * Activate a technician subscription after a successful Stripe payment.
 * Safe to call from both the success page and the webhook: the backend is
 * idempotent and never records the same Stripe session twice.
 */
export async function fulfillSubscription(
  technicianId: string,
  amount: number,
  stripeDetails?: { sessionId?: string; paymentIntentId?: string }
): Promise<FulfillResult> {
  const response = await proxyApi("/internal/subscription/pay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-fixmate-service-token": process.env.FIXMATE_SERVICE_TOKEN ?? "",
    },
    body: JSON.stringify({
      technicianId,
      amount,
      stripeSessionId: stripeDetails?.sessionId ?? null,
      stripePaymentIntentId: stripeDetails?.paymentIntentId ?? null,
    }),
  })

  if (response.ok) return { ok: true }

  const data = await response.json().catch(() => ({}))

  // Already active — the webhook or success page handled it first.
  if (response.status === 409) return { ok: true }

  return {
    ok: false,
    status: response.status,
    message: data?.message ?? "Failed to activate subscription",
  }
}
