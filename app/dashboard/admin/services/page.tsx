import { Wrench } from "lucide-react"

import { SectionPage } from "@/components/dashboard/DashboardContent"

export default function AdminServicesPage() {
  return (
    <SectionPage
      title="Manage Services"
      description="Oversee all services listed on the platform."
      icon={Wrench}
      emptyTitle="No services yet"
      emptyDescription="Services added by technicians will appear here."
    />
  )
}
