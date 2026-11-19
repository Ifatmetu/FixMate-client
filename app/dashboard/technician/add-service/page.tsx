"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Wrench,
  Upload,
  MapPin,
  DollarSign,
  FileText,
  Image as ImageIcon,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"

const categories = [
  "AC Repair",
  "Refrigerator Repair",
  "Washing Machine Repair",
  "TV Repair",
  "Microwave Repair",
  "Computer Repair",
  "Laptop Repair",
  "Mobile Repair",
  "Plumbing",
  "Electrical",
  "Other",
]

export default function AddServicePage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    image: "",
    serviceMode: "Home Service",
    serviceArea: "",
    price: "",
    availability: "available",
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.title ||
      !formData.category ||
      !formData.description ||
      !formData.serviceArea ||
      !formData.price
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"
        }/services`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.message || "Failed to add service")
      }

      toast.success("Service submitted for admin approval")

      router.push("/dashboard/technician/my-services")
      router.refresh()
    } catch (error) {
      console.error("Failed to add service:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to add service"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <Wrench className="h-5 w-5 text-white" />
              </div>

              <span className="text-sm font-semibold uppercase tracking-wide text-orange-500">
                Technician Panel
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Add New Service
            </h1>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Create a repair service and submit it for admin approval.
            </p>
          </div>

          <Link
            href="/dashboard/technician/my-services"
            className="hidden items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-600 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-400 sm:flex"
          >
            <ArrowLeft className="h-4 w-4" />
            My Services
          </Link>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="border-b border-gray-200 p-6 dark:border-gray-800 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Provide the basic details of your repair service.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Service Title */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Service Title <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Professional AC Repair Service"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950"
                  />
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950"
                  >
                    <option value="">Select category</option>

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label
                    htmlFor="price"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Starting Price <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="500"
                      className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950"
                    />
                  </div>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Enter amount in BDT
                  </p>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <FileText className="h-4 w-4" />
                    Service Description{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your repair service, what problems you solve, and what customers can expect..."
                    className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950"
                  />

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Give customers a clear idea about your service.
                  </p>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="border-b border-gray-200 p-6 dark:border-gray-800 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Service Details
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Tell customers where and how you provide the service.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Service Mode */}
                <div>
                  <label
                    htmlFor="serviceMode"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Service Mode
                  </label>

                  <select
                    id="serviceMode"
                    name="serviceMode"
                    value={formData.serviceMode}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950"
                  >
                    <option value="Home Service">Home Service</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                {/* Service Area */}
                <div>
                  <label
                    htmlFor="serviceArea"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <MapPin className="h-4 w-4" />
                    Service Area <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="serviceArea"
                    name="serviceArea"
                    type="text"
                    value={formData.serviceArea}
                    onChange={handleChange}
                    placeholder="e.g. Mirpur, Dhanmondi, Uttara"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950"
                  />
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="border-b border-gray-200 p-6 dark:border-gray-800 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Service Image
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Add an image that represents your repair service.
                </p>
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <ImageIcon className="h-4 w-4" />
                  Image URL
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Upload className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input
                      id="image"
                      name="image"
                      type="url"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://example.com/service-image.jpg"
                      className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950"
                    />
                  </div>
                </div>

                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Later we can connect this field with ImgBB for image
                  uploading.
                </p>
              </div>
            </div>

            {/* Availability */}
            <div className="p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Availability
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Choose whether customers can currently request this
                  service.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    formData.availability === "available"
                      ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/30"
                      : "border-gray-300 hover:border-blue-300 dark:border-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="availability"
                    value="available"
                    checked={formData.availability === "available"}
                    onChange={handleChange}
                    className="sr-only"
                  />

                  <div className="flex items-center gap-3">
                    <div
                      className={`h-4 w-4 rounded-full border-2 ${
                        formData.availability === "available"
                          ? "border-blue-600 bg-blue-600"
                          : "border-gray-400"
                      }`}
                    />

                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Available
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Customers can request this service.
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    formData.availability === "unavailable"
                      ? "border-orange-500 bg-orange-50 dark:border-orange-500 dark:bg-orange-950/20"
                      : "border-gray-300 hover:border-orange-300 dark:border-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="availability"
                    value="unavailable"
                    checked={formData.availability === "unavailable"}
                    onChange={handleChange}
                    className="sr-only"
                  />

                  <div className="flex items-center gap-3">
                    <div
                      className={`h-4 w-4 rounded-full border-2 ${
                        formData.availability === "unavailable"
                          ? "border-orange-500 bg-orange-500"
                          : "border-gray-400"
                      }`}
                    />

                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Unavailable
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Customers cannot request this service.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-950/50 sm:flex-row sm:justify-end sm:p-8">
              <Link
                href="/dashboard/technician/my-services"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Wrench className="h-4 w-4" />

                {loading ? "Submitting..." : "Submit Service"}
              </button>
            </div>
          </form>
        </div>

        {/* Notice */}
        <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/50 dark:bg-orange-950/20">
          <p className="text-sm text-orange-800 dark:text-orange-300">
            <strong>Note:</strong> New services will remain pending until an
            admin reviews and approves them.
          </p>
        </div>
      </div>
    </div>
  )
}