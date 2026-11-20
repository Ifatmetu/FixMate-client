"use client"

import { Search, ClipboardList, UserCheck, CheckCircle } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Find a Service",
    description:
      "Browse our approved repair services and find the right service for your home or device.",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Request a Repair",
    description:
      "Select your preferred service and submit a repair request with your required details.",
  },
  {
    number: "03",
    icon: UserCheck,
    title: "Technician Accepts",
    description:
      "A verified technician reviews your request and accepts it to start the repair process.",
  },
  {
    number: "04",
    icon: CheckCircle,
    title: "Get It Fixed",
    description:
      "The technician completes the repair and updates the final service amount.",
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      data-section="how-it-works"
      className="scroll-mt-16 bg-white py-20 dark:bg-gray-950"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">
            How it works
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            Get your repair done in four simple steps
          </h2>

          <p className="mt-3 text-gray-600 dark:text-gray-300">
            FixMate makes it easy to find a trusted technician and get your
            repair service completed quickly.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon

            return (
              <div
                key={step.number}
                className="relative rounded-xl border border-gray-200 bg-gray-50 p-6 transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Number */}
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>

                  <span className="text-3xl font-bold text-gray-200 dark:text-gray-800">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
