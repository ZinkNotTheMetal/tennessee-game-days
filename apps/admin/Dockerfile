# PRISMA:
# https://stackoverflow.com/questions/67746885/prisma-client-did-not-initialize-yet-please-run-prisma-generate-and-try-to-i

FROM node:alpine AS base
RUN apk add --no-cache libc6-compat && apk update
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

RUN pnpm add -g turbo

ARG VERSION_NUMBER
ENV NEXT_PUBLIC_VERSION_NUMBER ${VERSION_NUMBER}

FROM base as builder
WORKDIR /app
# Copy ALL files minus .dockerignore
COPY . .

# run turbo prune to get an out directory that has all files that
#  are needed to run admin (including any dependency projects)
RUN turbo prune --scope=admin --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY .npmrc ./.npmrc
RUN pnpm install --no-frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM
# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN
RUN turbo run build --filter=admin...

FROM base AS runner
ENV UV_THREADPOOL_SIZE=128
ENV NODE_ENV production

EXPOSE 3000
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer . .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# To enable standalone - modify the next.config.js
COPY --from=installer --chown=nextjs:nodejs /app/apps/admin/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/admin/public ./apps/admin/public

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD [ "node", "apps/admin/server.js" ]