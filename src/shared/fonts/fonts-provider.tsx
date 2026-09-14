import type { PropsWithChildren } from "react";

import s from "./fonts-provider.module.scss";

/** CSS-переменные семейств уже на <Html> в _document — здесь только layout-обёртка */
export const FontsProvider = ({ children }: PropsWithChildren) => {
  return <div className={s.root}>{children}</div>;
};
