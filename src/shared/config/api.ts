import { isServer } from "./vars";

export type StrapiConfigType = {
  strapiUrl: string;
  strapiNetworkUrl: string;
  strapiApiToken: string;
  previewSecret?: string;
};

/**
 * DEPLOY (static Vercel): Strapi не используется.
 * Переменные можно не задавать — клиент не инициализируется.
 *
 * Для CMS-режима понадобятся:
 * - NEXT_PUBLIC_STRAPI_URL
 * - NEXT_PUBLIC_NETWORK_STRAPI_URL (server-side fetch)
 * - NEXT_PUBLIC_STRAPI_API_TOKEN
 * - PREVIEW_SECRET (для draft preview API)
 */
export const STRAPI_CONFIG: StrapiConfigType = {
  strapiUrl: process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337",
  strapiNetworkUrl:
    (isServer
      ? process.env.NEXT_PUBLIC_NETWORK_STRAPI_URL
      : process.env.NEXT_PUBLIC_STRAPI_URL) || "",
  strapiApiToken: process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "",
  previewSecret: process.env.PREVIEW_SECRET,
};

export const IS_STRAPI_ENABLED =
  Boolean(process.env.NEXT_PUBLIC_STRAPI_URL) &&
  Boolean(process.env.NEXT_PUBLIC_STRAPI_API_TOKEN);
