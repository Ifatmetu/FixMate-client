export function safeRedirectPath(value: string | string[] | undefined) {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return "/"
  }

  return value
}
