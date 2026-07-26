"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { HOME_CONTENT } from "@/shared/stub/home";
import { SplitTextAnimateInView } from "@/shared/ui/animate";
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
      <SplitTextAnimateInView>
        <Heading level="2" tag="h2" className={s.title}>
          {title}
        </Heading>
      </SplitTextAnimateInView>
      <SplitTextAnimateInView>
        <Body size="primary" tag="p" className={s.text}>
          {text}
        </Body>
      </SplitTextAnimateInView>
    </section>
  );
};

AboutSection.displayName = "AboutSection";
