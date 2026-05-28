# =========================================================
# STAGE 1 — PRUNE MONOREPO
# =========================================================
FROM node:20-alpine AS pruner
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN corepack enable && corepack prepare pnpm@10.28.2 --activate
RUN pnpm add -g turbo

COPY . .
RUN turbo prune @madkunyah/server --docker

# =========================================================
# STAGE 2 — BUILD
# =========================================================
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV CI=true

RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/full/ .
COPY tsconfig.base.json ./tsconfig.base.json

# Install everything for the build
RUN pnpm install --frozen-lockfile

# Build everything
RUN pnpm turbo build --filter=@madkunyah/server...

# Isolated production deployment
# This extracts the server, bundles @madkunyah/core directly into node_modules, and discards all devDependencies perfectly into a single folder.
RUN pnpm config set force-legacy-deploy true && \
  pnpm --filter=@madkunyah/server deploy --prod /app/isolated

# =========================================================
# STAGE 3 — PRODUCTION RUNTIME
# =========================================================
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S nodejs && adduser -S expressjs -G nodejs

# Simply copy the entirely self-contained isolated directory
COPY --from=builder --chown=expressjs:nodejs /app/isolated .

USER expressjs

EXPOSE 5005

# Because 'deploy' flattens the target package, your entrypoint 
# shifts directly to the root dist folder!
CMD ["node", "dist/index.js"]