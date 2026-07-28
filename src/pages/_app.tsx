import "@/shared/styles/globals.scss";

import { DataStoreProvider } from "@app/model/data-store";
import { useAppViewport } from "@app/model/viewport-store";
import { AppHooks } from "@widgets/app-hooks/app-hooks";
import { Gsap } from "@widgets/gsap";
import { Header } from "@widgets/header";
import { Preloader } from "@widgets/preloader";
import { ResizeProvider } from "@widgets/resize";
import { Scroll } from "@widgets/scroll";
import { SeoLayout } from "@widgets/seo-layout";
import { TransitionLayout } from "@widgets/transition-layout";
import type { AppProps } from "next/app";

import { FontsProvider } from "@/shared/fonts";
import { commonSeo } from "@/shared/seo";
import { Footer } from "@/widgets/footer";

export default function App({ Component, pageProps, router }: AppProps) {
  useAppViewport();

  return (
    <FontsProvider>
      <Gsap />
      <SeoLayout
        commonSeoData={pageProps?.cms?.commonData?.seo ?? commonSeo}
        pageSeoData={pageProps?.cms?.pageSeoData}
      >
        <ResizeProvider>
          <DataStoreProvider data={pageProps.cms ?? {}}>
            <Header />
            <Preloader />
            <Scroll root wrapper>
              <TransitionLayout router={router}>
                <DataStoreProvider data={pageProps.cms ?? {}}>
                  <Component {...pageProps} />
                  <Footer />
                </DataStoreProvider>
              </TransitionLayout>
            </Scroll>
          </DataStoreProvider>
        </ResizeProvider>
        <AppHooks />
      </SeoLayout>
    </FontsProvider>
  );
}
