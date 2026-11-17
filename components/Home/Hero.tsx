import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Wrench,
} from "lucide-react"

export default function Hero() {
  return (
    <section className="mx-auto flex  max-w-6xl relative overflow-hidden bg-white dark:bg-gray-950">
      {/* Background Decorations */}
      <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-100 blur-3xl dark:bg-blue-950/40" />
      <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-orange-100 blur-3xl dark:bg-orange-950/30" />

      {/* Main Container */}
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

        {/* Two Column Content */}
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2">

          {/* ================= LEFT CONTENT ================= */}
          <div className="mx-auto w-full max-w-xl lg:mx-0">

            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-[#1D4ED8] dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400">
              <Wrench className="h-4 w-4" />
              Smart Repair Service Platform
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
              Your Trusted Partner for

              <span className="block text-[#1D4ED8]">
                Smart Repairs
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-7 text-gray-600 sm:text-lg dark:text-gray-300">
              Find trusted technicians for your device and home appliance
              repairs. Book a service, track your repair, and get your
              problems fixed with confidence.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <Link
                href="/services"
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-lg bg-[#1D4ED8]
                  px-6 py-3.5
                  text-sm font-semibold text-white
                  shadow-lg shadow-blue-200
                  transition-all
                  hover:bg-[#1E3A8A]
                  hover:shadow-blue-300
                  dark:shadow-none
                "
              >
                Explore Services
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/sign-up"
                className="
                  inline-flex items-center justify-center
                  rounded-lg border-2 border-[#F97316]
                  px-6 py-3.5
                  text-sm font-semibold text-[#F97316]
                  transition-colors
                  hover:bg-[#F97316]
                  hover:text-white
                "
              >
                Become a Technician
              </Link>

            </div>

            {/* Trust Points */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-6">

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle2 className="h-5 w-5 text-[#F97316]" />
                Verified Technicians
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <ShieldCheck className="h-5 w-5 text-[#F97316]" />
                Secure Booking
              </div>

            </div>
          </div>

          {/* ================= RIGHT VISUAL ================= */}
          <div className="mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none">

            {/* Main Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1D4ED8] to-[#1E3A8A] p-8 shadow-2xl shadow-blue-200 dark:shadow-blue-950/30 sm:p-10">

              {/* Decorative Circles */}
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-orange-400/20" />

              <div className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-white/10" />

              <div className="relative">

                {/* Icon */}
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                  <Wrench className="h-8 w-8" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Get Your Repair Done Right
                </h2>

                {/* Description */}
                <p className="mt-3 text-sm leading-6 text-blue-100 sm:text-base">
                  Connect with skilled technicians who are ready to help
                  with your devices and home appliances.
                </p>

                {/* Service Cards */}
                <div className="mt-8 space-y-3">

                  {/* Device Repair */}
                  <div className="flex items-center justify-between rounded-xl bg-white/10 p-4 backdrop-blur">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white">
                        <Wrench className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-semibold text-white">
                          Device Repair
                        </p>

                        <p className="text-xs text-blue-100">
                          Phones, laptops & more
                        </p>
                      </div>

                    </div>

                    <span className="text-sm font-semibold text-orange-300">
                      Available
                    </span>

                  </div>

                  {/* Home Appliance */}
                  <div className="flex items-center justify-between rounded-xl bg-white/10 p-4 backdrop-blur">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white">
                        <ShieldCheck className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-semibold text-white">
                          Home Appliance
                        </p>

                        <p className="text-xs text-blue-100">
                          AC, fridge, washing machine
                        </p>
                      </div>

                    </div>

                    <span className="text-sm font-semibold text-orange-300">
                      Available
                    </span>

                  </div>

                </div>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/20 pt-6">

                  <div>
                    <p className="text-2xl font-bold text-white">
                      500+
                    </p>

                    <p className="text-xs text-blue-100">
                      Repairs
                    </p>
                  </div>

                  <div>
                    <p className="text-2xl font-bold text-white">
                      50+
                    </p>

                    <p className="text-xs text-blue-100">
                      Technicians
                    </p>
                  </div>

                  <div>
                    <p className="text-2xl font-bold text-white">
                      4.9
                    </p>

                    <p className="text-xs text-blue-100">
                      Rating
                    </p>
                  </div>

                </div>

              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-5 -left-4 hidden rounded-xl bg-white p-4 shadow-xl dark:bg-gray-900 sm:block">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-[#F97316] dark:bg-orange-950/50">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    Trusted Service
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Quality repairs
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  )
}