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
import { useEffect } from "react";

import { FontsProvider } from "@/shared/fonts";
import { commonSeo } from "@/shared/seo";
import { CookieConsent } from "@/widgets/cookie-consent";
import { Footer } from "@/widgets/footer";

export default function App({ Component, pageProps, router }: AppProps) {
  useAppViewport();

  const isNotFound =
    router.pathname === "/404" || router.pathname === "/not-found";

  // Client-side transitions to missing pages can show Next's default 404.
  // Force a full load of the custom page instead.
  useEffect(() => {
    const onError = (err: Error) => {
      const message = err?.message ?? "";
      if (
        message.includes("Failed to fetch") ||
        message.includes("Loading chunk") ||
        message.includes("404")
      ) {
        window.location.replace("/not-found/");
      }
    };

    router.events.on("routeChangeError", onError);
    return () => {
      router.events.off("routeChangeError", onError);
    };
  }, [router.events]);

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
            {!isNotFound && <Preloader />}
            <Scroll root wrapper>
              <TransitionLayout router={router}>
                <DataStoreProvider data={pageProps.cms ?? {}}>
                  <Component {...pageProps} />
                  {!isNotFound && <Footer />}
                </DataStoreProvider>
              </TransitionLayout>
            </Scroll>
            <CookieConsent />
          </DataStoreProvider>
        </ResizeProvider>
        <AppHooks />
      </SeoLayout>
    </FontsProvider>
  );
}
