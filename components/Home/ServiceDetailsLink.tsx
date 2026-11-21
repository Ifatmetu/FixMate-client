"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { authClient } from "@/lib/auth-client"

interface ServiceDetailsLinkProps {
  serviceId: string
}

const buttonClassName =
  "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"

export default function ServiceDetailsLink({
  serviceId,
}: ServiceDetailsLinkProps) {
  const { data: session, isPending } = authClient.useSession()

  const detailsHref = `/services/${encodeURIComponent(serviceId)}`
  const signInHref = `/sign-in?redirect=${encodeURIComponent(detailsHref)}`

  // Avoid sending a signed-in user to sign-in while the session is loading.
  if (isPending) {
    return (
      <button type="button" disabled className={buttonClassName}>
        View Details
        <ArrowRight className="h-4 w-4" />
      </button>
    )
  }

  return (
    <Link
      href={session?.user ? detailsHref : signInHref}
      className={buttonClassName}
    >
      View Details
      <ArrowRight className="h-4 w-4" />
    </Link>
  )
}
