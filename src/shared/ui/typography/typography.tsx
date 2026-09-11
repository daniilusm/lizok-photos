import type { ComponentProps, ReactNode } from "react";
import clsx from "clsx";

import { mod } from "@shared/utils";
import type { ComponentOrTag, DynamicProps } from "@/shared/types";
import { typografText } from "@/shared/utils/typograf";

import styles from "./typography.module.scss";

export type TypographyProps<
  Element extends ComponentOrTag<ComponentProps<Element>>,
> = DynamicProps<Element> & {
  weight?: "regular" | "medium" | "semiBold" | "bold" | "extraBold";
  color?: "primary" | "secondary" | "inherit";
};

const typografChildren = (children: ReactNode): ReactNode => {
  if (typeof children === "string") return typografText(children);
  return children;
};

export const Typography = <
  Element extends ComponentOrTag<ComponentProps<Element>>,
>(
  props: TypographyProps<Element>,
) => {
  const {
    children,
    className,
    tag: Component = "span",
    weight = "regular",
    color = "inherit",
    ...restProps
  } = props as TypographyProps<"span">;

  const mods = mod(styles, {
    weight,
    color,
  });

  return (
    <Component className={clsx(className, styles.root, mods)} {...restProps}>
      {typografChildren(children)}
    </Component>
  );
};

Typography.displayName = "Typography";
