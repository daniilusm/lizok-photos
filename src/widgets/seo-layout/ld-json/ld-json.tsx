import Head from "next/head";

import type { SeoLayoutDataType } from "../type";

const serializeStructuredData = (data: string | undefined) => {
  if (!data) {
    return null;
  }

  if (typeof data === "string") {
    const trimmed = data.trim();
    return trimmed.length ? trimmed : null;
  }

  try {
    return JSON.stringify(data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      "Unable to serialize structured data for SEO component:",
      error,
    );
    return null;
  }
};

export const LdJson = ({ pageSeoData, commonSeoData }: SeoLayoutDataType) => {
  const blocks = [
    serializeStructuredData(commonSeoData?.structuredData),
    serializeStructuredData(pageSeoData?.structuredData),
  ].filter(Boolean);

  if (!blocks.length) return null;

  return (
    <Head>
      {blocks.map((structuredData, index) => (
        <script
          // eslint-disable-next-line react/no-array-index-key
          key={`ld-json-${index}`}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: structuredData as string }}
        />
      ))}
    </Head>
  );
};
