# 🔧 FixMate — Smart Device & Home Appliance Repair Platform

FixMate is a full-stack repair service platform that connects customers with technicians for smart device and home appliance repair services.

Customers can browse approved services, request repairs, track booking progress, and make payments. Technicians can create and manage repair services and handle customer requests, while administrators manage users, services, bookings, and transactions.

## ✨ Features

### 👤 Customer
- Browse approved and available repair services
- Search and explore repair services
- View service details
- Request a repair service
- Track repair request status
- View booking history
- Pay for completed repairs
- View payment information

### 🔧 Technician
- Create repair services
- Upload service images
- Manage service availability
- View customer repair requests
- Accept or reject requests
- Start repair work
- Mark repairs as completed
- Set final repair amount
- Manage technician services

### 🛡️ Admin
- Admin dashboard
- Manage users
- Change user roles
- Approve or reject services
- Manage service listings
- Manage bookings
- Manage transactions/payments
- View platform statistics and revenue


## 🔐 Authentication & Authorization

FixMate uses authentication and role-based access control.

Supported roles:

- Customer
- Technician
- Admin

Protected operations are handled according to the user's role so that customers, technicians, and administrators have different permissions.

## 🛠️ Technology Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- React
- Lucide React
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- Multer

### Authentication
- Better Auth

### Image Upload
- ImgBB

### Payment
- Stripe


## 🎯 Business Rules

- New technician services start with `pending` approval.
- Customers can only view approved and available services.
- A technician cannot request their own service.
- Technicians and admins cannot create customer repair requests.
- A customer cannot create multiple active requests for the same service.
- Repair requests follow a controlled status workflow.
- Technicians must provide the final repair amount before completing a booking.
- Completed unpaid bookings can proceed to payment.
- Payment records are stored in the database after successful payment.
