"use client";

import {
  type ComponentProps,
  type TransitionEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import clsx from "clsx";
import { useRouter } from "next/router";

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
  const router = useRouter();

  const [isOpen, setOpen] = useState(false);
  const [isClosing, setClosing] = useState(false);
  const [noTransition, setNoTransition] = useState(false);

  const handleClose = useCallback(() => {
    setOpen((prev) => {
      if (!prev) return prev;
      setClosing(true);
      return false;
    });
  }, []);

  const toggleOpen = useCallback(() => {
    setOpen((prev) => {
      if (prev) {
        setClosing(true);
        return false;
      }

      setClosing(false);
      setNoTransition(false);
      return true;
    });
  }, []);

  const handlePopupTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (event.propertyName !== "clip-path") return;
      if (!isClosing) return;

      setNoTransition(true);
      setClosing(false);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setNoTransition(false);
        });
      });
    },
    [isClosing],
  );

  useEffect(() => {
    const closeOnRouteChange = () => handleClose();

    router.events.on("routeChangeStart", closeOnRouteChange);

    return () => {
      router.events.off("routeChangeStart", closeOnRouteChange);
    };
  }, [router.events, handleClose]);

  const { isFinishEndAnimation } = usePreloaderStore();

  return (
    <>
      <div
        className={clsx(s.root, className, {
          [s.viewHeader]: isFinishEndAnimation,
        })}
      >
        <nav className={s.nav} aria-label="Основная навигация">
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
        </nav>
      </div>
      <Portal id="contact-popup">
        <div
          className={clsx(s.contactPopup, {
            [s.openPopup]: isOpen,
            [s.closingPopup]: isClosing,
            [s.noTransition]: noTransition,
          })}
          onTransitionEnd={handlePopupTransitionEnd}
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
                alt="Елизавета Акимова — фотограф в Твери"
                height="100%"
                objectFit="cover"
                imageRole="card"
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
                *Компания Meta, продукты которой, включая социальные сети
                Facebook и Instagram, признаны экстремистскими организациями и
                запрещены на территории Рф
              </p>
            </div>
          </div>
        </div>
      </Portal>
    </>
  );
};

Header.displayName = "Header";
