# ── Dependencies stage ───────────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

USER root

# better-sqlite3 needs build tools to compile native addon
RUN apk add --no-cache python3 make g++

ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json .npmrc ./
COPY prisma.config.ts ./
COPY prisma ./prisma/

RUN npm ci --include=dev --no-audit --no-fund

# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

USER root

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./
COPY --from=deps /app/prisma.config.ts ./
COPY --from=deps /app/prisma ./prisma

COPY . .
RUN npm run build

# ── Production stage ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

USER root

RUN grep -q '^nodejs:' /etc/group || addgroup --system --gid 1001 nodejs && \
    id -u nextjs >/dev/null 2>&1 || adduser --system --uid 1001 nextjs

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME="0.0.0.0" \
    DATABASE_URL="file:/app/data/portfolio.db"

# Next.js standalone server
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Public assets (hero GIF, etc.)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Prisma schema and config (needed for db push at startup)
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/package.json ./package.json

# Copy the full dependency tree so Prisma CLI and native SQLite dependencies
# are always available at container startup.
COPY --from=deps /app/node_modules ./node_modules/

# Create data directory for SQLite
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

# Startup script
COPY startup.sh ./
RUN chmod +x startup.sh

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "fetch(`http://127.0.0.1:${process.env.PORT || 3000}/api/health`).then((res) => { if (!res.ok) process.exit(1); }).catch(() => process.exit(1))"

CMD ["./startup.sh"]
