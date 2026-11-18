import {
  ClipboardList,
  CreditCard,
  Wrench,
} from "lucide-react"

import {
  EmptyState,
  PageHeader,
  StatCard,
} from "@/components/dashboard/DashboardContent"

export default function CustomerDashboardPage() {
  return (
    <>
      <PageHeader
        title="Customer Dashboard"
        description="Keep track of your repair requests and payments in one place."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total bookings"
          value={0}
          hint="Your repair requests"
          icon={ClipboardList}
        />

        <StatCard
          label="Active requests"
          value={0}
          hint="Currently in progress"
          icon={Wrench}
        />

        <StatCard
          label="Payments"
          value={0}
          hint="Completed transactions"
          icon={CreditCard}
        />
      </div>

      <div className="mt-8">
        <EmptyState
          title="No activity yet"
          description="Once you book a repair, your latest activity will show up here."
        />
      </div>
    </>
  )
}
