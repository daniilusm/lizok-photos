import { HOME_CONTENT } from "@/shared/stub/home";
import { PRICE_CONTENT } from "@/shared/stub/price";
import type { Project, ProjectType } from "@/shared/stub/projects";
import { REVIEWS } from "@/shared/stub/reviews";
import type { Seo } from "@/shared/types/strapi-components/widgets";

import { commonSeo } from "./common";
import {
  breadcrumbList,
  buildPageSeo,
  DEFAULT_KEYWORDS,
  PHOTOGRAPHER,
  SITE_ORIGIN,
  toAbsoluteUrl,
} from "./constants";

export { commonSeo } from "./common";
export {
  DEFAULT_KEYWORDS,
  PHOTOGRAPHER,
  SITE_ORIGIN,
  toAbsoluteUrl,
} from "./constants";

const city = PHOTOGRAPHER.city;

export const homeSeo: Seo = buildPageSeo({
  title: `Фотограф ${city} — ${PHOTOGRAPHER.name} | фотосессии и свадьба`,
  description: `Фотограф в ${city} ${PHOTOGRAPHER.name}: фотосессии, свадебный фотограф, семейная и индивидуальная съёмка. Портфолио, цены и запись на съёмку в ${city} и области.`,
  path: "/",
  keywords: DEFAULT_KEYWORDS,
  structuredData: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_ORIGIN}/#homepage`,
        url: toAbsoluteUrl("/"),
        name: `Фотограф в ${city} — ${PHOTOGRAPHER.name}`,
        description: `Фотосессии в ${city}: индивидуальные, семейные, свадебные и репортажные съёмки.`,
        about: { "@id": `${SITE_ORIGIN}/#person` },
        mainEntity: { "@id": `${SITE_ORIGIN}/#localbusiness` },
        isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
        inLanguage: "ru-RU",
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_ORIGIN}/#home-faq`,
        mainEntity: HOME_CONTENT.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  },
});

export const portfolioSeo: Seo = buildPageSeo({
  title: `Портфолио фотографа ${city} — фотосессии и свадьбы`,
  description: `Портфолио фотографа в ${city}: индивидуальные и семейные фотосессии, свадебная и репортажная съёмка. Примеры работ ${PHOTOGRAPHER.name}.`,
  path: "/portfolio",
  keywords: `${DEFAULT_KEYWORDS}, портфолио фотографа Тверь, примеры фотосессий Тверь`,
  structuredData: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${toAbsoluteUrl("/portfolio")}#page`,
        url: toAbsoluteUrl("/portfolio"),
        name: `Портфолио фотографа — ${city}`,
        description: `Примеры фотосессий в ${city}`,
        isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
        about: { "@id": `${SITE_ORIGIN}/#localbusiness` },
      },
      breadcrumbList([
        { name: "Главная", path: "/" },
        { name: "Портфолио", path: "/portfolio" },
      ]),
    ],
  },
});

const priceOffers = PRICE_CONTENT.packages.items.map((item) => {
  const minPrice = item.price;

  return {
    "@type": "Offer",
    name: `${item.name} — фотосессия в ${city}`,
    description: `${item.duration}. ${item.photos}. ${item.includes.join(". ")}.`,
    url: toAbsoluteUrl("/price"),
    priceCurrency: "RUB",
    ...(minPrice
      ? {
          price: String(minPrice).replace(/[^\d]/g, "") || undefined,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: minPrice,
            priceCurrency: "RUB",
            valueAddedTaxIncluded: true,
          },
        }
      : {}),
    availability: "https://schema.org/InStock",
    areaServed: city,
    seller: { "@id": `${SITE_ORIGIN}/#localbusiness` },
  };
});

export const priceSeo: Seo = buildPageSeo({
  title: `Стоимость фотосессии ${city} — цены на съёмку`,
  description: `Цены на фотосессии в ${city}: индивидуальная, семейная съёмка и мероприятия. Прозрачные пакеты от фотографа ${PHOTOGRAPHER.name}. Свадебная съёмка — по запросу.`,
  path: "/price",
  keywords: `${DEFAULT_KEYWORDS}, цена фотосессии Тверь, стоимость фотосессии Тверь, сколько стоит фотосессия в Твери`,
  structuredData: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${toAbsoluteUrl("/price")}#page`,
        url: toAbsoluteUrl("/price"),
        name: `Стоимость фотосессии — ${city}`,
        description: `Актуальные пакеты и цены на фотосъёмку в ${city}`,
      },
      breadcrumbList([
        { name: "Главная", path: "/" },
        { name: "Стоимость", path: "/price" },
      ]),
      {
        "@type": "ItemList",
        name: `Пакеты фотосессий в ${city}`,
        itemListElement: priceOffers.map((offer, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: offer,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: PRICE_CONTENT.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  },
});

export const contactsSeo: Seo = buildPageSeo({
  title: `Контакты фотографа ${city} — заказать фотосессию`,
  description: `Связаться с фотографом в ${city} ${PHOTOGRAPHER.name}: Telegram, VK и Instagram. Заказать фотосессию или свадебную съёмку в ${city} и области.`,
  path: "/contacts",
  keywords: `${DEFAULT_KEYWORDS}, контакты фотографа Тверь, заказать фотосессию Тверь, записаться на фотосессию`,
  structuredData: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${toAbsoluteUrl("/contacts")}#page`,
        url: toAbsoluteUrl("/contacts"),
        name: `Контакты фотографа — ${city}`,
        about: { "@id": `${SITE_ORIGIN}/#person` },
        mainEntity: { "@id": `${SITE_ORIGIN}/#localbusiness` },
      },
      breadcrumbList([
        { name: "Главная", path: "/" },
        { name: "Контакты", path: "/contacts" },
      ]),
    ],
  },
});

