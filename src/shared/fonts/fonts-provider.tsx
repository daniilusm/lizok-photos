import type { PropsWithChildren } from "react";

import { andika } from "./andika";

import s from "./fonts-provider.module.scss";

export const FontsProvider = ({ children }: PropsWithChildren) => {
  return (
    <div className={`${andika.variable} ${andika.className} ${s.root}`}>
      {children}
    </div>
  );
};
