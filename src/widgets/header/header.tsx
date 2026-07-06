"use client";

import { type ComponentProps, useCallback, useState } from "react";
import clsx from "clsx";

import { Button } from "@shared/ui/button";
import { pressStart2P } from "@/shared/fonts";
import { Icon } from "@/shared/ui/icon";
import { InteractiveParticles } from "@/shared/ui/interactive-particles";
import { Portal } from "@/shared/ui/portal";

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

  return (
    <>
      <div className={clsx(s.root, className)}>
        <Button className={s.link} href="/">
          главная
        </Button>
        <Button className={s.link} onClick={toggleOpen}>
          контакты
        </Button>
      </div>
      <Portal
        id="contact-popup"
        className={clsx(
          s.contactPopup,
          pressStart2P.variable,
          pressStart2P.className,
          { [s.openPopup]: isOpen },
        )}
      >
        <div>
          <Button onClick={handleClose} className={s.crossBtn}>
            <Icon name="close" size="s" />
          </Button>
          <div className={s.overlay} onClick={handleClose} />
          <div className={s.wrapper}>
            <div className={s.top}>
              <div className={s.social}>
                <Button
                  href="https://www.instagram.com/lizok.a.ph"
                  target="_blank"
                  className={s.link}
                >
                  instagram
                </Button>
                <Button
                  href="https://t.me/Mu_lS"
                  target="_blank"
                  className={s.link}
                >
                  telegram
                </Button>
                <Button
                  href="https://vk.ru/lizok.a.phtver"
                  target="_blank"
                  className={s.link}
                >
                  vkontakte
                </Button>
              </div>
              <div className={s.image}>
                <InteractiveParticles className={s.canvas} />
              </div>
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
