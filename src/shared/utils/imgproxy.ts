import type { StaticImageData } from "next/image";

import { IS_IMGPROXY_ENABLED } from "@shared/config";

type ImageProxyFormat = "webp" | "jpeg" | "png" | "avif";

export type ImageProxySize = {
  width?: number;
  height?: number;
};

/**
 * DEPLOY (static Vercel): заглушка без imgproxy.
 * Возвращает исходный URL — подходит для файлов из /public.
 *
 * Для imgproxy раскомментировать реализацию с @imgproxy/imgproxy-node
 * и вызывать только на сервере (getStaticProps / API routes).
 */
export const imageproxyUrl = (
  src: string | StaticImageData,
  _format: ImageProxyFormat = "webp",
  _dpr = 2,
  _quality = 95,
  _size?: ImageProxySize,
) => {
  if (!IS_IMGPROXY_ENABLED) {
    return typeof src === "string" ? src : src.src;
  }

  // DEPLOY: imgproxy runtime не подключён в static export.
  console.warn(
    "[imgproxy] IS_IMGPROXY_ENABLED=true, но серверная генерация URL отключена для static deploy.",
  );

  return typeof src === "string" ? src : src.src;
};

/*
 * --- Оригинальная реализация (требует imgproxy-сервис + server runtime) ---
 *
 * import { generateImageUrl } from "@imgproxy/imgproxy-node";
 * import { IMG_PROXY_CONFIG, STRAPI_CONFIG, siteOrigin } from "@shared/config";
 * ...
 */
