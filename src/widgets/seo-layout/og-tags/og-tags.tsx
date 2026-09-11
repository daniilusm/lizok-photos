import Head from "next/head";
import { useRouter } from "next/router";

import { APP_INFO } from "@shared/config";
import { PHOTOGRAPHER, toAbsoluteUrl } from "@/shared/seo";

import type { SeoLayoutDataType } from "../type";
import { mergeSeoData } from "./utils";

export const OgTags = (props: SeoLayoutDataType) => {
  const { asPath } = useRouter();
  const pathOnly = asPath.split("?")[0] || "/";
  const canonicalUrl = toAbsoluteUrl(pathOnly);

  const { title, description, keywords, ogImage, theme } = mergeSeoData(props);
  const absoluteOgImage = toAbsoluteUrl(ogImage);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={PHOTOGRAPHER.name} />
      <meta name="creator" content={PHOTOGRAPHER.name} />
      <meta name="publisher" content={PHOTOGRAPHER.brand} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="googlebot" content="index, follow, max-image-preview:large" />
      <meta name="yandex" content="index, follow" />
      <meta name="yandex-verification" content="5f7290056ff63009" />
      <meta name="theme-color" content={theme} />
      <meta name="color-scheme" content="light" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="geo.region" content="RU-TVE" />
      <meta name="geo.placename" content={PHOTOGRAPHER.city} />
      <meta name="language" content="Russian" />
      <meta httpEquiv="content-language" content="ru" />

      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:site_name" content={PHOTOGRAPHER.brand} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={absoluteOgImage} />
      <meta property="og:image:secure_url" content={absoluteOgImage} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content={APP_INFO.APP_DOMAIN || ""} />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteOgImage} />
      <meta name="twitter:image:alt" content={title} />

      <link rel="canonical" content={canonicalUrl} />
      <link rel="alternate" hrefLang="ru" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
    </Head>
  );
};

OgTags.displayName = "OgTags";
