import type React from "react";
import clsx from "clsx";

import type { ElementSize } from "@shared/types";
import { Button } from "@shared/ui/button";
import { mod } from "@shared/utils";

import s from "./link.module.scss";

export type LinkProps = Pick<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "target" | "rel"
> & {
  className?: string;
  children: React.ReactNode;
  variant?: "underline" | "text" | "button";
  size?: ElementSize;
  href: string;
  disabled?: boolean;
};

export const Link = (props: LinkProps) => {
  const {
    className,
    href,
    children,
    variant = "underline",
    size = "s",
    disabled,
    target,
    rel,
  } = props;

  const mods = mod(s, {
    variant,
    size,
  });

  const resolvedRel =
    rel ?? (target === "_blank" ? "noopener noreferrer" : undefined);

  return (
    <Button
      disabled={disabled}
      className={clsx(s.root, className, mods)}
      href={href}
      target={target}
      rel={resolvedRel}
    >
      {children}
    </Button>
  );
};

Link.displayName = "Link";
