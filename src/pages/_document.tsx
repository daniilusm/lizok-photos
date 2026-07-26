import { Head, Html, Main, NextScript } from "next/document";

import { andika } from "@/shared/fonts";

export default function Document() {
  return (
    <Html lang="ru" className={`${andika.variable} ${andika.className}`}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
