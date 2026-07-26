"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { HOME_CONTENT } from "@/shared/stub/home";
import { Body } from "@/shared/ui/typography/body";
import { Heading } from "@/shared/ui/typography/heading";

import s from "./about-section.module.scss";

export type AboutSectionProps = ComponentProps<"section"> & {
  className?: string;
  title?: string;
  text?: string;
};

export const AboutSection = (props: AboutSectionProps) => {
  const {
    className,
    title = HOME_CONTENT.about.title,
    text = HOME_CONTENT.about.text,
    ...restProps
  } = props;

  return (
    <section className={clsx(s.root, className)} {...restProps}>
      <Heading level="2" tag="h2" className={s.title}>
        {title}
      </Heading>
      <Body size="primary" tag="p" className={s.text}>
        {text}
      </Body>
    </section>
  );
};

AboutSection.displayName = "AboutSection";
