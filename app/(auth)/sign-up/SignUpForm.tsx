"use client"

import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, Mail, MapPin, Phone, User, Wrench } from "lucide-react"
import toast from "react-hot-toast"

import { authClient } from "@/lib/auth-client"

type Role = "customer" | "technician"

interface SignUpFormProps {
  redirectPath: string
}

export default function SignUpForm({ redirectPath }: SignUpFormProps) {
  const signInHref =
    redirectPath === "/"
      ? "/sign-in"
      : `/sign-in?redirect=${encodeURIComponent(redirectPath)}`

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [area, setArea] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<Role>("customer")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  // ==========================================
  // EMAIL SIGN UP
  // ==========================================
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !area.trim() ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Please fill in all fields.")
      return
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.")
      return
    }

    if (password.length > 128) {
      toast.error("Password must not exceed 128 characters.")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }

    setIsLoading(true)

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        area: area.trim(),
        signupRole: role,
        callbackURL: redirectPath,
      })

      if (error) {
        toast.error(error.message || "Registration failed.")
        return
      }

      toast.success("Account created successfully!")

      window.location.assign(redirectPath)
    } catch (error) {
      console.error("Sign up error:", error)

      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // ==========================================
  // GOOGLE SIGN UP
  // ==========================================
  const handleGoogleSignUp = async () => {
    if (isGoogleLoading) return

    setIsGoogleLoading(true)

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: new URL(redirectPath, window.location.origin).toString(),
      })

      if (error) {
        toast.error(error.message || "Google sign up failed.")
        setIsGoogleLoading(false)
      }
    } catch (error) {
      console.error("Google sign up error:", error)

      toast.error("Google sign up failed.")
      setIsGoogleLoading(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border bg-white shadow-xl lg:grid-cols-2 dark:border-gray-800 dark:bg-gray-900">
          {/* ==========================================
              LEFT SIDE
          ========================================== */}

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

              {/* Heading */}
              <div className="mt-20">
                <p className="mb-3 text-sm font-medium tracking-wider text-blue-200 uppercase">
                  Join FixMate
                </p>

                <h1 className="text-4xl leading-tight font-bold">
                  Get reliable repairs
                  <span className="block text-orange-400">
                    whenever you need.
                  </span>
                </h1>

                <p className="mt-5 max-w-md leading-7 text-blue-100">
                  Create your FixMate account and connect with trusted
                  technicians for your device and home appliance repair needs.
                </p>
              </div>

              {/* Benefits */}
              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-400/20">
                    ✓
                  </div>

                  <span className="text-sm text-blue-100">
                    Trusted technicians
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-400/20">
                    ✓
                  </div>

                  <span className="text-sm text-blue-100">
                    Easy repair booking
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-400/20">
                    ✓
                  </div>

                  <span className="text-sm text-blue-100">Secure payments</span>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="flex items-center gap-3 text-sm text-blue-100">
              <div className="h-2 w-2 rounded-full bg-orange-400" />
              Smart • Reliable • Convenient
            </div>
          </div>

          {/* ==========================================
              RIGHT SIDE
          ========================================== */}

          <div className="p-6 sm:p-10 lg:p-12">
            {/* Mobile Logo */}
            <div className="mb-7 flex justify-center lg:hidden">
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
            <div className="mb-7">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Create account
              </h2>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Join FixMate and get started today.
              </p>
            </div>

            {/* ==========================================
                FORM
            ========================================== */}

            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-sm text-gray-900 transition outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-blue-950"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-sm text-gray-900 transition outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-blue-950"
                  />
                </div>
              </div>

              {/* Phone + Area */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Phone
                  </label>

                  <div className="relative">
                    <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      autoComplete="tel"
                      className="w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-sm text-gray-900 transition outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-blue-950"
                    />
                  </div>
                </div>

                {/* Area */}
                <div>
                  <label
                    htmlFor="area"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Area
                  </label>

                  <div className="relative">
                    <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input
                      id="area"
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="Your area"
                      className="w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-sm text-gray-900 transition outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-blue-950"
                    />
                  </div>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Register As
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* Customer */}
                  <button
                    type="button"
                    onClick={() => setRole("customer")}
                    className={`rounded-lg border px-4 py-3 text-sm font-semibold transition-all ${
                      role === "customer"
                        ? "border-[#1D4ED8] bg-blue-50 text-[#1D4ED8] ring-2 ring-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-950"
                        : "border-gray-300 text-gray-600 hover:border-blue-300 dark:border-gray-700 dark:text-gray-300"
                    } `}
                  >
                    Customer
                  </button>

                  {/* Technician */}
                  <button
                    type="button"
                    onClick={() => setRole("technician")}
                    className={`rounded-lg border px-4 py-3 text-sm font-semibold transition-all ${
                      role === "technician"
                        ? "border-[#F97316] bg-orange-50 text-[#EA580C] ring-2 ring-orange-100 dark:bg-orange-950/30 dark:text-orange-400 dark:ring-orange-950"
                        : "border-gray-300 text-gray-600 hover:border-orange-300 dark:border-gray-700 dark:text-gray-300"
                    } `}
                  >
                    Technician
                  </button>
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-11 text-sm text-gray-900 transition outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-blue-950"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
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

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-11 text-sm text-gray-900 transition outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-blue-950"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full rounded-lg bg-[#F97316] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#EA580C] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />

              <span className="text-xs text-gray-400">OR</span>

              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {/* Google Icon */}
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
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

            {/* Sign In */}
            <p className="mt-7 text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href={signInHref}
                className="font-semibold text-[#1D4ED8] hover:text-[#1E3A8A]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
