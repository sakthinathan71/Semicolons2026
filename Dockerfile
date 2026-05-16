# ─────────────────────────────────────────────────────────────────────────────
# LuxeLens AI — Production Dockerfile
# Multi-stage build for AWS ECS / Fargate deployment
#
# Build context: ./luxelens  (docker build . from inside the luxelens directory)
# Exposes port 8000 as required by ECS task definition & ALB health checks
#
# Usage:
#   docker build -t luxelens-ai .
#   docker run -p 8000:8000 --env-file .env.local luxelens-ai
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Dependency Installation ─────────────────────────────────────────
FROM node:20-alpine AS deps

# libc6-compat required by some native Node add-ons (e.g. sharp)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy only package manifests — maximises Docker layer cache hits
COPY package.json package-lock.json* ./

# Install all dependencies (dev deps needed for Next.js build)
RUN npm ci --frozen-lockfile


# ── Stage 2: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Bring in node_modules from stage 1
COPY --from=deps /app/node_modules ./node_modules

# Copy the full application source
COPY . .

# Disable telemetry during build (no outbound network calls in CI/CD)
ENV NEXT_TELEMETRY_DISABLED=1

# Build — next.config.ts has output:'standalone' which produces:
#   .next/standalone/  — self-contained Node.js server
#   .next/static/      — compiled CSS, JS, fonts
RUN npm run build


# ── Stage 3: Production Runner ────────────────────────────────────────────────
# Minimal Alpine image — no build tools, no dev deps, no source maps.
FROM node:20-alpine AS runner

# Security: create a non-root user to run the process
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

WORKDIR /app

# Runtime environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Port 8000 — ECS task definition hardcodes containerPort:8000
# HOSTNAME must be 0.0.0.0 so the server accepts external connections
ENV PORT=8000
ENV HOSTNAME="0.0.0.0"

# Copy the standalone server (includes only runtime node_modules — no full install needed)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy compiled static assets (CSS, JS chunks, fonts)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy public directory (favicon, robots.txt, OG images, etc.)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Run as non-root
USER nextjs

# Expose port 8000 (ALB target group health-checks on this port)
EXPOSE 8000

# Health check — ALB will probe /api/health
# Start checking after 30s (allow cold start), then every 15s, 3 retries
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:8000/api/health || exit 1

# Start the Next.js standalone server
# PORT is picked up automatically by the standalone server.js
CMD ["node", "server.js"]
