"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { HOME_CONTENT, META_DISCLAIMER, SOCIAL_LINKS } from "@/shared/stub/home";
import { Image } from "@/shared/ui/image";
import { Link } from "@/shared/ui/link";
import { ParallaxScrollContainer } from "@/shared/ui/parallax-scroll-container";
import { Body } from "@/shared/ui/typography/body";
import { Heading } from "@/shared/ui/typography/heading";
import { typografText } from "@/shared/utils/typograf";

import s from "./contacts-section.module.scss";

export type ContactsSectionProps = ComponentProps<"section"> & {
  className?: string;
  title?: string;
  text?: string;
  imageSrc?: string;
  isPage?: boolean;
};

export const ContactsSection = (props: ContactsSectionProps) => {
  const {
    className,
    title = HOME_CONTENT.contacts.title,
    text = HOME_CONTENT.contacts.text,
    imageSrc = HOME_CONTENT.contacts.image ?? "",
    isPage,
    ...restProps
  } = props;

  return (
    <section className={clsx(s.root, className)} {...restProps}>
      <div className={s.media}>
        {imageSrc && (
          <ParallaxScrollContainer
            className={s.imageWrapper}
            start="top bottom"
            end="bottom top"
          >
            <Image
              className={s.image}
              src={imageSrc}
              alt={typografText("Елизавета Акимова — фотограф в Твери")}
              height="100%"
              objectFit="cover"
              imageRole="card"
              sizes="(min-width: 1024px) 50vw, 100vw"
              loading="lazy"
            />
          </ParallaxScrollContainer>
        )}
      </div>

      <div className={s.content}>
        <Heading level="2" tag={isPage ? "h1" : "h2"} className={s.title}>
          {title}
        </Heading>
        <Body size="primary" tag="p" className={s.text}>
          {text}
        </Body>

        <nav className={s.social} aria-label={typografText("Соцсети")}>
          {SOCIAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              className={s.link}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className={s.alertText}>{META_DISCLAIMER}</p>
      </div>
    </section>
  );
};

ContactsSection.displayName = "ContactsSection";
