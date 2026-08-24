# Multi-stage build optimized for production

ARG NODE_VERSION=20
ARG VERSION=1.0.0-SNAPSHOT

# ============================================
# STAGE 1: Dependencies
# ============================================
FROM node:${NODE_VERSION}-alpine AS dependencies

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --include=dev && \
    npm cache clean --force

# ============================================
# STAGE 2: Builder
# ============================================
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ============================================
# STAGE 3: Production dependencies
# ============================================
FROM node:${NODE_VERSION}-alpine AS production-deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --only=production && \
    npm cache clean --force

# ============================================
# STAGE 4: Production image
# ============================================
FROM node:${NODE_VERSION}-alpine AS production

ARG VERSION=1.0.0-SNAPSHOT

LABEL description="NestJS BFF starter"
LABEL version="${VERSION}"
LABEL org.opencontainers.image.version="${VERSION}"

RUN apk add --no-cache dumb-init curl

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app

COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

ENV NODE_ENV=production
ENV PORT=3000
ENV APP_VERSION=${VERSION}
ENV THROTTLE_TTL=60
ENV THROTTLE_LIMIT=10

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/main.js"]
