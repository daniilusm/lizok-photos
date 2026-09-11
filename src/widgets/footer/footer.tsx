"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { PHOTOGRAPHER } from "@/shared/seo";
import { SOCIAL_LINKS } from "@/shared/stub/home";
import { projectTypes } from "@/shared/stub/projects";
import { Link } from "@/shared/ui/link";
import { Body } from "@/shared/ui/typography/body";
import { typografText } from "@/shared/utils/typograf";

import s from "./footer.module.scss";

export type FooterProps = ComponentProps<"footer"> & {
  className?: string;
};

export const Footer = (props: FooterProps) => {
  const { className, ...rest } = props;
  const year = new Date().getFullYear();

  return (
    <footer className={clsx(s.root, className)} {...rest}>
      <div className={s.grid}>
        <div className={s.brand}>
          <p className={s.title}>{PHOTOGRAPHER.name}</p>
          <Body size="primary" tag="p" className={s.text}>
            {typografText(
              `Фотограф в ${PHOTOGRAPHER.city}. Фотосессии, свадебная и семейная съёмка.`,
            )}
          </Body>
        </div>

        <nav className={s.nav} aria-label={typografText("Навигация в подвале")}>
          <p className={s.navTitle}>{typografText("Разделы")}</p>
          <Link href="/" className={s.link}>
            {typografText("Главная")}
          </Link>
          <Link href="/portfolio" className={s.link}>
            {typografText("Портфолио")}
          </Link>
          <Link href="/price" className={s.link}>
            {typografText("Стоимость")}
          </Link>
          <Link href="/reviews" className={s.link}>
            {typografText("Отзывы")}
          </Link>
          <Link href="/contacts" className={s.link}>
            {typografText("Контакты")}
          </Link>
        </nav>

        <nav className={s.nav} aria-label={typografText("Типы съёмок")}>
          <p className={s.navTitle}>{typografText("Съёмки")}</p>
          {projectTypes.map((type) => (
            <Link
              key={type.slug}
              href={`/portfolio/${type.slug}`}
              className={s.link}
            >
              {type.name}
            </Link>
          ))}
        </nav>

        <nav className={s.nav} aria-label={typografText("Соцсети")}>
          <p className={s.navTitle}>{typografText("Связь")}</p>
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
      </div>

      <p className={s.copy}>
        © {year} {PHOTOGRAPHER.brand}. {PHOTOGRAPHER.city}
      </p>
    </footer>
  );
};

Footer.displayName = "Footer";
