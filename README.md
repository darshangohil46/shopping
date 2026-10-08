# Online Shopping Cart Application

A full-stack online shopping cart web application built for the AMEX Technology junior developer assessment. Built with **Next.js (App Router, TypeScript)** on the frontend and **NestJS (TypeScript, TypeORM, PostgreSQL)** on the backend.

---

## 1. Project Overview & Features

- **Authentication & Accounts**:
  - User registration and login with bcrypt password hashing (10 salt rounds).
  - Secure stateless JWT authentication with a 1-hour expiry token stored in HttpOnly cookies.
  - Multi-device, isolated user sessions: each user can only see and manage their own cart and orders.
- **Product Catalog**:
  - 10 realistic hardware and office accessories pre-seeded in PostgreSQL.
  - Responsive product display with clean typography and imagery.
- **Cart & Quantity Management**:
  - Real-time cart synchronization directly saved in PostgreSQL (`cart_items` table).
  - Add to cart, increment/decrement quantity, and remove items with responsive updates.
  - Cart persists across user logouts and sessions.
- **Billing & Calculations**:
  - Displays product title, unit price, quantity, line total, and grand total.
  - All totals accurately calculated on both client and server sides.
- **Order Placement & Email Receipts**:
  - Checkout saves the order in `orders` and item records in `order_items`.
  - Clears the user's cart in the database.
  - Transmits a styled HTML email summary of the bill using Nodemailer transport (with Ethereal test inbox fallback and production SMTP support).
  - Robust error handling: email delivery failures are logged gracefully without failing the transaction or crashing the server.

---

## 2. Why PostgreSQL?

We selected **PostgreSQL** as the relational database for the following reasons:

1. **ACID Compliance & Transactional Integrity**: In an e-commerce shopping cart, financial accuracy, atomic checkouts, and non-conflicting stock/cart changes require strict ACID guarantees.
2. **Relational Structure**: Naturally models one-to-many relationships (`User -> CartItems`, `User -> Orders`, `Order -> OrderItems`) with foreign keys and cascading deletes (`CASCADE`).
3. **High Performance & Industry Standard**: Widely supported by free and enterprise database hosts (e.g., Neon, Supabase, Railway, Render).

---

## 3. Database Schema

All tables include automatic `created_at` and `updated_at` timestamp tracking:

1. `users`: Stores `id` (UUID), `name`, `email` (unique), `password` (hashed), `created_at`, `updated_at`.
2. `products`: Stores `id` (UUID), `name`, `description`, `price` (decimal), `imageUrl`, `created_at`, `updated_at`.
3. `cart_items`: Stores `id` (UUID), `userId` (FK to users), `productId` (FK to products), `quantity` (int), `created_at`, `updated_at`.
4. `orders`: Stores `id` (UUID), `userId` (FK to users), `grandTotal` (decimal), `emailSent` (boolean), `created_at`, `updated_at`.
5. `order_items`: Stores `id` (UUID), `orderId` (FK to orders), `productId` (FK to products), `quantity` (int), `price` (decimal unit price), `created_at`, `updated_at`.

---

## 4. Architecture & Technology Stack

### Backend (`/backend`)

- **Framework**: NestJS 10 (TypeScript)
- **Database & ORM**: TypeORM with PostgreSQL
- **Security**: Passport JWT, bcryptjs, class-validator
- **Email**: Nodemailer transport with HTML email templates (`src/template/order-summary.html`)

### Frontend (`/frontend`)

- **Framework**: Next.js 15+ (App Router, Server Components + Client Components)
- **Styling**: Tailwind CSS with a pure Black & White design system (`#ffffff` background, `#000000` typography, `border-neutral-200`, `rounded-sm`)
- **Icons**: Lucide React
- **Validation**: Zod schema validation
- **Architecture Flow**:
  `UI Component` -> `services` (Client class) -> Next.js API `route` (Zod validation) -> `services-api` (Server class) -> Backend API

---

## 5. Getting Started & Running Locally

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL running locally or a cloud database URL (e.g., Neon, Supabase)

### Backend Setup

1. Open a terminal in the `backend` directory:
   ```bash
   cd backend
   npm install
   ```
2. Configure `.env` in `backend/`:

3. Run the product seed script:
   ```bash
   npm run seed
   ```
4. Start the backend development server:
   ```bash
   npm run start:dev
   ```
   Backend will run on `http://localhost:5000`.

### Frontend Setup

1. Open a terminal in the `frontend` directory:
   ```bash
   cd frontend
   npm install
   ```
2. Configure `.env.local` in `frontend/`:

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`.

---

## 6. Test Login Credentials

You can register a new user or log in with the test user:

- **Email**: `admin@example.com`
- **Password**: `Admin@123`

---

## 7. What Was Finished & Future Improvements

### Finished:

- Complete end-to-end user registration, login, and profile view.
- 10 sample products seeded in database.
- Persistent database-backed shopping cart per user.
- Add, update quantity, remove items, line total, and grand total calculations.
- Order submission with items recording in `orders` and `order_items`.
- Email delivery with order summary table and preview link.
- Pure Black & White SaaS aesthetic adhering strictly to UX guidelines.

### Future Improvements:

- Stripe / Payment gateway webhook integration.
- Search, filter, and pagination on product catalog.
- User order history view (`/orders`).
