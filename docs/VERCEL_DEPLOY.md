# Static deploy на Vercel

Проект настроен на **полностью статическую сборку** (`output: "export"` в `next.config.ts`).

## Что работает

- Статические страницы (`/`, `/interactive-particles/`, `/project/demo/`)
- WebGL-компоненты (parallax gallery, interactive particles) — client-side
- Ассеты из `/public`

## Что отключено для деплоя

| Функция | Причина |
|---------|---------|
| **Strapi CMS** | Требует server runtime + env переменные |
| **imgproxy** | Отдельный сервис, server-side генерация URL |
| **API routes** (`/api/preview`, `/api/exit-preview`) | Несовместимы со static export |
| **PreviewBanner / draft mode** | Зависит от Strapi + API routes |
| **getServerSideProps** | Заменён на static pages / getStaticProps |
| **sitemap.xml.ts / robots.txt.ts** | Заменены на файлы в `/public` |

## Env на Vercel (минимум)

```env
NEXT_PUBLIC_SITE_URL=https://lizok-a-ph.ru
NEXT_PUBLIC_APP_ENV=production
```

Опционально (аналитика):

```env
NEXT_PUBLIC_GA_TRACKING_ID=
NEXT_PUBLIC_YANDEX_TRACKING_ID=
```

**Не нужны для static deploy:**

```env
# NEXT_PUBLIC_STRAPI_URL=
# NEXT_PUBLIC_STRAPI_API_TOKEN=
# IMGPROXY_URL=
# IMGPROXY_KEY=
# IMGPROXY_SALT=
# PREVIEW_SECRET=
```

## Vercel settings

- **Framework Preset:** Next.js
- **Build Command:** `pnpm build`
- **Output Directory:** `out` (автоматически при `output: "export"`)
- **Install Command:** `pnpm install`

## Перед продакшеном

1. Убедитесь, что в `public/robots.txt` и `public/sitemap.xml` указан `https://lizok-a-ph.ru`
2. Задайте `NEXT_PUBLIC_SITE_URL=https://lizok-a-ph.ru` в Vercel Environment Variables
3. Добавьте `public/og.webp` если используете OG-теги

## Включение CMS обратно

1. Уберите `output: "export"` из `next.config.ts` (или перейдите на ISR)
2. Раскомментируйте `strapi-client.ts` и `getServerSideProps` в `pages/index.tsx`
3. Раскомментируйте `PreviewBanner` в `_app.tsx`
4. Восстановите server-side `imageproxyUrl` в `src/shared/utils/imgproxy.ts`
5. Верните API routes для preview mode
