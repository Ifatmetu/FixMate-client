"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ClipboardList,
  CreditCard,
  User,
  PlusCircle,
  Wrench,
  Users,
  Receipt,
  X,
} from "lucide-react"

type Role = "customer" | "technician" | "admin"

interface SidebarProps {
  role: Role
  isOpen: boolean
  onClose: () => void
}

const menuItems = {
  customer: [
    {
      label: "Dashboard",
      href: "/dashboard/customer",
      icon: LayoutDashboard,
    },
    {
      label: "My Bookings",
      href: "/dashboard/customer/bookings",
      icon: ClipboardList,
    },
    {
      label: "Payment History",
      href: "/dashboard/customer/payments",
      icon: CreditCard,
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
  ],

  technician: [
    {
      label: "Dashboard",
      href: "/dashboard/technician",
      icon: LayoutDashboard,
    },
    {
      label: "Add Service",
      href: "/dashboard/technician/add-service",
      icon: PlusCircle,
    },
    {
      label: "My Services",
      href: "/dashboard/technician/my-services",
      icon: Wrench,
    },
    {
      label: "Service Requests",
      href: "/dashboard/technician/requests",
      icon: ClipboardList,
    },
    {
      label: "Subscription",
      href: "/dashboard/technician/subscription",
      icon: CreditCard,
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
  ],

  admin: [
    {
      label: "Dashboard",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Manage Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      label: "Manage Services",
      href: "/dashboard/admin/services",
      icon: Wrench,
    },
    {
      label: "Manage Bookings",
      href: "/dashboard/admin/bookings",
      icon: ClipboardList,
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: Receipt,
    },
    {
      label: "Subscriptions",
      href: "/dashboard/admin/subscription",
      icon: CreditCard,
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
  ],
}

export default function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const items = menuItems[role]

  return (
    <>
      {/* ================= MOBILE OVERLAY ================= */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 border-r border-gray-200 bg-white transition-transform duration-300 lg:translate-x-0 dark:border-gray-800 dark:bg-gray-950 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* ================= LOGO ================= */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-800">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            {/* Logo Icon */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <Wrench className="h-5 w-5 text-white" />
            </div>

            {/* Logo Text */}
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Fix<span className="text-orange-500">Mate</span>
            </span>
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 lg:hidden dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ================= ROLE CARD ================= */}
        <div className="mx-4 mt-6 rounded-xl bg-blue-50 p-4 dark:bg-blue-950/40">
          <p className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
            Logged in as
          </p>

          <p className="mt-1 font-semibold text-blue-700 capitalize dark:text-blue-400">
            {role}
          </p>
        </div>

        {/* ================= MENU ================= */}
        <nav className="mt-6 px-4">
          <p className="mb-3 px-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Menu
          </p>

          <div className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon

              const isDashboard = item.href === `/dashboard/${role}`

              const isActive =
                pathname === item.href ||
                (!isDashboard && pathname.startsWith(`${item.href}/`))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />

                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </aside>
    </>
  )
}
