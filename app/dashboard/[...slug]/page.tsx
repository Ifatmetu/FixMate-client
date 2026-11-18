"use client"

import { useParams } from "next/navigation"
import {
  ClipboardList,
  CreditCard,
  PlusCircle,
  Receipt,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react"

import {
  EmptyState,
  PageHeader,
} from "@/components/dashboard/DashboardContent"

const sections: Record<
  string,
  { title: string; description: string; icon: LucideIcon }
> = {
  "customer/bookings": {
    title: "My Bookings",
    description: "All of your repair bookings in one place.",
    icon: ClipboardList,
  },
  "customer/payments": {
    title: "Payment History",
    description: "Review payments you have made for your repairs.",
    icon: CreditCard,
  },
  "technician/add-service": {
    title: "Add Service",
    description: "Create a new service for customers to book.",
    icon: PlusCircle,
  },
  "technician/my-services": {
    title: "My Services",
    description: "Manage the services you currently offer.",
    icon: Wrench,
  },
  "technician/requests": {
    title: "Service Requests",
    description: "Requests sent by customers for your services.",
    icon: ClipboardList,
  },
  "admin/users": {
    title: "Manage Users",
    description: "View and manage everyone using FixMate.",
    icon: Users,
  },
  "admin/services": {
    title: "Manage Services",
    description: "Oversee all services listed on the platform.",
    icon: Wrench,
  },
  "admin/bookings": {
    title: "Manage Bookings",
    description: "Track every booking across the platform.",
    icon: ClipboardList,
  },
  "admin/transactions": {
    title: "Transactions",
    description: "Review all recorded payments and payouts.",
    icon: Receipt,
  },
}

export default function DashboardSectionPage() {
  const params = useParams<{ slug: string[] }>()
  const key = (params.slug ?? []).join("/")
  const section = sections[key]

  if (!section) {
    return (
      <>
        <PageHeader
          title="Page not found"
          description="This dashboard page does not exist."
        />

        <EmptyState
          title="Nothing to show"
          description="Use the sidebar to navigate to a valid dashboard page."
        />
      </>
    )
  }

  const Icon = section.icon

  return (
    <>
      <PageHeader
        title={section.title}
        description={section.description}
      />

      <EmptyState
        icon={Icon}
        title={`No ${section.title.toLowerCase()} yet`}
        description="This section is ready and will display data once it is connected."
      />
    </>
  )
}
