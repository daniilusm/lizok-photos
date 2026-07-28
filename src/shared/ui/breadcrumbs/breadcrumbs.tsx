"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { Link } from "@/shared/ui/link";

import s from "./breadcrumbs.module.scss";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type BreadcrumbsProps = ComponentProps<"nav"> & {
  className?: string;
  items: BreadcrumbItem[];
};

export const Breadcrumbs = (props: BreadcrumbsProps) => {
  const { className, items, ...rest } = props;

  if (!items.length) return null;

  return (
    <nav
      className={clsx(s.root, className)}
      aria-label="Хлебные крошки"
      {...rest}
    >
      <ol className={s.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className={s.item}>
              {item.href && !isLast ? (
                <Link href={item.href} className={s.link}>
                  {item.label}
                </Link>
              ) : (
                <span className={s.current} aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumbs.displayName = "Breadcrumbs";
