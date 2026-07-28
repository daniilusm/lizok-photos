"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { HOME_CONTENT } from "@/shared/stub/home";
import { Image } from "@/shared/ui/image";
import { ParallaxScrollContainer } from "@/shared/ui/parallax-scroll-container";
import { Body } from "@/shared/ui/typography/body";
import { Heading } from "@/shared/ui/typography/heading";

import s from "./hero-section.module.scss";

export type HeroSectionProps = ComponentProps<"section"> & {
  className?: string;
  title?: string;
  text?: string;
  imageSrc?: string;
};

export const HeroSection = (props: HeroSectionProps) => {
  const {
    className,
    title = HOME_CONTENT.hero.title,
    text = HOME_CONTENT.hero.text,
    imageSrc = HOME_CONTENT.hero.image ?? "",
    ...restProps
  } = props;

  return (
    <section className={clsx(s.root, className)} {...restProps}>
      <ParallaxScrollContainer className={s.parallax} end="bottom top">
        <div className={s.media}>
          {imageSrc && (
            <Image
              className={s.image}
              src={imageSrc}
              alt={`${title} — фотограф в Твери`}
              height="100%"
              objectFit="cover"
              loading="eager"
              sizes="100vw"
              fetchPriority="high"
              preloaded
            />
          )}
        </div>

        <div className={s.content}>
          <Heading level="1" tag="h1" className={s.title}>
            {title}
          </Heading>
          <Body size="primary" tag="p" className={s.text}>
            {text}
          </Body>
        </div>
      </ParallaxScrollContainer>
    </section>
  );
};

HeroSection.displayName = "HeroSection";
