import Typograf from "typograf";

const tp = new Typograf({ locale: ["ru", "en-US"] });

tp.disableRule("common/space/delLeadingBlanks");
tp.disableRule("common/space/trimLeft");
tp.disableRule("common/space/trimRight");

/** Ключи, чьи значения и потомки не трогаем (URL, id, медиа). */
const SKIP_KEYS = new Set([
  "id",
  "slug",
  "url",
  "href",
  "src",
  "image",
  "images",
  "mainImage",
  "favoriteImages",
  "comparisonImages",
  "date",
  "path",
  "ogImageUrl",
  "keywords",
  "breakImage",
  "sameAs",
]);

const isUrlLike = (value: string) =>
  /^https?:\/\//i.test(value) ||
  value.startsWith("data:") ||
  value.includes("res.cloudinary.com") ||
  value.includes("cloudinary.com");

export const typografText = (value: string): string => {
  if (!value || !value.trim() || isUrlLike(value)) return value;
  return tp.execute(value);
};

export const typografDeep = <T>(value: T, skip = false): T => {
  if (skip) return value;

  if (Array.isArray(value)) {
    return value.map((item) => typografDeep(item, false)) as T;
  }

  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};

    for (const [key, nested] of Object.entries(
      value as Record<string, unknown>,
    )) {
      result[key] = typografDeep(nested, SKIP_KEYS.has(key));
    }

    return result as T;
  }

  if (typeof value === "string") {
    return typografText(value) as T;
  }

  return value;
};
