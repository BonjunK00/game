# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!
FROM node:22-alpine AS base

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app
COPY . .

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer

RUN apk add --no-cache libc6-compat
RUN apk --no-cache add --virtual .builds-deps build-base python3

WORKDIR /app

RUN npm install -g node-gyp corepack@latest
RUN corepack enable

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM base AS runner
WORKDIR /app

# install usermod and change node user to 1001
RUN echo http://dl-2.alpinelinux.org/alpine/edge/community/ >> /etc/apk/repositories
RUN apk --no-cache add shadow
RUN groupmod -g 1001 node \
  && usermod -u 1001 -g 1001 node

# Don't run production as root
RUN addgroup --system --gid 3000 nodejs
RUN adduser --system -G nodejs --uid 1000 nextjs -D
USER nextjs

# COPY --from=installer /app/next-i18next.config.js .
COPY --from=installer /app/next.config.mjs .
COPY --from=installer /app/package.json .
COPY --from=installer /app/pnpm-lock.yaml .
#COPY --from=installer /app/.env.production ./.env.production

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=installer --chown=nextjs:nodejs /app/public ./public
COPY --from=installer --chown=nextjs:nodejs /app/entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

CMD node server.js