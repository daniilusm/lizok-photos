# syntax=docker/dockerfile:1.6
# База с corepack/pnpm
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@11.0.8 --activate
WORKDIR /app

# Отдельный слой для зависимостей (кешируемый)
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
  pnpm install --frozen-lockfile

# Сборка Next
FROM base AS builder
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Загружаем переменные окружения из секрета для сборки Next.js
RUN --mount=type=secret,id=frontend_env \
  export $(grep -v '^[#[:space:]]' /run/secrets/frontend_env | xargs) && \
  pnpm build
#RUN pnpm build-storybook

# Обрезаем до production-зависимостей
FROM deps AS pruner
RUN pnpm prune --prod

# Легкий рантайм-образ
FROM node:22-alpine AS runner
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@11.0.8 --activate
RUN apk add --no-cache tini libc6-compat msmtp

# Настройка msmtp как sendmail
# Используем /usr/local/bin, который всегда доступен в Alpine
RUN mkdir -p /usr/local/bin && \
  ln -sf /usr/bin/msmtp /usr/local/bin/sendmail && \
  chmod +x /usr/bin/msmtp

WORKDIR /app

# Копируем только то, что нужно на рантайме
COPY --chown=node:node --from=pruner /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/.next ./.next
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/src ./src
COPY --chown=node:node --from=builder /app/src/pages ./src/pages
COPY --chown=node:node package.json ./
RUN chown -R node:node /app

EXPOSE 3000

USER node

# Запуск через tini для корректной обработки сигналов
# CMD ["tini", "--", "pnpm", "start"]
CMD ["tini", "--", "node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]