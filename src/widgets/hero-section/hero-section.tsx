"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { HERO_IMAGE_SIZES, HERO_IMAGE_SRCSET } from "@/shared/lib/hero-image";
import { HOME_CONTENT } from "@/shared/stub/home";
import { Image } from "@/shared/ui/image";
import { ParallaxScrollContainer } from "@/shared/ui/parallax-scroll-container";
import { Body } from "@/shared/ui/typography/body";
import { typografText } from "@/shared/utils/typograf";

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

  const isHomeHero =
    Boolean(imageSrc) &&
    (imageSrc.includes("/images/hero-") || imageSrc.includes("/images/hero."));

  return (
    <section className={clsx(s.root, className)} {...restProps}>
      <ParallaxScrollContainer className={s.parallax} end="bottom top">
        <div className={s.media}>
          {imageSrc && (
            <Image
              className={s.image}
              src={imageSrc}
              srcSet={isHomeHero ? HERO_IMAGE_SRCSET : undefined}
              alt={typografText(
                "Елизавета Акимова — фотограф в Твери, фотосессии и свадебная съёмка",
              )}
              height="100%"
              objectFit="cover"
              imageRole="hero"
              loading="eager"
              sizes={HERO_IMAGE_SIZES}
              fetchPriority="high"
              preloaded
            />
          )}
        </div>

        <div className={s.overlay} />

        <div className={s.content}>
          <h1 className={s.title}>{title}</h1>
          <Body size="primary" tag="p" className={s.text} animate={false}>
            {text}
          </Body>
        </div>

        <p className={s.scrollHint} aria-hidden>
          {typografText("Листайте вниз — там ещё интереснее")}
        </p>
      </ParallaxScrollContainer>
    </section>
  );
};

HeroSection.displayName = "HeroSection";
