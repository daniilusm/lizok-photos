"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { HOME_CONTENT, SOCIAL_LINKS } from "@/shared/stub/home";
import { SplitTextAnimateInView } from "@/shared/ui/animate";
import { Button } from "@/shared/ui/button";
import { Image } from "@/shared/ui/image";
import { Body } from "@/shared/ui/typography/body";
import { Heading } from "@/shared/ui/typography/heading";

import s from "./contacts-section.module.scss";

export type ContactsSectionProps = ComponentProps<"section"> & {
  className?: string;
  title?: string;
  text?: string;
  imageSrc?: string;
};

export const ContactsSection = (props: ContactsSectionProps) => {
  const {
    className,
    title = HOME_CONTENT.contacts.title,
    text = HOME_CONTENT.contacts.text,
    imageSrc = HOME_CONTENT.contacts.image ?? "",
    ...restProps
  } = props;

  return (
    <section className={clsx(s.root, className)} {...restProps}>
      <div className={s.media}>
        {imageSrc && (
          <Image
            className={s.image}
            src={imageSrc}
            alt="Елизавета Акимова — фотограф"
            height="100%"
            objectFit="cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
            loading="lazy"
          />
        )}
      </div>

      <div className={s.content}>
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

        <nav className={s.social} aria-label="Соцсети">
          {SOCIAL_LINKS.map((link) => (
            <Button
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={s.link}
            >
              <SplitTextAnimateInView>{link.label}</SplitTextAnimateInView>
            </Button>
          ))}
        </nav>
      </div>
    </section>
  );
};

ContactsSection.displayName = "ContactsSection";
