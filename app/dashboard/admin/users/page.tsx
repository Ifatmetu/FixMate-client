"use client"

import { useEffect, useState } from "react"
import { ShieldCheck, UserPlus } from "lucide-react"
import toast from "react-hot-toast"

import {
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/dashboard/DashboardContent"
import { authClient, useSession } from "@/lib/auth-client"
import type { ManagedUser } from "@/lib/types"

const roleOptions = [
  { value: "customer", label: "Customer" },
  { value: "technician", label: "Technician" },
  { value: "admin", label: "Admin" },
] as const

type Role = (typeof roleOptions)[number]["value"]

const initialForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  area: "",
  role: "customer" as Role,
}

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"

export default function AdminUsersPage() {
  const { data: session } = useSession()

  const [users, setUsers] = useState<ManagedUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [changingId, setChangingId] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true)

        const result = await authClient.admin.listUsers({
          query: { limit: 100 },
        })

        if (result.error) {
          throw new Error(result.error.message ?? "Failed to load users")
        }

        setUsers((result.data?.users ?? []) as ManagedUser[])
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load users"
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [reloadKey])

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password.trim()
    ) {
      toast.error("Name, email and password are required")
      return
    }

    try {
      setIsCreating(true)

      const result = await authClient.admin.createUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        data: {
          phone: form.phone.trim(),
          area: form.area.trim(),
        },
      })

      if (result.error) {
        throw new Error(result.error.message ?? "Failed to create account")
      }

      toast.success(`${form.role} account created`)
      setForm(initialForm)
      setShowForm(false)
      setReloadKey((key) => key + 1)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create account"
      )
    } finally {
      setIsCreating(false)
    }
  }

  const handleRoleChange = async (user: ManagedUser, role: Role) => {
    if (user.id === session?.user.id) {
      toast.error("You cannot change your own role")
      return
    }

    try {
      setChangingId(user.id)

      const result = await authClient.admin.setRole({
        userId: user.id,
        role,
      })

      if (result.error) {
        throw new Error(result.error.message ?? "Failed to change role")
      }

      toast.success(`${user.name ?? user.email} is now ${role}`)
      setReloadKey((key) => key + 1)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to change role"
      )
    } finally {
      setChangingId("")
    }
  }

  return (
    <>
      <PageHeader
        title="Manage Users"
        description="Create accounts and change anyone's role."
        action={
          <button
            type="button"
            onClick={() => setShowForm((value) => !value)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4" />
            {showForm ? "Cancel" : "Create account"}
          </button>
        }
      />

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="mb-5 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900 dark:text-white">
              New account
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full name
              </span>
              <input
                className={inputClass}
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="Full name"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </span>
              <input
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                placeholder="user@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </span>
              <input
                type="password"
                className={inputClass}
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
                placeholder="Minimum 8 characters"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone
              </span>
              <input
                className={inputClass}
                value={form.phone}
                onChange={(event) =>
                  setForm({ ...form, phone: event.target.value })
                }
                placeholder="Optional"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Area
              </span>
              <input
                className={inputClass}
                value={form.area}
                onChange={(event) =>
                  setForm({ ...form, area: event.target.value })
                }
                placeholder="Optional"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </span>
              <select
                className={inputClass}
                value={form.role}
                onChange={(event) =>
                  setForm({ ...form, role: event.target.value as Role })
                }
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {isCreating ? "Creating..." : "Create account"}
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading users...
        </p>
      ) : users.length === 0 ? (
        <EmptyState
          title="No users yet"
          description="Registered accounts will appear here."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-950 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Area</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {user.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {user.email ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role ?? "customer"}
                      onChange={(event) =>
                        handleRoleChange(user, event.target.value as Role)
                      }
                      disabled={
                        changingId === user.id || user.id === session?.user.id
                      }
                      className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white disabled:opacity-50"
                    >
                      {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {user.phone || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {user.area || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={user.banned ? "banned" : "active"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
