# Mercora Admin Dashboard

Standalone Next.js 16+ Admin Dashboard for the Mercora B2B Platform.

## Requirements

- Node.js >= 20.x
- npm >= 10.x
- Mercora Cloud API running at `http://127.0.0.1:5001` (or your backend URL)

## Setup & Installation

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Ensure `NEXT_PUBLIC_API_URL` and `INTERNAL_API_URL` point to your Mercora Cloud API:
   ```env
   NEXT_PUBLIC_API_URL=/api
   INTERNAL_API_URL=http://127.0.0.1:5001
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
