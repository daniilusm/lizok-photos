"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { HOME_CONTENT } from "@/shared/stub/home";
import { Image } from "@/shared/ui/image";
import { ParallaxScrollContainer } from "@/shared/ui/parallax-scroll-container";
import { Body } from "@/shared/ui/typography/body";
import { Heading } from "@/shared/ui/typography/heading";

import s from "./local-seo-section.module.scss";

export type LocalSeoSectionProps = ComponentProps<"section"> & {
  className?: string;
};

export const LocalSeoSection = (props: LocalSeoSectionProps) => {
  const { className, ...restProps } = props;
  const { services, faq } = HOME_CONTENT;

  return (
    <section
      className={clsx(s.root, className)}
      aria-labelledby="local-seo-title"
      {...restProps}
    >
      <div className={s.section}>
        <ParallaxScrollContainer
          className={s.imageWrapper}
          start="top bottom"
          end="bottom top"
        >
          <Image
            height="100%"
            objectFit="cover"
            imageRole="card"
            sizes="(min-width: 768px) 50vw, 100vw"
            loading="lazy"
            alt="sec"
            src="https://res.cloudinary.com/fgedebup/image/upload/v1785262927/06_b2xyh2.webp"
          />
        </ParallaxScrollContainer>
        <div className={s.sectionContent}>
          <Heading level="2" tag="h2" id="local-seo-title" className={s.title}>
            {services.title}
          </Heading>
          <Body size="primary" tag="p" className={s.lead}>
            {services.lead}
          </Body>
          <ul className={s.list}>
            {services.items.map((item) => (
              <li key={item.title} className={s.item}>
                <Heading level="3" tag="h3" className={s.itemTitle}>
                  {item.title}
                </Heading>
                <Body size="primary" tag="p" className={s.itemText}>
                  {item.text}
                </Body>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={s.section}>
        <div className={s.sectionContent}>
          <Heading level="2" tag="h2" className={s.faqTitle}>
            {faq.title}
          </Heading>
          <div className={s.list}>
            {faq.items.map((item) => (
              <div key={item.question} className={s.item}>
                <Heading level="3" tag="h3" className={s.itemTitle}>
                  {item.question}
                </Heading>
                <Body size="primary" tag="p" className={s.itemText}>
                  {item.answer}
                </Body>
              </div>
            ))}
          </div>
        </div>

        <ParallaxScrollContainer
          className={s.imageWrapper}
          start="top bottom"
          end="bottom top"
        >
          <Image
            height="100%"
            objectFit="cover"
            imageRole="card"
            sizes="(min-width: 768px) 50vw, 100vw"
            loading="lazy"
            alt="sec"
            src="https://res.cloudinary.com/fgedebup/image/upload/v1785084918/IMG_6255_x5uiso.jpg"
          />
        </ParallaxScrollContainer>
      </div>
    </section>
  );
};

LocalSeoSection.displayName = "LocalSeoSection";
