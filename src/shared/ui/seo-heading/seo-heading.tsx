import type { ComponentProps, ReactNode } from "react";
import clsx from "clsx";

import { typografText } from "@/shared/utils/typograf";

import s from "./seo-heading.module.scss";

export type SeoHeadingProps = {
  className?: string;
  level?: 1 | 2 | 3;
  children: ReactNode;
} & Omit<ComponentProps<"h1">, "className" | "children">;

export const SeoHeading = (props: SeoHeadingProps) => {
  const { className, level = 2, children, ...rest } = props;
  const Tag = `h${level}` as "h1" | "h2" | "h3";

  return (
    <Tag className={clsx(s.root, className)} {...rest}>
      {typeof children === "string" ? typografText(children) : children}
    </Tag>
  );
};

SeoHeading.displayName = "SeoHeading";
