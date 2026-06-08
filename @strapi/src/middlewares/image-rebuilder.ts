import {
  generateImageUrl,
  type IGenerateImageUrl,
} from "@imgproxy/imgproxy-node";
import type { Core } from "@strapi/strapi";

import { getStrapiUrl, isPlainObject, transformApiResponse } from "../utils";

// Типы для изображений
type ImageProxySourceItem = {
  url: string;
  size: number;
};

type RebuiltImage = {
  id?: string | number;
  documentId?: string | number;
  mediaType: "image";
  alt?: string | null;
  mime?: string;
  originalUrl: string;
  url: string;
  source: ImageProxySourceItem[];
  width: number;
  height: number;
};

type ImageData = {
  id?: string | number;
  documentId?: string | number;
  alternativeText?: string | null;
  formats?: Record<string, string>;
  mime?: string;
  url?: string;
  width?: number;
  height?: number;
  [key: string]: unknown;
};

type RebuildableValue = unknown;

type ImageProxySize = {
  width?: number;
  height?: number;
};

type Format = NonNullable<IGenerateImageUrl["options"]>["format"];

// Конфигурация imgproxy из переменных окружения
const IMG_PROXY_CONFIG = {
  URL: process.env.IMGPROXY_URL || "http://localhost:8080",
  KEY: process.env.IMGPROXY_KEY || "H",
  SALT: process.env.IMGPROXY_SALT || "H",
};


// Словарь замен URL
const getUrlReplacements = (strapiUrl: string): Record<string, string> => {
  return {
    [strapiUrl]: "local://",
    "http://localhost:1337": "local://",
    "https://localhost:1337": "local://",
  };
};

// Словарь экранирования символов
const escapeReplacements: Record<string, string> = {
  "%": "%25",
  "?": "%3F",
  "@": "%40",
};

/**
 * Экранирует специальные символы регулярных выражений в строке
 */
const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Применяет замены по словарю к строке
 */
const applyReplacements = (
  str: string,
  replacements: Record<string, string>,
): string => {
  let result = str;
  for (const [search, replace] of Object.entries(replacements)) {
    const escapedSearch = escapeRegex(search);
    result = result.replace(new RegExp(escapedSearch, "g"), replace);
  }
  return result;
};

/**
 * Генерирует подписанный URL для imgproxy
 */
const imageproxyUrl = (
  src: string,
  format: Format,
  dpr: number,
  quality: number,
  size: ImageProxySize | undefined,
  strapiUrl: string,
): string => {
  // Если это относительный путь, делаем его абсолютным
  let fullSrc: string;
  try {
    fullSrc = new URL(src, strapiUrl).toString();
  } catch {
    fullSrc = src;
  }

  // Применяем замены URL
  const urlReplacements = getUrlReplacements(strapiUrl);
  const normalizedSrc = applyReplacements(fullSrc, urlReplacements);

  // Применяем экранирование символов
  const escapedSrc = applyReplacements(normalizedSrc, escapeReplacements);

  // Формируем объект options
  const options: IGenerateImageUrl["options"] = {
    format,
    dpr,
    quality,
  };

  // Добавляем resize только если указан size с width или height
  if (size && (size.width !== undefined || size.height !== undefined)) {
    options.resize = {
      resizing_type: "fill",
    };

    if (size.width !== undefined) {
      options.resize.width = size.width;
    }

    if (size.height !== undefined) {
      options.resize.height = size.height;
    }
  }

  return generateImageUrl({
    endpoint: IMG_PROXY_CONFIG.URL,
    url: {
      value: escapedSrc,
      displayAs: "plain",
    },
    options,
    salt: IMG_PROXY_CONFIG.SALT,
    key: IMG_PROXY_CONFIG.KEY,
  });
};


/**
 * Преобразует данные изображения в RebuiltImage
 */
