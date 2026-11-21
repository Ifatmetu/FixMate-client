"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Camera, Lock } from "lucide-react"
import toast from "react-hot-toast"

import { PageHeader } from "@/components/dashboard/DashboardContent"
import { authClient } from "@/lib/auth-client"

type ProfileUser = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
  phone?: string | null
  area?: string | null
}

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  return (
    <div className="w-full">
      <PageHeader
        title="Profile"
        description="Update your personal details and profile photo."
      />

      {isPending || !user ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading profile...
        </p>
      ) : (
        <ProfileForm
          key={`${user.id}-${user.name ?? ""}-${user.phone ?? ""}-${user.area ?? ""}-${user.image ?? ""}`}
          user={user}
        />
      )}
    </div>
  )
}

function ProfileForm({ user }: { user: ProfileUser }) {
  const [form, setForm] = useState(() => ({
    name: user.name ?? "",
    phone: user.phone ?? "",
    area: user.area ?? "",
  }))

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(() => user.image ?? "")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB")
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!form.name.trim()) {
      toast.error("Full name is required")
      return
    }

    try {
      setSaving(true)

      let imageUrl: string | undefined

      if (imageFile) {
        const payload = new FormData()
        payload.append("image", imageFile)

        const uploadResponse = await fetch(
          "/api/profile/image",
          {
            method: "POST",
            body: payload,
          }
        )

        const uploadResult =
          await uploadResponse.json().catch(() => ({}))

        if (!uploadResponse.ok) {
          throw new Error(
            uploadResult?.message ??
              "Failed to upload profile photo"
          )
        }

        imageUrl = uploadResult.imageUrl as string
      }

      const { error } = await authClient.updateUser({
        name: form.name.trim(),
        phone: form.phone.trim(),
        area: form.area.trim(),
        ...(imageUrl ? { image: imageUrl } : {}),
      })

      if (error) {
        throw new Error(
          error.message ?? "Failed to update profile"
        )
      }

      setImageFile(null)

      toast.success("Profile updated")
    } catch (err) {
      toast.error(
        err instanceof TypeError
          ? "Cannot reach the server. Please try again."
          : err instanceof Error
            ? err.message
            : "Failed to update profile"
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full
        overflow-hidden
        rounded-xl
        border border-gray-200
        bg-white
        dark:border-gray-800
        dark:bg-gray-900
      "
    >
      {/* ================= PROFILE PHOTO ================= */}
      <div
        className="
          flex flex-col gap-4
          border-b border-gray-200
          p-6
          sm:flex-row sm:items-center
          dark:border-gray-800
        "
      >
        <div
          className="
            relative
            h-20 w-20
            shrink-0
            overflow-hidden
            rounded-full
            bg-gray-100
            dark:bg-gray-800
          "
        >
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Profile photo"
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <span
              className="
                flex h-full w-full
                items-center justify-center
                text-2xl font-semibold
                text-gray-400
              "
            >
              {(user.name || "U")
                .charAt(0)
                .toUpperCase()}
            </span>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Profile photo
          </p>

          <label
            className="
              mt-2
              inline-flex
              cursor-pointer
              items-center
              gap-2
              rounded-lg
              border border-gray-300
              bg-white
              px-3 py-2
              text-sm font-medium
              text-gray-700
              transition
              hover:border-blue-600
              hover:text-blue-600
              dark:border-gray-700
              dark:bg-gray-950
              dark:text-gray-300
            "
          >
            <Camera className="h-4 w-4" />

            {imagePreview
              ? "Change photo"
              : "Add photo"}

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImageChange}
              className="sr-only"
            />
          </label>

          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            JPG, PNG or WEBP. Maximum size 5MB.
          </p>
        </div>
      </div>

      {/* ================= EDITABLE FIELDS ================= */}
      <div
        className="
          grid gap-5
          border-b border-gray-200
          p-6
          sm:grid-cols-2
          dark:border-gray-800
        "
      >
        <div>
          <label
            htmlFor="name"
            className="
              mb-2 block
              text-sm font-medium
              text-gray-700
              dark:text-gray-300
            "
          >
            Full name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="
              w-full
              rounded-lg
              border border-gray-300
              bg-white
              px-3 py-2.5
              text-sm
              outline-none
              focus:border-blue-600
              focus:ring-2
              focus:ring-blue-100
              dark:border-gray-700
              dark:bg-gray-950
              dark:text-white
              dark:focus:border-blue-500
              dark:focus:ring-blue-950
            "
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="
              mb-2 block
              text-sm font-medium
              text-gray-700
              dark:text-gray-300
            "
          >
            Phone
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="Your phone number"
            className="
              w-full
              rounded-lg
              border border-gray-300
              bg-white
              px-3 py-2.5
              text-sm
              outline-none
              focus:border-blue-600
              focus:ring-2
              focus:ring-blue-100
              dark:border-gray-700
              dark:bg-gray-950
              dark:text-white
              dark:focus:border-blue-500
              dark:focus:ring-blue-950
            "
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="area"
            className="
              mb-2 block
              text-sm font-medium
              text-gray-700
              dark:text-gray-300
            "
          >
            Area
          </label>

          <input
            id="area"
            name="area"
            type="text"
            value={form.area}
            onChange={handleChange}
            placeholder="e.g. Dhanmondi, Dhaka"
            className="
              w-full
              rounded-lg
              border border-gray-300
              bg-white
              px-3 py-2.5
              text-sm
              outline-none
              focus:border-blue-600
              focus:ring-2
              focus:ring-blue-100
              dark:border-gray-700
              dark:bg-gray-950
              dark:text-white
              dark:focus:border-blue-500
              dark:focus:ring-blue-950
            "
          />
        </div>
      </div>

      {/* ================= READ ONLY FIELDS ================= */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div
          className="
            flex flex-col gap-1
            px-6 py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Email address
          </p>

          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-gray-400" />

            <p className="break-words text-sm text-gray-900 dark:text-white">
              {user.email || "—"}
            </p>
          </div>
        </div>

        <div
          className="
            flex flex-col gap-1
            border-t border-gray-100
            px-6 py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            dark:border-gray-800
          "
        >
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Role
          </p>

          <p className="text-sm text-gray-900 dark:text-white">
            {user.role || "—"}
          </p>
        </div>

        <p
          className="
            bg-gray-50
            px-6 py-3
            text-xs
            text-gray-500
            dark:bg-gray-950/50
            dark:text-gray-400
          "
        >
          Your email address cannot be changed.
        </p>
      </div>

      {/* ================= ACTIONS ================= */}
      <div
        className="
          flex justify-end
          bg-gray-50
          px-6 py-4
          dark:bg-gray-950/50
        "
      >
        <button
          type="submit"
          disabled={saving}
          className="
            rounded-lg
            bg-blue-600
            px-5 py-2.5
            text-sm font-semibold
            text-white
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  )
}