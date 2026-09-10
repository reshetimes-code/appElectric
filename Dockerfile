# syntax=docker/dockerfile:1

# ---- deps: install dependencies -------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---- builder: build the Next.js app ----------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runner: minimal production image --------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Standalone server + static assets + public files.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Bundled seed data (read once by the /api/admin/migrate-to-firestore endpoint).
COPY --from=builder --chown=nextjs:nodejs /app/data-store ./data-store

USER nextjs

# Cloud Run injects PORT (defaults to 8080); Next's standalone server.js
# honors process.env.PORT already, so nothing is hardcoded here.
EXPOSE 8080

CMD ["node", "server.js"]
