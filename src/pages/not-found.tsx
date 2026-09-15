import type { GetStaticProps } from "next";

import { NotFoundPage } from "@/_pages/not-found/ui";
import { notFoundSeo, withCmsSeo } from "@/shared/seo";

const Page = () => {
  return <NotFoundPage />;
};

export const getStaticProps: GetStaticProps = async () => ({
  props: withCmsSeo(notFoundSeo),
});

export default Page;
