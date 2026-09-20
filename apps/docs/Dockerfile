# syntax=docker/dockerfile:1
FROM node:24-alpine AS build
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@10.32.1 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps ./apps
COPY packages ./packages
RUN pnpm install --frozen-lockfile --ignore-scripts
# Values are supplied explicitly using --secret id=build_env,src=... .
# BuildKit never persists this file in a layer. Use safe build values only.
RUN --mount=type=secret,id=build_env,required=true \
    node --env-file=/run/secrets/build_env /usr/local/bin/pnpm exec turbo run build --filter=docs...

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3004
ENV HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /repo/apps/docs/.next/standalone ./
COPY --from=build --chown=node:node /repo/apps/docs/.next/static ./apps/docs/.next/static
COPY --from=build --chown=node:node /repo/apps/docs/public ./apps/docs/public
USER node
EXPOSE 3004
CMD ["node", "apps/docs/server.js"]