const getImage = (
  data: ImageData,
  config: {
    imageSizes: number[];
    format: string;
    dpr: number;
    quality: number;
  },
  strapiUrl: string,
): RebuiltImage => {
  const id = data.id;
  const documentId = data.documentId;
  const alternativeText = data.alternativeText;
  const url = typeof data.url === "string" ? data.url : "";
  const mime = typeof data.mime === "string" ? data.mime : "";
  const width = typeof data.width === "number" ? data.width : 1920;
  const height = typeof data.height === "number" ? data.height : 0;

  // Нормализуем формат (jpeg -> jpg для imgproxy)
  const normalizedFormat =
    config.format === "jpeg"
      ? "jpg"
      : (config.format as "webp" | "avif" | "jpg" | "png");

  // Генерируем полный URL изображения
  const fullImageUrl = imageproxyUrl(
    url,
    normalizedFormat,
    config.dpr,
    config.quality,
    {
      width: 1920,
    },
    strapiUrl,
  );

  // Генерируем URL для разных размеров
  const imageProxyUrlsBySize: ImageProxySourceItem[] = config.imageSizes.map(
    (size) => {
      return {
        url: imageproxyUrl(
          url,
          normalizedFormat,
          config.dpr,
          config.quality,
          {
            width: size,
          },
          strapiUrl,
        ),
        size,
      };
    },
  );

  const source: ImageProxySourceItem[] = [
    ...imageProxyUrlsBySize,
    {
      url: fullImageUrl,
      size: 1920,
    },
  ];

  const obj: RebuiltImage = {
    id,
    documentId,
    mediaType: "image",
    alt: alternativeText,
    mime,
    originalUrl: url,
    url: fullImageUrl,
    source,
    width,
    height,
  };

  return obj;
};

/**
 * Рекурсивно обрабатывает объект и преобразует изображения
 */
const rebuildImage = (
  obj: RebuildableValue,
  config: {
    imageSizes: number[];
    format: string;
    dpr: number;
    quality: number;
  },
  strapiUrl: string,
): RebuildableValue => {
  if (isPlainObject(obj)) {
    const objRecord = obj as Record<string, RebuildableValue>;
    const n: Record<string, RebuildableValue> = {};

    Object.keys(objRecord).forEach((k) => {
      n[k] = rebuildImage(objRecord[k], config, strapiUrl);
    });

    // Проверяем, является ли это изображением
    if (
      Object.keys(obj).includes("formats") &&
      Object.keys(obj).includes("mime") &&
      typeof obj.mime === "string" &&
      obj.mime.includes("image") &&
      !obj.mime.includes("svg")
    ) {
      return getImage(obj as ImageData, config, strapiUrl);
    }

    return n;
  }

  if (Array.isArray(obj)) {
    return obj.map((i) => {
      return rebuildImage(i, config, strapiUrl);
    });
  }

  return obj;
};

/**
 * Middleware для обработки изображений через imgproxy
 */
export default (_config: unknown, options: { strapi: Core.Strapi }) => {
  const strapiUrl = getStrapiUrl(options.strapi);

  // Get plugin configuration
  const pluginConfig = options.strapi.config.get("plugin.imageproxy") as {
    enabled?: boolean;
    config?: {
      imageSizes?: number[];
      format?: string;
      dpr?: number;
      quality?: number;
    };
  } | null;

  // Use configuration from plugins.ts or fallback to defaults
  const middlewareConfig = {
    enabled: pluginConfig?.enabled ?? true,
    imageSizes: pluginConfig?.config?.imageSizes ?? [320, 720, 1440, 1920],
    format: pluginConfig?.config?.format ?? "webp",
    dpr: pluginConfig?.config?.dpr ?? 1,
    quality: pluginConfig?.config?.quality ?? 90,
  };

  return async (
    ctx: {
      status: number;
      body?: unknown;
      url?: string;
      request?: {
        url?: string;
      };
    },
    next: () => Promise<void>,
  ) => {
    await next();

    // Если плагин выключен, пропускаем обработку
    if (!middlewareConfig.enabled) {
      return;
    }

    transformApiResponse(ctx, (data) =>
      rebuildImage(data, middlewareConfig, strapiUrl),
    );
  };
};
