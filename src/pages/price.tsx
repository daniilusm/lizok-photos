import type { GetStaticProps } from "next";

import { PricePage } from "@/_pages/price/ui";
import { priceSeo, withCmsSeo } from "@/shared/seo";

const Page = () => {
  return <PricePage />;
};

export const getStaticProps: GetStaticProps = async () => ({
  props: withCmsSeo(priceSeo),
});

export default Page;
