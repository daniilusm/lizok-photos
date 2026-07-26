"use client";

import { type ComponentProps, useCallback, useState } from "react";
import clsx from "clsx";

import { Button } from "@shared/ui/button";
import { Icon } from "@/shared/ui/icon";
import { Portal } from "@/shared/ui/portal";

import s from "./header.module.scss";
import { usePreloaderStore } from "../preloader/model/preloaderStore";

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
        <Button className={s.link} href="/">
          главная
        </Button>
        <Button className={s.link} href="/portfolio">
          портфолио
        </Button>
        <Button className={s.link} href="/price">
          стоимость
        </Button>
        <Button className={s.link} href="/contacts">
          контакты
        </Button>
      </div>
      <Portal
        id="contact-popup"
        className={clsx(s.contactPopup, { [s.openPopup]: isOpen })}
      >
        <div>
          <Button onClick={handleClose} className={s.crossBtn}>
            <Icon name="close" size="s" />
          </Button>
          <div className={s.overlay} onClick={handleClose} />
          <div className={s.wrapper}>ыы</div>
        </div>
      </Portal>
    </>
  );
};

Header.displayName = "Header";
