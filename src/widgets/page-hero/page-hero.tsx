"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { Image } from "@/shared/ui/image";
import { Body } from "@/shared/ui/typography/body";
import { Heading } from "@/shared/ui/typography/heading";

import s from "./page-hero.module.scss";

export type PageHeroProps = ComponentProps<"section"> & {
  className?: string;
  title: string;
  text?: string;
  imageSrc: string;
};

export const PageHero = (props: PageHeroProps) => {
  const { className, title, text, imageSrc, ...restProps } = props;

  return (
    <section className={clsx(s.root, className)} {...restProps}>
      <div className={s.media} aria-hidden>
        <Image
          className={s.image}
          src={imageSrc}
          alt=""
          height="100%"
          objectFit="cover"
          loading="eager"
          sizes="100vw"
        />
      </div>
      <div className={s.content}>
        <Heading level="1" tag="h1" className={s.title}>
          {title}
        </Heading>
        {text && (
          <Body size="primary" tag="p" className={s.text}>
            {text}
          </Body>
        )}
      </div>
    </section>
  );
};

PageHero.displayName = "PageHero";
