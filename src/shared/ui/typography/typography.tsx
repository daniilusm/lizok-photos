import type { ComponentProps, ReactNode } from "react";
import clsx from "clsx";

import { mod } from "@shared/utils";
import type { ComponentOrTag, DynamicProps } from "@/shared/types";
import { SplitTextAnimateInView } from "@/shared/ui/animate";
import { typografText } from "@/shared/utils/typograf";

import styles from "./typography.module.scss";

export type TypographyProps<
  Element extends ComponentOrTag<ComponentProps<Element>>,
> = DynamicProps<Element> & {
  weight?: "regular" | "medium" | "semiBold" | "bold" | "extraBold";
  color?: "primary" | "secondary" | "inherit";
  /** Анимация появления текста. По умолчанию включена для строк. */
  animate?: boolean;
  splitType?: "char" | "word";
  splitStagger?: number;
  splitDuration?: number;
  splitDelay?: number;
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
    animate = true,
    splitType = "word",
    splitStagger,
    splitDuration,
    splitDelay,
    ...restProps
  } = props as TypographyProps<"span">;

  const mods = mod(styles, {
    weight,
    color,
  });

  const content = typografChildren(children);
  const shouldAnimate = animate && typeof content === "string" && content.trim();

  return (
    <Component className={clsx(className, styles.root, mods)} {...restProps}>
      {shouldAnimate ? (
        <SplitTextAnimateInView
          type={splitType}
          stagger={splitStagger}
          duration={splitDuration}
          delay={splitDelay}
        >
          {content}
        </SplitTextAnimateInView>
      ) : (
        content
      )}
    </Component>
  );
};

Typography.displayName = "Typography";
