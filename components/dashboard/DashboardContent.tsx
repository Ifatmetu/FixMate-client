import type { LucideIcon } from "lucide-react"

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>

        {description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  )
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: string | number
  hint?: string
  icon: LucideIcon
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>

        <Icon className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
      </div>

      <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>

      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  )
}

export function EmptyState({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon?: LucideIcon
}) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">
      {Icon && <Icon className="mx-auto h-8 w-8 text-gray-400" />}

      <h2 className="mt-3 text-base font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  )
}

export function StatusBadge({ status }: { status?: string | null }) {
  const value = (status ?? "pending").toLowerCase()

  const tone =
    value === "approved" || value === "active" || value === "accepted"
      ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300"
      : value === "paid"
        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
        : value === "rejected" || value === "banned" || value === "declined"
          ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
          : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2 py-1 text-xs font-medium capitalize ${tone}`}
    >
      {status ?? "pending"}
    </span>
  )
}

export function SectionPage({
  title,
  description,
  icon,
  emptyTitle = "Nothing here yet",
  emptyDescription = "This section will display data once it is connected.",
}: {
  title: string
  description: string
  icon: LucideIcon
  emptyTitle?: string
  emptyDescription?: string
}) {
  return (
    <>
      <PageHeader title={title} description={description} />

      <EmptyState
        icon={icon}
        title={emptyTitle}
        description={emptyDescription}
      />
    </>
  )
}
