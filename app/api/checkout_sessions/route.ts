import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { jsonError, proxyApi, requireApiRole } from "@/lib/api-server"
import { stripe } from "@/lib/stripe"
import type { Booking } from "@/lib/types"

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

export async function POST(request: Request) {
  const guard = await requireApiRole(["customer"])

  if (guard.error) return guard.error

  let body: { bookingId?: unknown }

  try {
    body = await request.json()
  } catch {
    return jsonError(400, "Invalid request body")
  }

  const bookingId = asText(body?.bookingId)

  if (!/^[a-f\d]{24}$/i.test(bookingId)) {
    return jsonError(400, "Invalid booking ID")
  }

  const query = new URLSearchParams({ customerId: guard.user.id })
  const bookingResponse = await proxyApi(
    `/bookings/${bookingId}?${query.toString()}`
  )

  if (!bookingResponse.ok) {
    const data = await bookingResponse.json().catch(() => ({}))

    if (bookingResponse.status === 404) {
      return jsonError(404, "Booking not found")
    }

    return jsonError(
      bookingResponse.status,
      data?.message ?? "Failed to load booking"
    )
  }

  const booking = (await bookingResponse
    .json()
    .catch(() => null)) as Booking | null

  if (!booking) {
    return jsonError(502, "Could not load booking details")
  }

  if (booking.status !== "accepted") {
    return jsonError(409, "This booking is not ready for payment")
  }

  const unitAmount = Math.round(Number(booking.servicePrice) * 100)

  if (!Number.isFinite(unitAmount) || unitAmount <= 0) {
    return jsonError(400, "This booking has an invalid price")
  }

  // Stripe requires every charge to convert to at least ~$0.50. ৳100 is a
  // safe minimum in BDT, so reject smaller bookings before calling Stripe.
  const minimumBdt = Number(process.env.STRIPE_MINIMUM_BDT ?? 100)
  const minimumAmount = Math.round(minimumBdt * 100)

  if (unitAmount < minimumAmount) {
    return jsonError(
      400,
      `Stripe requires a minimum payment of ৳${minimumBdt}. Please ask the technician to update the service price.`
    )
  }

  const headerList = await headers()
  const origin = headerList.get("origin") ?? new URL(request.url).origin

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "bdt",
            unit_amount: unitAmount,
            product_data: {
              name: asText(booking.serviceTitle) || "FixMate repair service",
              description: `Booking ${bookingId}`,
            },
          },
        },
      ],
      customer_email: asText(booking.customerEmail) || undefined,
      client_reference_id: bookingId,
      metadata: {
        bookingId,
        customerId: guard.user.id,
      },
      success_url: `${origin}/api/checkout_sessions/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/customer/bookings`,
    })

    if (!session.url) {
      return jsonError(500, "Stripe did not return a checkout URL")
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Failed to create Stripe Checkout Session:", error)

    return jsonError(500, "Failed to start checkout. Please try again.")
  }
}
