# syntax=docker/dockerfile:1

# ── deps ─ install all deps (build needs dev deps) ───────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package*.json .npmrc ./
RUN npm ci --no-audit --no-fund

# ── build ─ produce the standalone output ───────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ── runner ─ minimal, non-root, standalone only ──────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME="0.0.0.0" \
    PORT=3000 \
    CONFIG_PATH="/app/data/config.json"

# dumb-init = clean PID 1 (proper signal handling / graceful shutdown)
RUN apk add --no-cache dumb-init \
 && addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Next standalone bundles only the traced runtime deps — no full node_modules.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public           ./public
COPY --from=builder --chown=nextjs:nodejs /app/config.default.json ./config.default.json

# Persistent, writable config lives on a volume (seeded from config.default.json)
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data
VOLUME ["/app/data"]

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
