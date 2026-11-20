import { proxyApi } from "@/lib/api-server"

type FulfillResult =
  { ok: true } | { ok: false; status: number; message: string }

/**
 * Mark a Stripe-paid booking as paid and record the payment in the backend.
 * Safe to call more than once (success page + webhook): the backend rejects
 * repeat payments with 409 and never inserts a duplicate payment document.
 */
export async function fulfillPaidBooking(
  bookingId: string,
  customerId: string,
  stripeDetails?: { sessionId?: string; paymentIntentId?: string }
): Promise<FulfillResult> {
  const response = await proxyApi(`/bookings/${bookingId}/pay`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerId,
      stripeSessionId: stripeDetails?.sessionId ?? null,
      stripePaymentIntentId: stripeDetails?.paymentIntentId ?? null,
    }),
  })

  if (response.ok) return { ok: true }

  const data = await response.json().catch(() => ({}))

  // Already paid — the webhook or the success page handled it first.
  if (response.status === 409) return { ok: true }

  return {
    ok: false,
    status: response.status,
    message: data?.message ?? "Failed to record payment",
  }
}
