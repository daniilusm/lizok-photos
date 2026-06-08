# Image Proxy - Оптимизация изображений

Документация описывает систему оптимизации изображений через imgproxy в проекте.

## 📋 Содержание

- [Обзор](#обзор)
- [Архитектура](#архитектура)
- [Флоу обработки изображений](#флоу-обработки-изображений)
- [Компоненты системы](#компоненты-системы)
- [Использование](#использование)
- [Конфигурация](#конфигурация)
- [Типы данных](#типы-данных)

## Обзор

Проект использует [imgproxy](https://imgproxy.net/) для оптимизации изображений на лету. Это позволяет:

- Автоматически оптимизировать изображения (формат, качество, размер)
- Генерировать responsive изображения для разных устройств
- Кэшировать оптимизированные версии
- Уменьшать размер файлов и улучшать производительность

## Архитектура

```
┌─────────────┐
│   Strapi    │ ──► Изображения из /uploads/
└─────────────┘
      │
      ▼
┌─────────────────────────────────┐
│  rebuildImage()                 │
│  - Обрабатывает данные Strapi   │
│  - Генерирует RebuiltImage       │
└─────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────┐
│  imageproxyUrl()                 │
│  - Нормализует URL                │
│  - Применяет замены (local://)   │
│  - Экранирует символы            │
│  - Генерирует подписанный URL    │
└─────────────────────────────────┘
      │
      ▼
┌─────────────┐
│  imgproxy   │ ──► Оптимизация изображений
│  (Docker)   │     (ресайз, формат, качество)
└─────────────┘
      │
      ▼
┌─────────────────────────────────┐
│  MediaImage Component            │
│  - Отображает responsive images  │
│  - Поддержка picture/source      │
└─────────────────────────────────┘
```

## Флоу обработки изображений

### 1. Получение данных из Strapi

Изображения приходят из Strapi API в формате:

```json
{
  "id": 1,
  "url": "/uploads/image.jpg",
  "width": 1920,
  "height": 1080,
  "mime": "image/jpeg",
  "alternativeText": "Описание изображения"
}
```

### 2. Обработка через rebuildImage

Функция `rebuildImage()` автоматически находит изображения в данных и обрабатывает их:

```typescript
// src/shared/api/strapi/rebuild/functions/rebuildImage.ts

// Автоматически определяет изображения по наличию:
// - formats
// - mime (содержит "image", но не "svg")
// - url

const rebuiltImage = getImage(imageData);
// Результат:
{
  id: 1,
  documentId: "...",
  mediaType: "image",
  alt: "Описание",
  originalUrl: "http://localhost:1337/uploads/image.jpg",
  url: "http://localhost:8080/signed-url...", // Оптимизированный URL
  mime: "image/jpeg",
  width: 1920,
  height: 1080
}
```

### 3. Генерация оптимизированного URL

Функция `imageproxyUrl()` создает подписанный URL для imgproxy:

```typescript
// src/shared/utils/imgproxy.ts

imageproxyUrl(
  "http://localhost:1337/uploads/image.jpg",
  "webp",        // формат
  2,             // DPR (Device Pixel Ratio)
  95,            // качество (0-100)
  { width: 1920 } // размер
)
```

**Процесс обработки URL:**

1. **Разрешение URL**: Преобразует относительный путь в полный URL
2. **Нормализация**: Заменяет `localhost:1337` на `local://`
3. **Экранирование**: Экранирует специальные символы (`%`, `?`, `@`)
4. **Генерация подписи**: Создает подписанный URL с параметрами оптимизации

### 4. Обработка в imgproxy

imgproxy сервис:
- Загружает изображение по URL
- Применяет оптимизацию (ресайз, формат, качество)
- Возвращает оптимизированное изображение
- Кэширует результат

### 5. Отображение в компоненте

Компонент `MediaImage` использует оптимизированные URL:

```tsx
<MediaImage
  source={{
    default: rebuiltImage,
    md: rebuiltImageMd, // Для разных breakpoints
    lg: rebuiltImageLg
  }}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

## Компоненты системы

### 1. rebuildImage()

**Расположение**: `src/shared/api/strapi/rebuild/functions/rebuildImage.ts`

**Назначение**: Обрабатывает данные из Strapi и преобразует изображения в `RebuiltImage`

**Использование**:
```typescript
const processedData = rebuildImage(strapiData);
```

**Что делает**:
- Рекурсивно обходит объект/массив
- Находит объекты с изображениями (по наличию `formats`, `mime`)
- Преобразует в `RebuiltImage` с оптимизированным URL

### 2. imageproxyUrl()

**Расположение**: `src/shared/utils/imgproxy.ts`

**Назначение**: Генерирует подписанный URL для imgproxy

> ⚠️ **Важно**: Функция работает **только на сервере** (SSR, API routes, getServerSideProps, getStaticProps). На клиенте функция не может работать, так как `IMGPROXY_KEY` и `IMGPROXY_SALT` доступны только в серверном окружении для безопасности.

**Сигнатура**:
```typescript
imageproxyUrl(
  src: string | StaticImageData,
  format: "webp" | "avif" | "jpeg" | "png",
  dpr?: number,           // По умолчанию: 1
  quality?: number,        // По умолчанию: 95
  size?: ImageProxySize    // { width?, height? }
): string
```

**Примеры**:
```typescript
// Базовое использование
const url = imageproxyUrl(src, "webp");

// С размером
const url = imageproxyUrl(src, "webp", 2, 95, { width: 800 });

// С шириной и высотой
const url = imageproxyUrl(src, "webp", 2, 95, { width: 800, height: 600 });
```

**Обработка URL**:

1. **Замены URL** (словарь `urlReplacements`):
   - `http://localhost:1337` → `local://`
   - `https://localhost:1337` → `local://`

2. **Экранирование символов** (словарь `escapeReplacements`):
   - `%` → `%25`
   - `?` → `%3F`
   - `@` → `%40`

### 3. normalizeImageSourceUrl()

**Расположение**: `src/shared/utils/normalize-image-source-url.ts`

**Назначение**: Нормализует URL изображения для imgproxy

**Что делает**:
- Преобразует относительные пути в полные URL
- Проверяет, нужно ли обрабатывать через imgproxy
- Исключает файлы из `public` директории
- Обрабатывает только изображения из Strapi uploads или внешние URL

### 4. MediaImage Component

**Расположение**: `src/shared/ui/media-image/media-image.tsx`

**Назначение**: Компонент для отображения responsive изображений

**Поддержка**:
- Responsive images через `<picture>` и `<source>`
- Разные изображения для разных breakpoints
- Lazy loading
- Оптимизация через imgproxy

## Использование

### Базовое использование

```tsx
import { MediaImage } from "@shared/ui/media-image";

// Из RebuiltImage
<MediaImage image={rebuiltImage} altText="Описание" />

// Из MediaWithBreakpoints
<MediaImage 
  source={{
    xs: imageXs,
    md: imageMd,
    default: imageDefault
  }}
/>
```

### Использование imageproxyUrl напрямую

> ⚠️ **Важно**: Используйте `imageproxyUrl` только на сервере (в `getServerSideProps`, `getStaticProps`, API routes или серверных компонентах).

```tsx
// ✅ Правильно: в getServerSideProps или getStaticProps
export async function getServerSideProps() {
  const optimizedUrl = imageproxyUrl(
    "http://localhost:1337/uploads/image.jpg",
    "webp",
    2,
    95,
    { width: 1920 }
  );
  
  return { props: { imageUrl: optimizedUrl } };
}

// ❌ Неправильно: в клиентском компоненте
function ClientComponent() {
  // Это не сработает, так как KEY и SALT недоступны на клиенте
  const url = imageproxyUrl(...); // Ошибка!
}
```

### Автоматическая обработка из Strapi

```typescript
import { rebuildImage } from "@shared/api/strapi/rebuild/functions/rebuildImage";

// Данные из Strapi API
const strapiData = await fetchStrapiData();

// Автоматически обрабатывает все изображения
const processedData = rebuildImage(strapiData);

// Теперь все изображения имеют оптимизированные URL
```

## Конфигурация

### Переменные окружения

**Frontend** (`.env`):
```env
IMGPROXY_URL=http://localhost:8080
IMGPROXY_KEY=your-key-here
IMGPROXY_SALT=your-salt-here
```

**Docker Compose** (`docker-compose.yml`):
```yaml
imgproxy:
  environment:
    IMGPROXY_KEY: "${IMGPROXY_KEY}"
    IMGPROXY_SALT: "${IMGPROXY_SALT}"
    IMGPROXY_ALLOWED_SOURCES: "local"
```

### Конфигурация в коде

**Расположение**: `src/shared/config/img-proxy.ts`

```typescript
export const IMG_PROXY_CONFIG = {
  URL: process.env.IMGPROXY_URL || "http://localhost:8080",
  KEY: process.env.IMGPROXY_KEY || "H",
  SALT: process.env.IMGPROXY_SALT || "H",
};
```

> ⚠️ **Безопасность**: `IMGPROXY_KEY` и `IMGPROXY_SALT` должны быть установлены только в серверном окружении. Они не должны попадать в клиентский bundle. Next.js автоматически исключает переменные окружения из клиентского кода, если они не начинаются с `NEXT_PUBLIC_`.

## Типы данных

### RebuiltImage

```typescript
type RebuiltImage = {
  id?: string | number;
  documentId?: string | number;
  mediaType: "image";
  alt?: string | null;
  originalUrl: string;  // Исходный URL из Strapi
  url: string;          // Оптимизированный URL через imgproxy
  mime?: string;
  width?: number;
  height?: number;
};
```

### MediaWithBreakpoints

```typescript
type MediaWithBreakpoints = {
  xs?: RebuiltImage | null;
  sm?: RebuiltImage | null;
  md?: RebuiltImage | null;
  lg?: RebuiltImage | null;
  default?: RebuiltImage | null;
};
```

### ImageProxySize

```typescript
type ImageProxySize = {
  width?: number;
  height?: number;
};
```

## Особенности

### 1. Обработка localhost

URL вида `http://localhost:1337/uploads/image.jpg` автоматически преобразуются в `local:///uploads/image.jpg` для работы с imgproxy в Docker.

### 2. Экранирование символов

Специальные символы в URL автоматически экранируются для корректной работы с imgproxy.

### 3. Валидация параметров

Функция `imageproxyUrl` валидирует:
- `quality`: должен быть целым числом от 0 до 100
- `dpr`: должен быть положительным числом
- `width/height`: должны быть положительными целыми числами

### 4. Responsive Images

Компонент `MediaImage` автоматически генерирует `<source>` элементы для разных breakpoints, обеспечивая оптимальную загрузку изображений на разных устройствах.

### 5. Серверная и клиентская работа

**Серверная работа (SSR/SSG)**:
- `imageproxyUrl()` работает только на сервере
- `IMGPROXY_KEY` и `IMGPROXY_SALT` доступны только в серверном окружении
- Используйте в `getServerSideProps`, `getStaticProps`, API routes
- Используйте в серверных компонентах Next.js 13+

**Клиентская работа**:
- `imageproxyUrl()` **не работает** на клиенте
- Ключи подписи не должны попадать в клиентский bundle
- Все URL должны генерироваться на сервере и передаваться как props
- Компонент `MediaImage` получает уже готовые оптимизированные URL

## Примеры

### Пример 1: Базовое использование

```tsx
import { MediaImage } from "@shared/ui/media-image";
import { rebuildImage } from "@shared/api/strapi/rebuild/functions/rebuildImage";

const strapiData = await fetch("/api/home-page");
const processedData = rebuildImage(strapiData);

<MediaImage 
  image={processedData.image} 
  altText={processedData.image.alt || ""}
/>
```

### Пример 2: С разными размерами для breakpoints

```tsx
// В getServerSideProps или getStaticProps
export async function getServerSideProps() {
  const src = "http://localhost:1337/uploads/image.jpg";
  
  const sources = {
    xs: {
      url: imageproxyUrl(src, "webp", 2, 90, { width: 320 }),
      originalUrl: src,
      mediaType: "image" as const
    },
    md: {
      url: imageproxyUrl(src, "webp", 2, 90, { width: 768 }),
      originalUrl: src,
      mediaType: "image" as const
    },
    default: {
      url: imageproxyUrl(src, "webp", 2, 90, { width: 1920 }),
      originalUrl: src,
      mediaType: "image" as const
    }
  };
  
  return { props: { sources } };
}

// В компоненте страницы
function Page({ sources }) {
  return (
    <MediaImage
      source={sources}
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  );
}
```

### Пример 3: Прямое использование imageproxyUrl (только на сервере)

```tsx
// ✅ Правильно: в getServerSideProps
import { imageproxyUrl } from "@shared/utils/imgproxy";

export async function getServerSideProps() {
  const optimizedUrl = imageproxyUrl(
    "http://localhost:1337/uploads/image.jpg",
    "webp",
    2,
    95,
    { width: 800, height: 600 }
  );
  
  return { props: { imageUrl: optimizedUrl } };
}

// В компоненте
function Page({ imageUrl }) {
  return <img src={imageUrl} alt="Optimized image" />;
}
```

## Решение проблем

### Проблема: Изображения не загружаются

**Причина**: Неправильная конфигурация imgproxy или недоступность сервиса

**Решение**:
1. Проверьте, что imgproxy контейнер запущен: `docker-compose ps`
2. Проверьте переменные окружения `IMGPROXY_KEY` и `IMGPROXY_SALT`
3. Убедитесь, что `IMGPROXY_URL` указывает на правильный адрес

### Проблема: localhost не преобразуется в local://

**Причина**: URL не проходит через функцию `imageproxyUrl`

**Решение**: Убедитесь, что используете `imageproxyUrl()` для генерации URL, а не передаете исходный URL напрямую.

### Проблема: Ошибка валидации параметров

**Причина**: Некорректные значения параметров

**Решение**: 
- `quality` должен быть целым числом от 0 до 100
- `dpr` должен быть положительным числом
- `width/height` должны быть положительными целыми числами

### Проблема: imageproxyUrl не работает на клиенте

**Причина**: Функция требует `IMGPROXY_KEY` и `IMGPROXY_SALT`, которые доступны только на сервере

**Симптомы**:
- Ошибка `process.env.IMGPROXY_KEY is undefined` в браузере
- Изображения не загружаются
- Ошибки в консоли браузера

**Решение**:
1. Используйте `imageproxyUrl` только в серверных функциях:
   - `getServerSideProps()`
   - `getStaticProps()`
   - API routes (`pages/api/...`)
   - Серверные компоненты Next.js 13+
2. Генерируйте URL на сервере и передавайте как props
3. Используйте `rebuildImage()` для автоматической обработки данных из Strapi

## Ссылки

- [imgproxy документация](https://imgproxy.net/)
- [@imgproxy/imgproxy-node](https://github.com/imgproxy/imgproxy-node)
- [Responsive Images Guide](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
