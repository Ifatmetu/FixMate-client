import Link from "next/link"
import { Wrench, Mail, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1D4ED8]">
                <Wrench className="h-5 w-5 text-white" />
              </div>

              <span className="text-2xl font-bold">
                Fix<span className="text-[#F97316]">Mate</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              A smart and reliable platform for finding trusted technicians
              and getting your home and device repairs done easily.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>

            <div className="mt-4 flex flex-col gap-3">

              <Link
                href="/"
                className="text-sm text-slate-400 transition hover:text-[#F97316]"
              >
                Home
              </Link>

              <Link
                href="/services"
                className="text-sm text-slate-400 transition hover:text-[#F97316]"
              >
                Services
              </Link>

              <Link
                href="/"
                className="text-sm text-slate-400 transition hover:text-[#F97316]"
              >
                How It Works
              </Link>

              <Link
                href="/services"
                className="text-sm text-slate-400 transition hover:text-[#F97316]"
              >
                Explore Services
              </Link>

            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Services
            </h3>

            <div className="mt-4 flex flex-col gap-3">

              <Link
                href="/services"
                className="text-sm text-slate-400 transition hover:text-[#F97316]"
              >
                Appliance Repair
              </Link>

              <Link
                href="/services"
                className="text-sm text-slate-400 transition hover:text-[#F97316]"
              >
                Electrical Repair
              </Link>

              <Link
                href="/services"
                className="text-sm text-slate-400 transition hover:text-[#F97316]"
              >
                Plumbing Services
              </Link>

              <Link
                href="/services"
                className="text-sm text-slate-400 transition hover:text-[#F97316]"
              >
                Device Repair
              </Link>

            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact Us
            </h3>

            <div className="mt-4 space-y-4">

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#F97316]" />

                <div>
                  <p className="text-xs text-slate-500">
                    Email
                  </p>

                  <a
                    href="mailto:ifatjahan305@gmail.com"
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    ifatjahan305@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#F97316]" />

                <div>
                  <p className="text-xs text-slate-500">
                    Phone
                  </p>

                  <a
                    href="tel:+8801797-785833"
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    +8801797-785833
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="mt-10 border-t border-slate-800 pt-6">
          <div className="flex flex-col gap-3 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">

            <p>
              © {new Date().getFullYear()} FixMate. All rights reserved.
            </p>

            <div className="flex justify-center gap-5 sm:justify-end">

              <Link
                href="/privacy"
                className="transition hover:text-slate-300"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="transition hover:text-slate-300"
              >
                Terms of Service
              </Link>

            </div>

          </div>
        </div>

      </div>
    </footer>
  )
}