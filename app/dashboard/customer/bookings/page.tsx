import { ClipboardList } from "lucide-react"

import { SectionPage } from "@/components/dashboard/DashboardContent"

export default function CustomerBookingsPage() {
  return (
    <SectionPage
      title="My Bookings"
      description="All of your repair bookings in one place."
      icon={ClipboardList}
      emptyTitle="No bookings yet"
      emptyDescription="Once you book a repair, it will appear here."
    />
  )
}
