import {
  ClipboardList,
  Wrench,
  PlusCircle,
} from "lucide-react"

import {
  EmptyState,
  PageHeader,
  StatCard,
} from "@/components/dashboard/DashboardContent"

export default function TechnicianDashboardPage() {
  return (
    <>
      <PageHeader
        title="Technician Dashboard"
        description="Manage the services you offer and the requests coming your way."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Services listed"
          value={0}
          hint="Your published services"
          icon={Wrench}
        />

        <StatCard
          label="Pending requests"
          value={0}
          hint="Waiting for your response"
          icon={ClipboardList}
        />

        <StatCard
          label="New service"
          value="+"
          hint="Add another service"
          icon={PlusCircle}
        />
      </div>

      <div className="mt-8">
        <EmptyState
          title="No requests yet"
          description="New service requests will appear here as soon as customers send them."
        />
      </div>
    </>
  )
}
