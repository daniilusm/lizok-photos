"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { HOME_CONTENT } from "@/shared/stub/home";
import { Link } from "@/shared/ui/link";
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

      <div className={s.actions}>
        <Link href="/portfolio" className={s.link}>
          Смотреть портфолио
        </Link>
        <Link href="/price" className={s.link}>
          Стоимость фотосессии
        </Link>
        <Link href="/contacts" className={s.link}>
          Заказать съёмку
        </Link>
      </div>

      <Heading level="2" tag="h2" className={s.faqTitle}>
        {faq.title}
      </Heading>
      <div className={s.faqList}>
        {faq.items.map((item) => (
          <div key={item.question} className={s.faqItem}>
            <Heading level="3" tag="h3" className={s.faqQuestion}>
              {item.question}
            </Heading>
            <Body size="primary" tag="p" className={s.faqAnswer}>
              {item.answer}
            </Body>
          </div>
        ))}
      </div>
    </section>
  );
};

LocalSeoSection.displayName = "LocalSeoSection";
