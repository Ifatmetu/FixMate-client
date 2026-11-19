import { CreditCard } from "lucide-react"

import { SectionPage } from "@/components/dashboard/DashboardContent"

export default function CustomerPaymentsPage() {
  return (
    <SectionPage
      title="Payment History"
      description="Review payments you have made for your repairs."
      icon={CreditCard}
      emptyTitle="No payments yet"
      emptyDescription="Your completed payments will appear here."
    />
  )
}
