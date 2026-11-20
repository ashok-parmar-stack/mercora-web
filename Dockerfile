# Multi-stage production build for Next.js App
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies
COPY package.json package-lock.json* ./
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

RUN npm install
RUN npm --workspace=packages/theme-config run build || true
RUN npm --workspace=packages/shared-types run build || true
ENV BUILD_STANDALONE=true
RUN npm --workspace=apps/web run build

# Production standalone runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
