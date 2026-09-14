import type { PropsWithChildren } from "react";

import { andika } from "./andika";
import { greatVibes } from "./great-vibes";

import s from "./fonts-provider.module.scss";

/**
 * next/font CSS (@font-face + CSS variables) попадает в бандл только если
 * font.variable / className реально используются в _app-дереве.
 * Одного _document недостаточно при output: "export".
 */
export const FontsProvider = ({ children }: PropsWithChildren) => {
  return (
    <div
      className={`${andika.variable} ${greatVibes.variable} ${andika.className} ${s.root}`}
    >
      {children}
    </div>
  );
};
