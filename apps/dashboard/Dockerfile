# syntax=docker/dockerfile:1
FROM node:24-alpine AS build
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@10.32.1 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps ./apps
COPY packages ./packages
COPY cli/src/runtime ./cli/src/runtime
RUN pnpm install --frozen-lockfile --ignore-scripts
# Values are supplied explicitly using --secret id=build_env,src=... .
# BuildKit never persists this file in a layer. Use safe build values only.
RUN --mount=type=secret,id=build_env,required=true \
    node --env-file=/run/secrets/build_env /usr/local/bin/pnpm exec turbo run build --filter=dashboard...

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /repo/apps/dashboard/.next/standalone ./
COPY --from=build --chown=node:node /repo/apps/dashboard/.next/static ./apps/dashboard/.next/static
COPY --from=build --chown=node:node /repo/apps/dashboard/public ./apps/dashboard/public
USER node
EXPOSE 3001
CMD ["node", "apps/dashboard/server.js"]