export const reviewsSeo: Seo = buildPageSeo({
  title: `Отзывы о фотосессиях в ${city} — ${PHOTOGRAPHER.name}`,
  description: `Отзывы клиентов о фотосессиях в ${city}: индивидуальные, семейные съёмки и мероприятия. Реальные впечатления о работе фотографа ${PHOTOGRAPHER.name}.`,
  path: "/reviews",
  keywords: `${DEFAULT_KEYWORDS}, отзывы фотограф Тверь, отзывы о фотосессии`,
  structuredData: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${toAbsoluteUrl("/reviews")}#page`,
        url: toAbsoluteUrl("/reviews"),
        name: `Отзывы о фотосессиях — ${city}`,
        about: { "@id": `${SITE_ORIGIN}/#localbusiness` },
      },
      breadcrumbList([
        { name: "Главная", path: "/" },
        { name: "Отзывы", path: "/reviews" },
      ]),
      {
        "@type": "ItemList",
        name: `Отзывы о фотосессиях в ${city}`,
        itemListElement: REVIEWS.map((review, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: review.name,
            },
            reviewBody: review.text,
            itemReviewed: {
              "@type": "Service",
              name: review.type,
              provider: { "@id": `${SITE_ORIGIN}/#localbusiness` },
            },
          },
        })),
      },
    ],
  },
});

export const getProjectTypeSeo = (projectType: ProjectType): Seo =>
  buildPageSeo({
    title: `${projectType.name} в ${city} — портфолио фотографа`,
    description: `${projectType.name} в ${city} от фотографа ${PHOTOGRAPHER.name}. Смотрите примеры съёмок и готовые проекты.`,
    path: `/portfolio/${projectType.slug}`,
    ogImageUrl: projectType.mainImage,
    keywords: `${DEFAULT_KEYWORDS}, ${projectType.name.toLowerCase()}, ${projectType.name.toLowerCase()} Тверь, ${projectType.name.toLowerCase()} в Твери`,
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${toAbsoluteUrl(`/portfolio/${projectType.slug}`)}#page`,
          url: toAbsoluteUrl(`/portfolio/${projectType.slug}`),
          name: `${projectType.name} — ${city}`,
          image: toAbsoluteUrl(projectType.mainImage),
          about: { "@id": `${SITE_ORIGIN}/#localbusiness` },
        },
        breadcrumbList([
          { name: "Главная", path: "/" },
          { name: "Портфолио", path: "/portfolio" },
          {
            name: projectType.name,
            path: `/portfolio/${projectType.slug}`,
          },
        ]),
      ],
    },
  });

export const getProjectSeo = (
  project: Project,
  projectsType: string,
  typeName: string,
): Seo =>
  buildPageSeo({
    title: `${project.name} — ${typeName} в ${city} | ${PHOTOGRAPHER.name}`,
    description: `Проект «${project.name}»: ${typeName.toLowerCase()} фотографа ${PHOTOGRAPHER.name} в ${city}. Галерея съёмки.`,
    path: `/portfolio/${projectsType}/${project.slug}`,
    ogImageUrl: project.mainImage,
    keywords: `${DEFAULT_KEYWORDS}, ${project.name}, ${typeName.toLowerCase()} Тверь`,
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ImageGallery",
          "@id": `${toAbsoluteUrl(`/portfolio/${projectsType}/${project.slug}`)}#gallery`,
          url: toAbsoluteUrl(`/portfolio/${projectsType}/${project.slug}`),
          name: project.name,
          description: `${typeName} в ${city}: ${project.name}`,
          image: toAbsoluteUrl(project.mainImage),
          author: { "@id": `${SITE_ORIGIN}/#person` },
          contentLocation: {
            "@type": "City",
            name: city,
          },
        },
        breadcrumbList([
          { name: "Главная", path: "/" },
          { name: "Портфолио", path: "/portfolio" },
          {
            name: typeName,
            path: `/portfolio/${projectsType}`,
          },
          {
            name: project.name,
            path: `/portfolio/${projectsType}/${project.slug}`,
          },
        ]),
      ],
    },
  });

export const withCmsSeo = (pageSeoData: Seo) => ({
  cms: {
    commonData: {
      seo: commonSeo,
    },
    pageSeoData,
  },
});
