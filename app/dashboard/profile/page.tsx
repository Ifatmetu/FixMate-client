"use client"

import { authClient } from "@/lib/auth-client"
import { PageHeader } from "@/components/dashboard/DashboardContent"

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  const fields = [
    { label: "Full name", value: user?.name },
    { label: "Email", value: user?.email },
    { label: "Role", value: user?.role },
    { label: "Phone", value: user?.phone },
    { label: "Area", value: user?.area },
  ]

  return (
    <>
      <PageHeader
        title="Profile"
        description="Your FixMate account details."
      />

      {isPending || !user ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading profile...
        </p>
      ) : (
        <div className="max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          {fields.map((field) => (
            <div
              key={field.label}
              className="flex flex-col gap-1 border-b border-gray-100 px-5 py-4 last:border-b-0 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {field.label}
              </p>

              <p className="break-words text-sm text-gray-900 dark:text-white">
                {field.value || "—"}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
