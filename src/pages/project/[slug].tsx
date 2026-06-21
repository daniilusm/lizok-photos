import type { GetStaticPaths, GetStaticProps } from "next";

import { InnerPage } from "@/_pages/inner-page/ui";

/**
 * DEPLOY: динамический роут без CMS.
 * Для static export нужен явный список slug — иначе страница не попадёт в сборку.
 * Добавьте slug сюда или подключите getStaticPaths из Strapi.
 */
// export const getStaticPaths: GetStaticPaths = async () => {
//   return {
//     paths: [{ params: { slug: "demo" } }],
//     fallback: false,
//   };
// };

// export const getStaticProps: GetStaticProps = async () => {
//   return { props: {} };
// };

const Page = () => {
  return <InnerPage />;
};

export default Page;
