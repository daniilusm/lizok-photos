"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { HOME_CONTENT, SOCIAL_LINKS } from "@/shared/stub/home";
import { ClipRevealInView } from "@/shared/ui/animate";
import { Image } from "@/shared/ui/image";
import { Link } from "@/shared/ui/link";
import { Body } from "@/shared/ui/typography/body";
import { Heading } from "@/shared/ui/typography/heading";

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
          <ClipRevealInView duration={1} className={s.imageWrapper}>
            <Image
              className={s.image}
              src={imageSrc}
              alt="Елизавета Акимова — фотограф в Твери"
              height="100%"
              objectFit="cover"
              imageRole="card"
              sizes="(min-width: 1024px) 50vw, 100vw"
              loading="lazy"
            />
          </ClipRevealInView>
        )}
      </div>

      <div className={s.content}>
        <Heading level="2" tag={isPage ? "h1" : "h2"} className={s.title}>
          {title}
        </Heading>
        <Body size="primary" tag="p" className={s.text}>
          {text}
        </Body>

        <nav className={s.social} aria-label="Соцсети">
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
        <p className={s.alertText}>
          *Компания Meta, продукты которой, включая социальные сети Facebook и
          Instagram, признаны экстремистскими организациями и запрещены на
          территории Рф
        </p>
      </div>
    </section>
  );
};

ContactsSection.displayName = "ContactsSection";
