"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { PHOTOGRAPHER } from "@/shared/seo";
import { HOME_CONTENT, SOCIAL_LINKS } from "@/shared/stub/home";
import { projectTypes } from "@/shared/stub/projects";
import { Link } from "@/shared/ui/link";
import { Body } from "@/shared/ui/typography/body";

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
            Фотограф в {PHOTOGRAPHER.city}. {HOME_CONTENT.hero.text}
          </Body>
        </div>

        <nav className={s.nav} aria-label="Навигация в подвале">
          <p className={s.navTitle}>Разделы</p>
          <Link href="/" className={s.link}>
            Главная
          </Link>
          <Link href="/portfolio" className={s.link}>
            Портфолио
          </Link>
          <Link href="/price" className={s.link}>
            Стоимость
          </Link>
          <Link href="/contacts" className={s.link}>
            Контакты
          </Link>
        </nav>

        <nav className={s.nav} aria-label="Типы съёмок">
          <p className={s.navTitle}>Съёмки</p>
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

        <nav className={s.nav} aria-label="Соцсети">
          <p className={s.navTitle}>Связь</p>
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
