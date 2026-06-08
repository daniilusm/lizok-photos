# syntax=docker/dockerfile:1.6
# Базовый образ с включенным corepack/pnpm
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@11.0.8 --activate
WORKDIR /opt/app

# Стадия сборки: ставим build-зависимости и собираем Strapi
FROM base AS builder
# Пакеты, нужные только на сборке (sharp, node-gyp, admin build)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    pkgconfig \
    vips-dev \
    libc6-compat \
    git

# Копируем манифесты первыми для кеширования слоев
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Кешируем стор pnpm
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    CI=true pnpm install --frozen-lockfile

# Копируем исходники
COPY . .

# Сборка Strapi (админка и т.д.)
# Предполагается, что в package.json прописан script "build": "strapi build"
ENV NODE_ENV=production
## Читаем runtime env (для сборки админки Strapi могут потребоваться некоторые переменные)
RUN --mount=type=secret,id=backend_env \
    export $(grep -v '^[#[:space:]]' /run/secrets/backend_env | xargs) && \
    pnpm build

# Обрезаем devDependencies, чтобы в рантайм ушли только prod deps
FROM builder AS pruner
RUN pnpm prune --prod

# Легкий рантайм-образ
FROM node:22-alpine AS runner
# Нужные в рантайме библиотеки (vips для sharp), tini как init-процесс
RUN apk add --no-cache vips tini libc6-compat

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@11.0.8 --activate
ENV CI=true

ENV PORT=1337

WORKDIR /opt/app

# Копируем собранное приложение и production-зависимости
COPY --chown=node:node --from=pruner /opt/app ./

# Папка для загрузок (сделайте volume в compose/k8s, чтобы сохранялись файлы)
VOLUME ["/opt/app/public/uploads"]

RUN mkdir -p /opt/app/database /opt/app/database/migrations /opt/app/public/uploads /opt/app/.tmp /opt/app/.cache \
  && chown -R node:node /opt/app

EXPOSE 1337

USER node
# Запуск через tini для корректного управления сигналами
CMD ["tini", "--", "pnpm", "start"]
