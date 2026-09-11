import type { Image } from "@/shared/types/strapi-components/shared";
import type { Seo } from "@/shared/types/strapi-components/widgets";

export const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://lizok-a-ph.ru"
).replace(/\/$/, "");

export const PHOTOGRAPHER = {
  name: "Елизавета Акимова",
  brand: "Lizok Photos",
  shortBrand: "Lizok",
  city: "Тверь",
  region: "Тверская область",
  country: "Россия",
  jobTitle: "Фотограф",
  sameAs: [
    "https://www.instagram.com/lizok.a.ph",
    "https://t.me/Mu_lS",
    "https://vk.ru/lizok.a.phtver",
  ],
} as const;

/** Локальные и коммерческие запросы для Твери */
export const DEFAULT_KEYWORDS = [
  "фотограф Тверь",
  "фотограф в Твери",
  "фотосессии в Твери",
  "фотосессия Тверь",
  "свадебный фотограф Тверь",
  "свадебный фотограф в Твери",
  "свадебная фотосессия Тверь",
  "семейный фотограф Тверь",
  "семейная фотосессия Тверь",
  "индивидуальная фотосессия Тверь",
  "портретный фотограф Тверь",
  "фотограф на свадьбу Тверь",
  "репортажный фотограф Тверь",
  "фотограф Тверская область",
  "заказать фотосессию Тверь",
  "цены на фотосессию Тверь",
  "Елизавета Акимова фотограф",
  "Lizok Photos",
].join(", ");

export type PageSeoProps = {
  title: string;
  description: string;
  keywords?: string;
  path: string;
  ogImageUrl?: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
};

export const toAbsoluteUrl = (pathOrUrl = "/"): string => {
  if (!pathOrUrl) return SITE_ORIGIN;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_ORIGIN}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
};

export const createOgImage = (
  url: string,
  alt = PHOTOGRAPHER.brand,
): Image => ({
  id: 0,
  name: "og",
  alternativeText: alt,
  caption: null,
  width: 1200,
  height: 630,
  hash: "og",
  ext: ".webp",
  mime: "image/webp",
  size: 0,
  url: toAbsoluteUrl(url),
  provider: "local",
});

export const stringifyStructuredData = (
  data: Record<string, unknown> | Record<string, unknown>[],
): string => JSON.stringify(data);

export const buildPageSeo = ({
  title,
  description,
  keywords = DEFAULT_KEYWORDS,
  path: _path,
  ogImageUrl = "/og.webp",
  structuredData,
}: PageSeoProps): Seo => ({
  title,
  description,
  keywords,
  theme: "#2A2E1F",
  ogImage: createOgImage(ogImageUrl),
  structuredData: structuredData
    ? stringifyStructuredData(structuredData)
    : undefined,
});

export const breadcrumbList = (
  items: { name: string; path: string }[],
): Record<string, unknown> => ({
  "@type": "BreadcrumbList",
  "@id": `${SITE_ORIGIN}${items.at(-1)?.path ?? "/"}#breadcrumb`,
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: toAbsoluteUrl(item.path),
  })),
});
