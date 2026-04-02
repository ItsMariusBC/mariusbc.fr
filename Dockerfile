# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# better-sqlite3 needs build tools to compile native addon
RUN apk add --no-cache python3 make g++

COPY package*.json .npmrc ./
COPY prisma.config.ts ./
COPY prisma ./prisma/

RUN npm ci

COPY . .
RUN npm run build

# ── Production stage ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache curl

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

ENV NODE_ENV=production \
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

# Copy node_modules for Prisma CLI + better-sqlite3 native addon
COPY --from=builder /app/node_modules ./node_modules/

# Create data directory for SQLite
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

# Startup script
COPY startup.sh ./
RUN chmod +x startup.sh

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3000}/api/health || exit 1

CMD ["./startup.sh"]
