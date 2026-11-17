"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail, Wrench } from "lucide-react"
import toast from "react-hot-toast"

import { authClient } from "@/lib/auth-client"

export default function SignInPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please enter your email and password.")
      return
    }

    setIsLoading(true)

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      })

      if (error) {
        toast.error(error.message || "Invalid email or password.")
        return
      }

      toast.success("Login successful!")

      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Sign in error:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (isGoogleLoading) return

    setIsGoogleLoading(true)

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      })

      if (error) {
        toast.error(error.message || "Google sign in failed.")
        setIsGoogleLoading(false)
      }
    } catch (error) {
      console.error("Google sign in error:", error)
      toast.error("Google sign in failed.")
      setIsGoogleLoading(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900 lg:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="hidden bg-gradient-to-br from-[#1D4ED8] to-[#1E3A8A] p-10 text-white lg:flex lg:flex-col lg:justify-between">

            <div>
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
                  <Wrench className="h-5 w-5" />
                </div>

                <span className="text-2xl font-bold">
                  Fix<span className="text-orange-400">Mate</span>
                </span>
              </Link>

              <div className="mt-20">
                <p className="mb-3 text-sm font-medium uppercase tracking-wider text-blue-200">
                  Welcome Back
                </p>

                <h1 className="text-4xl font-bold leading-tight">
                  Your trusted repair
                  <span className="block text-orange-400">
                    partner is waiting.
                  </span>
                </h1>

                <p className="mt-5 max-w-md leading-7 text-blue-100">
                  Sign in to manage your repair requests, connect with
                  technicians, and keep track of your services.
                </p>
              </div>
            </div>

            {/* Bottom */}
            <div className="flex items-center gap-3 text-sm text-blue-100">
              <div className="h-2 w-2 rounded-full bg-orange-400" />
              Smart • Reliable • Convenient
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-6 sm:p-10 lg:p-12">

            {/* Mobile Logo */}
            <div className="mb-8 flex justify-center lg:hidden">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1D4ED8] text-white">
                  <Wrench className="h-5 w-5" />
                </div>

                <span className="text-2xl font-bold text-[#1E3A8A] dark:text-white">
                  Fix<span className="text-[#F97316]">Mate</span>
                </span>
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Sign in
              </h2>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Welcome back! Please enter your details.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignIn} className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="
                      w-full rounded-lg border border-gray-300
                      bg-white px-10 py-3 text-sm text-gray-900
                      outline-none transition
                      focus:border-[#1D4ED8]
                      focus:ring-2 focus:ring-blue-100
                      dark:border-gray-700 dark:bg-gray-950
                      dark:text-white dark:focus:ring-blue-950
                    "
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-[#1D4ED8] hover:text-[#1E3A8A] dark:text-blue-400"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="
                      w-full rounded-lg border border-gray-300
                      bg-white px-10 py-3 pr-11 text-sm text-gray-900
                      outline-none transition
                      focus:border-[#1D4ED8]
                      focus:ring-2 focus:ring-blue-100
                      dark:border-gray-700 dark:bg-gray-950
                      dark:text-white dark:focus:ring-blue-950
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="
                  w-full rounded-lg bg-[#1D4ED8]
                  px-4 py-3 text-sm font-semibold text-white
                  transition-all
                  hover:bg-[#1E3A8A]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />

              <span className="text-xs text-gray-400">
                OR
              </span>

              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="
                flex w-full items-center justify-center gap-3
                rounded-lg border border-gray-300
                bg-white px-4 py-3
                text-sm font-medium text-gray-700
                transition-colors
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-60
                dark:border-gray-700
                dark:bg-gray-900
                dark:text-gray-200
                dark:hover:bg-gray-800
              "
            >
              {/* Google Icon */}
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.27c0-.77-.07-1.52-.22-2.23H12v4.22h5.25a4.49 4.49 0 0 1-1.95 2.95v2.45h3.16c1.85-1.7 2.89-4.2 2.89-7.39z"
                />
                <path
                  fill="#34A853"
                  d="M12 21.67c2.64 0 4.86-.87 6.48-2.35l-3.16-2.45c-.87.58-1.98.93-3.32.93-2.55 0-4.71-1.72-5.49-4.04H3.25v2.53A9.79 9.79 0 0 0 12 21.67z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.51 13.76A5.9 5.9 0 0 1 6.2 12c0-.61.11-1.2.31-1.76V7.71H3.25A9.79 9.79 0 0 0 2.21 12c0 1.58.38 3.08 1.04 4.29l3.26-2.53z"
                />
                <path
                  fill="#EA4335"
                  d="M12 6.2c1.44 0 2.74.49 3.76 1.45l2.82-2.82C16.85 3.27 14.64 2.33 12 2.33a9.79 9.79 0 0 0-8.75 5.38l3.26 2.53C7.29 7.92 9.45 6.2 12 6.2z"
                />
              </svg>

              {isGoogleLoading
                ? "Connecting to Google..."
                : "Continue with Google"}
            </button>

            {/* Sign Up */}
            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="font-semibold text-[#F97316] hover:text-[#EA580C]"
              >
                Create an account
              </Link>
            </p>

          </div>
        </div>
      </div>
    </main>
  )
}