# 🏢 Pramila Apartments — Full-Stack Apartment & Rental Management Platform

A production-ready, database-backed web application built for residential property management, flat inventory, owner & tenant leases, recurring billing engines, cryptographic QR visitor gate passes, mobile-first security operations, facility maintenance work orders, and dynamic system settings configuration.

---

## 🌟 Key Highlights & Core Capabilities

- **Zero Hard-Coding Architecture**: All operational variables (apartment name, address, rent due date, electricity rate per unit, water charges, visitor approval requirements, unauthorized penalty fees, quiet hours) are stored in the database and fully configurable from the **Admin Configuration Center**.
- **Role-Based Access Control (RBAC)**: Strict server-side RBAC across 6 roles:
  1. `SUPER_ADMIN` — Master system oversight & property settings.
  2. `PROPERTY_MANAGER` — Day-to-day estate operations, flat allocations, and approvals.
  3. `ACCOUNTANT` — Invoices, recurring billing batch engine, receipts, and financial statements.
  4. `SECURITY_GUARD` — Mobile-first gate operations, live QR scanning, entry/exit logging, and incident reporting.
  5. `MAINTENANCE_STAFF` — Technician queue, work order resolution, and material/labor cost tracking.
  6. `TENANT` — Flat dashboard, monthly rent payments, QR visitor passes, maintenance requests, and family management.
- **Billing & Utility Engine**:
  - Scheduled, idempotent monthly billing batch execution (prevents duplicate invoices).
  - Electricity formula engine: `(current_reading - previous_reading) × configured_rate`.
  - Water charges (Fixed / Per-unit / Manual).
  - Payment reconciliation with instant printable PDF-style receipt generation.
- **Cryptographic QR Visitor Pass System**:
  - Secure random tokens (`PR-PASS-XXXX`) embedded into QR codes without leaking sensitive PII in plain text.
  - Dynamic time-window validation, duration tracking, and automatic pass expiration.
  - Security incident reporting & configurable unauthorized visitor penalties (default: ₹2,000/day).
- **Secure Document Vault**: Private tenant document repository with verification pipeline (`PENDING`, `VERIFIED`, `REJECTED`, `EXPIRED`).
- **Emergency Broadcast System**: Society-wide broadcast alerts prominently rendered across active portals.
- **Immutable Audit Trail**: Chronological logging of all critical actions (tenant approval, rent adjustments, settings modifications, visitor check-ins).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | Next.js 14/15 App Router, React 18, TypeScript |
| **Styling & Theme** | Tailwind CSS with Luxury Glassmorphism dark theme |
| **Database & ORM** | PostgreSQL (Staging/Production) / SQLite (Local Zero-Config), Prisma ORM |
| **Authentication** | JWT with `jose`, `bcryptjs` password hashing, HTTP-only secure cookies |
| **Charts & Metrics** | Recharts (Revenue breakdown, Occupancy distribution) |
| **QR Cryptography** | `qrcode` |
| **Icons & Design** | `lucide-react` |
| **Validation** | Zod, TypeScript |

---

## 🚀 Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd "Pramila Apartments"
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Database Initialization & Seed
Generate Prisma client, sync database schema, and populate rich realistic demo data:
```bash
npm run db:setup
```

### 4. Run Automated Test Suite
```bash
npm run test
```

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Pre-Configured Demo Credentials

| Role | Email | Password | Primary Responsibility |
|---|---|---|---|
| **Super Admin** | `admin@pramila.com` | `Password@123` | Full system control, property settings & audit |
| **Property Manager** | `manager@pramila.com` | `Password@123` | Tenant approvals, visitor approvals & operations |
| **Accountant** | `accountant@pramila.com` | `Password@123` | Invoices, batch billing cycle & payments |
| **Security Guard** | `security@pramila.com` | `Password@123` | Mobile gate ops, QR scan & incidents |
| **Maintenance Staff** | `maintenance@pramila.com` | `Password@123` | Assigned work orders & repair cost logging |
| **Tenant (A-101)** | `tenant1@pramila.com` | `Password@123` | Rent payments, QR visitor passes & complaints |
| **Tenant (A-201)** | `tenant2@pramila.com` | `Password@123` | Active tenancy in Flat A-201 |

---

## ⚙️ Scheduled Tasks & Cron Architecture

Configure cron workers (via Vercel Cron, AWS EventBridge, or Kubernetes CronJob) to call the following endpoints:

1. **Monthly Recurring Billing Engine** (1st of every month):
   - Endpoint: `POST /api/invoices/generate-monthly`
   - Detects all active tenancies, verifies idempotency, calculates electricity & water charges, attaches pending penalties, and dispatches invoice notifications.
2. **Daily Expiry & Reminder Job** (Daily at 00:00):
   - Deactivates expired visitor passes and sends document renewal reminders.

---

## 📦 Production Deployment Guide

### Deploying to Vercel + PostgreSQL (Supabase / AWS RDS / Neon):
1. Create a PostgreSQL database and copy the connection string.
2. Set `DATABASE_URL="postgresql://user:password@host:5432/pramila_apartments?schema=public"`.
3. Set `JWT_SECRET` to a secure 32+ character random string.
4. Run `npx prisma db push && node prisma/seed.js`.
5. Deploy the Next.js app with `npm run build`.
