"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

import { typografText } from "@/shared/utils/typograf";
import { usePreloaderStore } from "@/widgets/preloader/model/preloaderStore";

import { COOKIE_CONSENT_EVENT, COOKIE_CONSENT_KEY } from "./constants";

import s from "./cookie-consent.module.scss";

export const CookieConsent = () => {
  const [isMounted, setMounted] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const isFinishEndAnimation = usePreloaderStore(
    (state) => state.isFinishEndAnimation,
  );

  useEffect(() => {
    let cancelled = false;
    let frameId = 0;
    let timeoutId = 0;

    const reveal = () => {
      if (cancelled) return;

      try {
        if (window.localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted") {
          return;
        }
      } catch {
        // private mode / blocked storage — всё равно показываем
      }

      setMounted(true);
      frameId = window.requestAnimationFrame(() => {
        setOpen(true);
      });
    };

    if (isFinishEndAnimation) {
      reveal();
    } else {
      // на случай, если прелоадер уже пропущен
      timeoutId = window.setTimeout(reveal, 1600);
    }

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [isFinishEndAnimation]);

  const accept = () => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    } catch {
      // ignore
    }

    window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
    setOpen(false);
    window.setTimeout(() => setMounted(false), 320);
  };

  if (!isMounted) return null;

  return (
    <div
      className={clsx(s.root, isOpen && s.visible)}
      role="dialog"
      aria-modal="false"
      aria-live="polite"
      aria-label={typografText("Согласие на использование cookie")}
    >
      <p className={s.text} id="cookie-consent-text">
        {typografText(
          "Мы используем cookie, чтобы сайт работал стабильнее и было удобнее им пользоваться.",
        )}
      </p>
      <button
        type="button"
        className={s.button}
        onClick={accept}
        aria-describedby="cookie-consent-text"
      >
        {typografText("Принять")}
      </button>
    </div>
  );
};

CookieConsent.displayName = "CookieConsent";
