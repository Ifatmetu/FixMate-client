import { ClipboardList } from "lucide-react"

import { SectionPage } from "@/components/dashboard/DashboardContent"

export default function TechnicianRequestsPage() {
  return (
    <SectionPage
      title="Service Requests"
      description="Requests sent by customers for your services."
      icon={ClipboardList}
      emptyTitle="No requests yet"
      emptyDescription="New requests will appear here as soon as customers send them."
    />
  )
}
