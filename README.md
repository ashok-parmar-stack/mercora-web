# Mercora Web

Standalone Next.js 16+ Web Application containing both the **Admin Dashboard** and **User/Client Platform** for Mercora.

## Features

- **Admin Operations (`/admin`)**: Category management, Geography, HSN master sync, Roles & Permissions, User management, Audit logs, and System settings.
- **User & Client Marketplace**: Business directories, Category browsing, Location filters, Enquiries, Saved businesses, and Profile management.
- **Authentication**: JWT authentication with role-based access control, session refresh, and device tracking.

## Requirements

- Node.js >= 20.x
- npm >= 10.x
- Mercora Cloud API running at `http://127.0.0.1:5001` (or your backend URL)

## Setup & Installation

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Verify environment configuration:
   ```env
   NEXT_PUBLIC_APP_NAME="Mercora Deal OS"
   NEXT_PUBLIC_API_URL="/api"
   INTERNAL_BACKEND_URL="http://127.0.0.1:5001"
   PORT=9000
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:9000`.

## Production Build

```bash
npm run build
npm run start
```
