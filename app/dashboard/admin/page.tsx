import {
  ClipboardList,
  Receipt,
  Users,
  Wrench,
} from "lucide-react"

import {
  EmptyState,
  PageHeader,
  StatCard,
} from "@/components/dashboard/DashboardContent"

export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        description="An overview of users, services, bookings and transactions."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Users"
          value={0}
          hint="Registered accounts"
          icon={Users}
        />

        <StatCard
          label="Services"
          value={0}
          hint="Listed services"
          icon={Wrench}
        />

        <StatCard
          label="Bookings"
          value={0}
          hint="All bookings"
          icon={ClipboardList}
        />

        <StatCard
          label="Transactions"
          value={0}
          hint="Recorded payments"
          icon={Receipt}
        />
      </div>

      <div className="mt-8">
        <EmptyState
          title="No data to display"
          description="Connect your data sources to see live platform statistics here."
        />
      </div>
    </>
  )
}
