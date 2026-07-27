"use client";

import { type ComponentProps, useCallback, useState } from "react";
import clsx from "clsx";

import { Button } from "@shared/ui/button";
import { HOME_CONTENT, SOCIAL_LINKS } from "@/shared/stub/home";
import { Icon } from "@/shared/ui/icon";
import { Image } from "@/shared/ui/image";
import { Link } from "@/shared/ui/link";
import { Portal } from "@/shared/ui/portal";

import { usePreloaderStore } from "../preloader/model/preloaderStore";

import s from "./header.module.scss";

export type HeaderProps = ComponentProps<"div"> & {
  className?: string;
};

export const Header = (props: HeaderProps) => {
  const { className } = props;

  const [isOpen, setOpen] = useState<boolean>(false);

  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const { isFinishEndAnimation } = usePreloaderStore();

  return (
    <>
      <div
        className={clsx(s.root, className, {
          [s.viewHeader]: isFinishEndAnimation,
        })}
      >
        <Link variant="underline" className={s.link} href="/">
          главная
        </Link>
        <Link
          variant="underline"
          className={clsx(s.link, s.hideM)}
          href="/portfolio"
        >
          портфолио
        </Link>
        <Link
          variant="underline"
          className={clsx(s.link, s.hideM)}
          href="/price"
        >
          стоимость
        </Link>
        <Link
          variant="underline"
          className={clsx(s.link, s.hideM)}
          href="/contacts"
        >
          контакты
        </Link>
        <Button className={s.menuButton} onClick={toggleOpen}>
          Меню
        </Button>
      </div>
      <Portal
        id="contact-popup"
        className={clsx(s.contactPopup, { [s.openPopup]: isOpen })}
      >
        <Button onClick={handleClose} className={s.crossBtn}>
          <Icon name="close" size="s" />
        </Button>
        <div className={s.wrapper}>
          <div className={s.links}>
            <Link variant="underline" className={s.link} href="/portfolio">
              портфолио
            </Link>
            <Link variant="underline" className={s.link} href="/price">
              стоимость
            </Link>
            <Link variant="underline" className={s.link} href="/contacts">
              контакты
            </Link>
          </div>
          <div className={s.media}>
            <Image
              className={s.image}
              src={HOME_CONTENT.contacts.image}
              alt="Елизавета Акимова — фотограф"
              height="100%"
              objectFit="cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              loading="lazy"
            />
          </div>
          <div className={s.social}>
            <div className={s.socialLinks}>
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
            </div>
            <p className={s.alertText}>
              *Компания Meta, продукты которой, включая социальные сети Facebook
              и Instagram, признаны экстремистскими организациями и запрещены на
              территории Рф
            </p>
          </div>
        </div>
      </Portal>
    </>
  );
};

Header.displayName = "Header";
