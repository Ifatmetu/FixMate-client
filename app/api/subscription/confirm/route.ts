import { NextResponse } from "next/server"

import type Stripe from "stripe"

import { jsonError, requireApiRole } from "@/lib/api-server"
import { fulfillSubscription } from "@/lib/subscription-checkout"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  const guard = await requireApiRole(["technician"])

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
    console.error("Failed to retrieve subscription session:", error)

    return jsonError(400, "Invalid Stripe session")
  }

  if (session.mode !== "payment" || session.payment_status !== "paid") {
    return jsonError(400, "Payment has not been completed")
  }

  if (session.metadata?.purpose !== "subscription") {
    return jsonError(400, "This is not a subscription payment")
  }

  const technicianId = session.metadata?.technicianId ?? ""

  if (!/^[a-f\d]{24}$/i.test(technicianId)) {
    return jsonError(400, "Invalid technician reference in payment session")
  }

  if (technicianId !== guard.user.id) {
    return jsonError(403, "This payment belongs to another technician")
  }

  const amount =
    Number(session.metadata?.amount) ||
    Math.round((session.amount_total ?? 0) / 100)

  if (!Number.isFinite(amount) || amount <= 0) {
    return jsonError(400, "Invalid subscription amount")
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id

  const result = await fulfillSubscription(technicianId, amount, {
    sessionId: session.id,
    paymentIntentId,
  })

  if (!result.ok) {
    return jsonError(result.status, result.message)
  }

  return NextResponse.json({ ok: true })
}
