import { NextResponse } from "next/server"

import type Stripe from "stripe"

import { fulfillPaidBooking } from "@/lib/checkout"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not configured" },
      { status: 500 }
    )
  }

  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      webhookSecret
    )
  } catch (error) {
    console.error("Invalid Stripe webhook signature:", error)

    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    )
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status === "paid") {
      const bookingId = session.metadata?.bookingId ?? ""
      const customerId = session.metadata?.customerId ?? ""

      if (/^[a-f\d]{24}$/i.test(bookingId) && customerId) {
        const paymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id

        const result = await fulfillPaidBooking(bookingId, customerId, {
          sessionId: session.id,
          paymentIntentId,
        })

        if (!result.ok) {
          console.error("Failed to fulfill Stripe payment:", result)
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
