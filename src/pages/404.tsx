import type { GetStaticProps } from "next";
import Head from "next/head";

import { NotFoundPage } from "@/_pages/not-found/ui";
import { notFoundSeo, withCmsSeo } from "@/shared/seo";

const Page = () => {
  return (
    <>
      {/* If a host serves this HTML under a wrong URL, jump to the real route. */}
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var p=location.pathname;if(p!=="/404"&&p!=="/404/")location.replace("/404/");})();`,
          }}
        />
      </Head>
      <NotFoundPage />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => ({
  props: withCmsSeo(notFoundSeo),
});

export default Page;
