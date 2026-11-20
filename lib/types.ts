export type ApprovalStatus = "pending" | "approved" | "rejected"

export type Service = {
  _id: string
  title: string
  category: string
  description?: string
  image?: string
  serviceMode?: string
  serviceArea: string
  price: number
  availability?: string
  approvalStatus?: ApprovalStatus
  technicianId?: string
  technicianName?: string
  technicianEmail?: string
  createdAt?: string
  updatedAt?: string
}

export type Booking = {
  _id: string
  status?: string
  createdAt?: string
  [key: string]: unknown
}

export type Payment = Booking

export type ManagedUser = {
  id: string
  name?: string | null
  email?: string | null
  role?: string | null
  phone?: string | null
  area?: string | null
  banned?: boolean | null
}
