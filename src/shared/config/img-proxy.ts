/**
 * DEPLOY (static Vercel): imgproxy не используется.
 * Изображения берутся напрямую из /public или внешних URL.
 *
 * Для imgproxy понадобятся отдельный сервис и env:
 * - IMGPROXY_URL
 * - IMGPROXY_KEY
 * - IMGPROXY_SALT
 */
export const IMG_PROXY_CONFIG = {
  URL: process.env.IMGPROXY_URL || "http://localhost:8080",
  KEY: process.env.IMGPROXY_KEY || "H",
  SALT: process.env.IMGPROXY_SALT || "H",
};

export const IS_IMGPROXY_ENABLED = Boolean(process.env.IMGPROXY_URL);
