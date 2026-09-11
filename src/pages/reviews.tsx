import type { GetStaticProps } from "next";

import { ReviewsPage } from "@/_pages/reviews-page/ui";
import { reviewsSeo, withCmsSeo } from "@/shared/seo";

const Page = () => {
  return <ReviewsPage />;
};

export const getStaticProps: GetStaticProps = async () => ({
  props: withCmsSeo(reviewsSeo),
});

export default Page;
