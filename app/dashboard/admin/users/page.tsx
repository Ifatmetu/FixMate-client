import { Users } from "lucide-react"

import { SectionPage } from "@/components/dashboard/DashboardContent"

export default function AdminUsersPage() {
  return (
    <SectionPage
      title="Manage Users"
      description="View and manage everyone using FixMate."
      icon={Users}
      emptyTitle="No users yet"
      emptyDescription="Registered accounts will appear here."
    />
  )
}
