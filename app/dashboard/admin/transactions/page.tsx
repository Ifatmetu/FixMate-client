import { Receipt } from "lucide-react"

import { SectionPage } from "@/components/dashboard/DashboardContent"

export default function AdminTransactionsPage() {
  return (
    <SectionPage
      title="Transactions"
      description="Review all recorded payments and payouts."
      icon={Receipt}
      emptyTitle="No transactions yet"
      emptyDescription="Payments will appear here once they are recorded."
    />
  )
}
