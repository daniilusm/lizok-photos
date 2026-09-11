import type { Seo } from "@/shared/types/strapi-components/widgets";
import { typografDeep, typografText } from "@/shared/utils/typograf";

import {
  createOgImage,
  DEFAULT_KEYWORDS,
  PHOTOGRAPHER,
  SITE_ORIGIN,
  stringifyStructuredData,
  toAbsoluteUrl,
} from "./constants";

const SERVICE_TYPES = [
  "Фотограф в Твери",
  "Фотосессии в Твери",
  "Свадебный фотограф",
  "Свадебная фотосессия",
  "Индивидуальная фотосессия",
  "Семейная фотосессия",
  "Портретная съёмка",
  "Репортажная съёмка",
  "Съёмка мероприятий",
].map(typografText);

export const commonSeo: Seo = {
  title: typografText(
    `Фотограф Тверь — ${PHOTOGRAPHER.name} | фотосессии и свадьбы`,
  ),
  description: typografText(
    `Фотограф в Твери ${PHOTOGRAPHER.name}: фотосессии, свадебная, семейная и индивидуальная съёмка. Живые кадры, кинематографичная обработка. ${PHOTOGRAPHER.city} и ${PHOTOGRAPHER.region}.`,
  ),
  keywords: DEFAULT_KEYWORDS,
  theme: "#2A2E1F",
  ogImage: createOgImage(toAbsoluteUrl("/og-1200x630.jpg"), PHOTOGRAPHER.brand),
  structuredData: stringifyStructuredData(
    typografDeep({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${SITE_ORIGIN}/#website`,
          url: `${SITE_ORIGIN}/`,
          name: PHOTOGRAPHER.brand,
          alternateName: [
            `${PHOTOGRAPHER.name} — фотограф Тверь`,
            `Фотограф в Твери ${PHOTOGRAPHER.name}`,
          ],
          description: `Фотограф в ${PHOTOGRAPHER.city}: фотосессии, свадебная и семейная съёмка`,
          inLanguage: "ru-RU",
          publisher: { "@id": `${SITE_ORIGIN}/#person` },
        },
        {
          "@type": ["Person", "Photographer"],
          "@id": `${SITE_ORIGIN}/#person`,
          name: PHOTOGRAPHER.name,
          alternateName: ["Lizok", PHOTOGRAPHER.brand],
          url: SITE_ORIGIN,
          jobTitle: `Фотограф в ${PHOTOGRAPHER.city}`,
          description: `Фотограф в ${PHOTOGRAPHER.city} и ${PHOTOGRAPHER.region}: индивидуальные, семейные, свадебные и репортажные съёмки.`,
          image: toAbsoluteUrl("/og-1200x630.jpg"),
          sameAs: [...PHOTOGRAPHER.sameAs],
          knowsAbout: [...SERVICE_TYPES],
          address: {
            "@type": "PostalAddress",
            addressLocality: PHOTOGRAPHER.city,
            addressRegion: PHOTOGRAPHER.region,
            addressCountry: "RU",
          },
          worksFor: { "@id": `${SITE_ORIGIN}/#localbusiness` },
        },
        {
          "@type": ["ProfessionalService", "LocalBusiness", "Photographer"],
          "@id": `${SITE_ORIGIN}/#localbusiness`,
          name: `${PHOTOGRAPHER.brand} — фотограф в ${PHOTOGRAPHER.city}`,
          alternateName: [
            `Фотограф Тверь ${PHOTOGRAPHER.name}`,
            `Свадебный фотограф Тверь`,
          ],
          image: toAbsoluteUrl("/og-1200x630.jpg"),
          url: SITE_ORIGIN,
          priceRange: "₽₽",
          currenciesAccepted: "RUB",
          paymentAccepted: "Cash, Bank Transfer",
          description: `Фотосессии в Твери: свадебный, семейный и индивидуальный фотограф. Съёмка в городе и ${PHOTOGRAPHER.region}.`,
          areaServed: [
            { "@type": "City", name: PHOTOGRAPHER.city },
            { "@type": "AdministrativeArea", name: PHOTOGRAPHER.region },
          ],
          address: {
            "@type": "PostalAddress",
            addressLocality: PHOTOGRAPHER.city,
            addressRegion: PHOTOGRAPHER.region,
            addressCountry: "RU",
          },
          founder: { "@id": `${SITE_ORIGIN}/#person` },
          employee: { "@id": `${SITE_ORIGIN}/#person` },
          sameAs: [...PHOTOGRAPHER.sameAs],
          serviceType: [...SERVICE_TYPES],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `Фотосессии в ${PHOTOGRAPHER.city}`,
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Индивидуальная фотосессия в Твери",
                  areaServed: PHOTOGRAPHER.city,
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Семейная фотосессия в Твери",
                  areaServed: PHOTOGRAPHER.city,
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Свадебный фотограф в Твери",
                  areaServed: PHOTOGRAPHER.city,
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Репортажная съёмка мероприятий в Твери",
                  areaServed: PHOTOGRAPHER.city,
                },
              },
            ],
          },
        },
        // backward-compatible id used across page schemas
        {
          "@type": "ProfessionalService",
          "@id": `${SITE_ORIGIN}/#service`,
          name: PHOTOGRAPHER.brand,
          url: SITE_ORIGIN,
          provider: { "@id": `${SITE_ORIGIN}/#localbusiness` },
        },
      ],
    }),
  ),
};
