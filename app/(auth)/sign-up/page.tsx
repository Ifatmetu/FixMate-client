import { safeRedirectPath } from "@/lib/redirect"

import SignUpForm from "./SignUpForm"

interface SignUpPageProps {
  searchParams: Promise<{ redirect?: string | string[] }>
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { redirect } = await searchParams

  return <SignUpForm redirectPath={safeRedirectPath(redirect)} />
}
