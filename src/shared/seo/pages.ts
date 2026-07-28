import { PRICE_CONTENT } from "@/shared/stub/price";
import type { Project, ProjectType } from "@/shared/stub/projects";
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

export const homeSeo: Seo = buildPageSeo({
  title: `${PHOTOGRAPHER.name} — фотограф в ${PHOTOGRAPHER.city}`,
  description: `${PHOTOGRAPHER.name} — фотограф в ${PHOTOGRAPHER.city} и ${PHOTOGRAPHER.region}. Индивидуальные, семейные и репортажные съёмки. Живые кадры, кинематографичная обработка, спокойная атмосфера.`,
  path: "/",
  keywords: DEFAULT_KEYWORDS,
  structuredData: {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_ORIGIN}/#homepage`,
    url: toAbsoluteUrl("/"),
    name: `${PHOTOGRAPHER.name} — фотограф`,
    about: { "@id": `${SITE_ORIGIN}/#person` },
    mainEntity: { "@id": `${SITE_ORIGIN}/#service` },
  },
});

export const portfolioSeo: Seo = buildPageSeo({
  title: `Портфолио фотографа — ${PHOTOGRAPHER.city}`,
  description: `Портфолио ${PHOTOGRAPHER.name}: индивидуальные, семейные съёмки и мероприятия в ${PHOTOGRAPHER.city}. Примеры работ и готовые проекты.`,
  path: "/portfolio",
  keywords: `${DEFAULT_KEYWORDS}, портфолио фотографа, примеры фотосессий`,
  structuredData: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${toAbsoluteUrl("/portfolio")}#page`,
        url: toAbsoluteUrl("/portfolio"),
        name: "Портфолио",
        isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
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
    name: item.name,
    description: `${item.duration}. ${item.photos}. ${item.includes.join(". ")}.`,
    url: toAbsoluteUrl("/price"),
    priceCurrency: "RUB",
    ...(minPrice
      ? {
          price: String(minPrice),
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: minPrice,
            priceCurrency: "RUB",
            valueAddedTaxIncluded: true,
          },
        }
      : {}),
    availability: "https://schema.org/InStock",
    seller: { "@id": `${SITE_ORIGIN}/#service` },
  };
});

export const priceSeo: Seo = buildPageSeo({
  title: `Стоимость фотосессии — ${PHOTOGRAPHER.city}`,
  description: `Цены на фотосессии в ${PHOTOGRAPHER.city}: быстрая, индивидуальная, семейная съёмка и мероприятия. Прозрачные пакеты от ${PHOTOGRAPHER.name}.`,
  path: "/price",
  keywords: `${DEFAULT_KEYWORDS}, цена фотосессии Тверь, стоимость фотосессии, пакеты фотосъёмки`,
  structuredData: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${toAbsoluteUrl("/price")}#page`,
        url: toAbsoluteUrl("/price"),
        name: "Стоимость",
        description: `Актуальные пакеты и цены на фотосъёмку в ${PHOTOGRAPHER.city}`,
      },
      breadcrumbList([
        { name: "Главная", path: "/" },
        { name: "Стоимость", path: "/price" },
      ]),
      {
        "@type": "ItemList",
        name: "Пакеты фотосессий",
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
  title: `Контакты фотографа — ${PHOTOGRAPHER.city}`,
  description: `Связаться с ${PHOTOGRAPHER.name}: Telegram, VK и Instagram. Обсудим съёмку в ${PHOTOGRAPHER.city} и области.`,
  path: "/contacts",
  keywords: `${DEFAULT_KEYWORDS}, контакты фотографа Тверь, заказать фотосессию`,
  structuredData: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${toAbsoluteUrl("/contacts")}#page`,
        url: toAbsoluteUrl("/contacts"),
        name: "Контакты",
        about: { "@id": `${SITE_ORIGIN}/#person` },
      },
      breadcrumbList([
        { name: "Главная", path: "/" },
        { name: "Контакты", path: "/contacts" },
      ]),
    ],
  },
});

export const getProjectTypeSeo = (projectType: ProjectType): Seo =>
  buildPageSeo({
    title: `${projectType.name} — портфолио | ${PHOTOGRAPHER.city}`,
    description: `${projectType.name} от фотографа ${PHOTOGRAPHER.name} в ${PHOTOGRAPHER.city}. Смотрите примеры съёмок и готовые проекты.`,
    path: `/portfolio/${projectType.slug}`,
    ogImageUrl: projectType.mainImage,
    keywords: `${DEFAULT_KEYWORDS}, ${projectType.name.toLowerCase()}, ${projectType.name.toLowerCase()} Тверь`,
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${toAbsoluteUrl(`/portfolio/${projectType.slug}`)}#page`,
          url: toAbsoluteUrl(`/portfolio/${projectType.slug}`),
          name: projectType.name,
          image: toAbsoluteUrl(projectType.mainImage),
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
    title: `${project.name} — ${typeName} | ${PHOTOGRAPHER.name}`,
    description: `Проект «${project.name}»: ${typeName.toLowerCase()} фотографа ${PHOTOGRAPHER.name}. Галерея съёмки.`,
    path: `/portfolio/${projectsType}/${project.slug}`,
    ogImageUrl: project.mainImage,
    keywords: `${DEFAULT_KEYWORDS}, ${project.name}, ${typeName.toLowerCase()}`,
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ImageGallery",
          "@id": `${toAbsoluteUrl(`/portfolio/${projectsType}/${project.slug}`)}#gallery`,
          url: toAbsoluteUrl(`/portfolio/${projectsType}/${project.slug}`),
          name: project.name,
          description: `${typeName}: ${project.name}`,
          image: toAbsoluteUrl(project.mainImage),
          author: { "@id": `${SITE_ORIGIN}/#person` },
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
