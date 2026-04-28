# =============================================================================
# julianwiley-portal — multi-stage, multi-arch container image
# =============================================================================
# Stages:
#   1. deps     — install node_modules with a frozen lockfile
#   2. builder  — `next build` -> .next/standalone (self-contained server bundle)
#   3. runner   — minimal runtime image (no node_modules, no source)
#
# Build locally:
#   docker build -t portal:dev .
#
# Build multi-arch and push (handled by .github/workflows/docker.yml):
#   docker buildx build --platform linux/amd64,linux/arm64 \
#       -t ghcr.io/julianwileymac/portal:latest --push .
#
# The runtime image is non-root, listens on $PORT (default 3000), and runs
# `node server.js` from the Next.js standalone output.
# =============================================================================

ARG NODE_VERSION=20-alpine

# -----------------------------------------------------------------------------
# 1. deps — install only the dependencies needed for the build
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS deps
WORKDIR /app

# libc6-compat lets sharp / native modules run on Alpine; cheap insurance.
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
# `--legacy-peer-deps` lets `@ant-design/v5-patch-for-react-19` (peer: React >=19)
# coexist with the React 18 pin in package.json. The patch is a no-op on the
# pinned React 18 runtime and silences the antd v5 compat warning Next 15.5
# triggers because Next ships React 19 to the browser internally.
RUN npm ci --no-audit --no-fund --legacy-peer-deps

# -----------------------------------------------------------------------------
# 2. builder — compile the Next.js app
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# `AUTH_SECRET` is required at build time for NextAuth's static analysis on
# routes that embed `auth()`; the value here is replaced at runtime via env.
ENV AUTH_SECRET=build-time-placeholder-not-used-at-runtime

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# -----------------------------------------------------------------------------
# 3. runner — production image
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as a non-root user.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 --ingroup nodejs nextjs

# Copy the public directory and the standalone server bundle. The static
# assets must live under `.next/static` for the standalone server to find
# them at the same relative path used at build time.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Ship the migrated MDX/markdown corpus so the Node server can read posts at
# runtime via lib/mdx.ts -> getAllPostMeta() / getPostBySlug().
COPY --from=builder --chown=nextjs:nodejs /app/content ./content

USER nextjs

EXPOSE 3000

# Simple TCP-style health check; the app responds with 200 on `/`
# (statically generated) so curl is sufficient and adds no Node start-up cost.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
