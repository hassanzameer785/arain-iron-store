# Arain Iron Store Vehova 🏗️

> **Quality Construction Materials You Can Trust Since 1998**

A full-stack e-commerce web application for Arain Iron Store Vehova — a construction materials and hardware shop.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (access + refresh tokens) + bcrypt |
| Security | Helmet, Rate Limiting, CORS, Input Validation |

## Features

### Customer
- Browse 40+ products across 14 categories
- Search & filter by category, quality, price
- Shopping cart (persisted in localStorage)
- Checkout & order placement
- Order history
- Customer reviews

### Admin Dashboard
- Product management (CRUD + image upload)
- Order management (status + payment updates)
- Customer management (enable/disable)
- Employee management (RBAC permissions)
- Sales analytics (daily / monthly / all-time)
- Low stock alerts
- Invoice generation (printable HTML)

### Security
- JWT with refresh tokens
- Role-Based Access Control (customer / employee / admin)
- bcrypt password hashing
- Helmet security headers
- Rate limiting (100 req/15min)
- Input validation

## Quick Start

```bash
# 1. Clone the project
git clone https://github.com/YOUR_USERNAME/arain-iron-store.git

# 2. Backend
cd backend
npm install
cp .env.example .env   # Fill in your MongoDB URI and JWT secrets
npm run seed           # Seed categories + products + admin user
npm run dev            # Starts on :5000

# 3. Frontend (new terminal)
cd frontend
npm install
npm start              # Starts on :3000
```

## Product Categories
Iron Materials · Bricks · Concrete · Cement · Paint · Bathroom Items · Pipes · Bamboo · Doors · Windows · Tools · Plastic & Sheets · Construction Services · Other Hardware
