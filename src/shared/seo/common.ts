import type { Seo } from "@/shared/types/strapi-components/widgets";

import {
  createOgImage,
  DEFAULT_KEYWORDS,
  PHOTOGRAPHER,
  SITE_ORIGIN,
  stringifyStructuredData,
  toAbsoluteUrl,
} from "./constants";

export const commonSeo: Seo = {
  title: `${PHOTOGRAPHER.brand} — фотограф ${PHOTOGRAPHER.city}`,
  description: `${PHOTOGRAPHER.name} — ${PHOTOGRAPHER.jobTitle.toLowerCase()} в ${PHOTOGRAPHER.city}. Портретная, семейная, индивидуальная и репортажная съёмка. Портфолио ${PHOTOGRAPHER.brand}.`,
  keywords: DEFAULT_KEYWORDS,
  theme: "#2A2E1F",
  ogImage: createOgImage(toAbsoluteUrl("/og-1200x630.jpg"), PHOTOGRAPHER.brand),
  structuredData: stringifyStructuredData({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        url: `${SITE_ORIGIN}/`,
        name: PHOTOGRAPHER.brand,
        description: `${PHOTOGRAPHER.name} — фотограф в ${PHOTOGRAPHER.city}`,
        inLanguage: "ru-RU",
        publisher: { "@id": `${SITE_ORIGIN}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_ORIGIN}/#person`,
        name: PHOTOGRAPHER.name,
        url: SITE_ORIGIN,
        jobTitle: PHOTOGRAPHER.jobTitle,
        image: toAbsoluteUrl("/og-1200x630.jpg"),
        sameAs: [...PHOTOGRAPHER.sameAs],
        address: {
          "@type": "PostalAddress",
          addressLocality: PHOTOGRAPHER.city,
          addressRegion: PHOTOGRAPHER.region,
          addressCountry: "RU",
        },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_ORIGIN}/#service`,
        name: PHOTOGRAPHER.brand,
        image: toAbsoluteUrl("/og-1200x630.jpg"),
        url: SITE_ORIGIN,
        priceRange: "₽₽",
        description: `Фотограф в ${PHOTOGRAPHER.city}: индивидуальные, семейные съёмки и мероприятия.`,
        areaServed: [
          {
            "@type": "City",
            name: PHOTOGRAPHER.city,
          },
          {
            "@type": "AdministrativeArea",
            name: PHOTOGRAPHER.region,
          },
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: PHOTOGRAPHER.city,
          addressRegion: PHOTOGRAPHER.region,
          addressCountry: "RU",
        },
        founder: { "@id": `${SITE_ORIGIN}/#person` },
        sameAs: [...PHOTOGRAPHER.sameAs],
        serviceType: [
          "Индивидуальная фотосессия",
          "Семейная фотосессия",
          "Съёмка мероприятий",
          "Портретная съёмка",
        ],
      },
    ],
  }),
};
