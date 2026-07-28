import type { ReactNode } from "react";
import Head from "next/head";

import { PHOTOGRAPHER, SITE_ORIGIN } from "@/shared/seo";

import { Favicons } from "./favicons";
import { LdJson } from "./ld-json";
import { OgTags } from "./og-tags/og-tags";
import type { SeoLayoutDataType } from "./type";

export type SeoLayoutProps = SeoLayoutDataType & {
  children?: ReactNode;
};

export const SeoLayout = ({
  commonSeoData,
  pageSeoData,
  children,
}: SeoLayoutProps) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta name="application-name" content={PHOTOGRAPHER.brand} />
        <meta
          name="apple-mobile-web-app-title"
          content={PHOTOGRAPHER.shortBrand}
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link
          rel="sitemap"
          type="application/xml"
          href={`${SITE_ORIGIN}/sitemap.xml`}
        />
        <link rel="author" href="/humans.txt" />
      </Head>
      <OgTags commonSeoData={commonSeoData} pageSeoData={pageSeoData} />
      <Favicons />
      <LdJson commonSeoData={commonSeoData} pageSeoData={pageSeoData} />

      {children}
    </>
  );
};
