import type { PropsWithChildren } from "react";

import { andika } from "./andika";
import { greatVibes } from "./great-vibes";

import s from "./fonts-provider.module.scss";

export const FontsProvider = ({ children }: PropsWithChildren) => {
  return (
    <div
      className={`${andika.variable} ${greatVibes.variable} ${andika.className} ${s.root}`}
    >
      {children}
    </div>
  );
};
