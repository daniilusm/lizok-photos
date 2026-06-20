import { Head, Html, Main, NextScript } from "next/document";

import { pressStart2P } from "@/shared/fonts";

export default function Document() {
  return (
    <Html
      lang="ru"
      className={`${pressStart2P.variable} ${pressStart2P.className}`}
    >
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
