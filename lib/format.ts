export function formatCurrency(value: unknown) {
  const amount = Number(value)

  return Number.isFinite(amount) ? `৳${amount.toLocaleString()}` : "৳0"
}

export function formatDate(value?: string | null) {
  if (!value) return "—"

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString()
}

export function pickField(
  row: Record<string, unknown>,
  keys: string[]
): string {
  for (const key of keys) {
    const value = row[key]

    if (typeof value === "string" || typeof value === "number") {
      return String(value)
    }
  }

  return "—"
}
