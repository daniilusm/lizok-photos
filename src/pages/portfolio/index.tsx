import type { GetStaticProps } from "next";

import { PortfolioPage } from "@/_pages/portfolio/ui";
import { portfolioSeo, withCmsSeo } from "@/shared/seo";

const Page = () => {
  return <PortfolioPage />;
};

export const getStaticProps: GetStaticProps = async () => ({
  props: withCmsSeo(portfolioSeo),
});

export default Page;
