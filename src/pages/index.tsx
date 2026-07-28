import type { GetStaticProps } from "next";

import { HomePage } from "@/_pages/home/ui";
import { homeSeo, withCmsSeo } from "@/shared/seo";

const Page = () => {
  return <HomePage />;
};

export const getStaticProps: GetStaticProps = async () => ({
  props: withCmsSeo(homeSeo),
});

export default Page;
