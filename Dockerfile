# WhiskyMart demo — single-instance container.
# A long-running Node process keeps the (in-memory) order/review stores stable,
# which is the most reliable way to host the preview. (Production swaps these
# for Postgres etc. — see DEFERRED.md.)
FROM node:22-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Install dependencies (cached on lockfile changes)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json tsconfig.base.json ./
COPY packages/types/package.json packages/types/package.json
COPY apps/web/package.json apps/web/package.json
RUN pnpm install --frozen-lockfile

# Build
COPY . .
RUN pnpm --filter @whiskymart/web build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["pnpm", "--filter", "@whiskymart/web", "start", "--", "-p", "3000"]
