import { NextResponse } from "next/server"

import type Stripe from "stripe"

import { jsonError, requireApiRole } from "@/lib/api-server"
import { fulfillPaidBooking } from "@/lib/checkout"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  const guard = await requireApiRole(["customer"])

  if (guard.error) return guard.error

  let body: { sessionId?: unknown }

  try {
    body = await request.json()
  } catch {
    return jsonError(400, "Invalid request body")
  }

  const sessionId =
    typeof body?.sessionId === "string" ? body.sessionId.trim() : ""

  if (!sessionId) {
    return jsonError(400, "A Stripe session id is required")
  }

  let session: Stripe.Checkout.Session

  try {
    session = await stripe.checkout.sessions.retrieve(sessionId)
  } catch (error) {
    console.error("Failed to retrieve Stripe session:", error)

    return jsonError(400, "Invalid Stripe session")
  }

  if (session.mode !== "payment" || session.payment_status !== "paid") {
    return jsonError(400, "Payment has not been completed")
  }

  const bookingId = session.metadata?.bookingId ?? ""
  const customerId = session.metadata?.customerId ?? ""

  if (!/^[a-f\d]{24}$/i.test(bookingId)) {
    return jsonError(400, "Invalid booking reference in payment session")
  }

  if (customerId !== guard.user.id) {
    return jsonError(403, "This payment belongs to another customer")
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id

  const result = await fulfillPaidBooking(bookingId, customerId, {
    sessionId: session.id,
    paymentIntentId,
  })

  if (!result.ok) {
    return jsonError(result.status, result.message)
  }

  return NextResponse.json({ ok: true, bookingId })
}
