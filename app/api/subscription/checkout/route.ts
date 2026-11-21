import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { jsonError, proxyApi, requireApiRole } from "@/lib/api-server"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  const guard = await requireApiRole(["technician"])

  if (guard.error) return guard.error

  const settingsResponse = await proxyApi("/subscription/settings")

  if (!settingsResponse.ok) {
    return jsonError(502, "Could not load the subscription amount")
  }

  const settings = await settingsResponse.json().catch(() => null)
  const amount = Number(settings?.amount)

  if (!Number.isFinite(amount) || amount <= 0) {
    return jsonError(400, "The subscription amount is not configured")
  }

  const unitAmount = Math.round(amount * 100)
  const minimumBdt = Number(process.env.STRIPE_MINIMUM_BDT ?? 100)
  const minimumAmount = Math.round(minimumBdt * 100)

  if (unitAmount < minimumAmount) {
    return jsonError(
      400,
      `Subscription amount must be at least ৳${minimumBdt}. Please contact admin.`
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
              name: "FixMate Technician Subscription",
              description: "Unlimited service submissions",
            },
          },
        },
      ],
      client_reference_id: guard.user.id,
      metadata: {
        purpose: "subscription",
        technicianId: guard.user.id,
        amount: String(amount),
      },
      success_url: `${origin}/api/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/technician/subscription`,
    })

    if (!session.url) {
      return jsonError(500, "Stripe did not return a checkout URL")
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Failed to create subscription checkout:", error)

    return jsonError(500, "Failed to start subscription payment")
  }
}
