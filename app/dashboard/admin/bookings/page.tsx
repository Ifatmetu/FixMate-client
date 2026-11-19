import { ClipboardList } from "lucide-react"

import { SectionPage } from "@/components/dashboard/DashboardContent"

export default function AdminBookingsPage() {
  return (
    <SectionPage
      title="Manage Bookings"
      description="Track every booking across the platform."
      icon={ClipboardList}
      emptyTitle="No bookings yet"
      emptyDescription="Bookings will appear here as soon as they are created."
    />
  )
}
