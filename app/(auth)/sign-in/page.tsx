import { safeRedirectPath } from "@/lib/redirect"

import SignInForm from "./SignInForm"

interface SignInPageProps {
  searchParams: Promise<{ redirect?: string | string[] }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { redirect } = await searchParams

  return <SignInForm redirectPath={safeRedirectPath(redirect)} />
}
