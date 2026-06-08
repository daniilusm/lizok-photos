import type { PropsWithChildren } from "react";

import { pressStart2P } from "./press-start-2p";
import s from "./fonts-provider.module.scss";

export const FontsProvider = ({ children }: PropsWithChildren) => (
  <div
    className={`${pressStart2P.variable} ${pressStart2P.className} ${s.root}`}
  >
    {children}
  </div>
);
