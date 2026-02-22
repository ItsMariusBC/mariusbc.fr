# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests (including .npmrc for legacy-peer-deps)
COPY package*.json .npmrc ./

# Install all dependencies (dev included, needed for build)
RUN npm ci

# Copy Prisma config and schema, then generate the client (WASM engine)
COPY prisma.config.ts ./
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source and build
COPY . .
RUN npm run build

# ── Production stage ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache curl su-exec openssl

# Non-root user for running the app
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

ENV NODE_ENV=production \
    HOSTNAME="0.0.0.0"

# Next.js standalone server (includes server.js + traced node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma schema and config (needed by prisma CLI at startup for migrations)
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/prisma.config.ts ./

# All Prisma packages: CLI + WASM client + native engines + all transitive @prisma/* deps
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma/
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma/
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma/
RUN mkdir -p ./node_modules/.bin && \
    ln -sf ../prisma/build/index.js ./node_modules/.bin/prisma && \
    chmod +x ./node_modules/.bin/prisma

# Startup script
COPY startup.sh ./
RUN chmod +x startup.sh

EXPOSE 3000

# PORT is set automatically by Railway; falls back to 3000 locally
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3000}/api/health || exit 1

CMD ["./startup.sh"]
