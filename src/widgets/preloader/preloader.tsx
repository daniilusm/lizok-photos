"use client";

import { type ComponentProps, useEffect, useRef } from "react";
import { usePreloader } from "@widgets/preloader/hooks/use-preloader";
import {
  usePreloaderActions,
  usePreloaderStore,
} from "@widgets/preloader/model/preloaderStore";
import clsx from "clsx";
import gsap from "gsap";

import { HOME_CONTENT } from "@/shared/stub/home";
import { Image } from "@/shared/ui/image";

import s from "./preloader.module.scss";

export type PreloaderProps = ComponentProps<"div"> & {
  className?: string;
  additionalResources?: string[];
  imageSrc?: string;
};

export const Preloader = (props: PreloaderProps) => {
  const {
    className,
    additionalResources,
    imageSrc = HOME_CONTENT.hero.image,
  } = props;

  const $root = useRef<HTMLDivElement>(null);
  const { formattedPercents } = usePreloaderStore();
  const { setFinishEndAnimation, setStartEndAnimation } = usePreloaderActions();

  const resources = [
    ...(imageSrc ? [imageSrc] : []),
    ...(additionalResources || []),
  ];

  usePreloader(10, resources);

  useEffect(() => {
    gsap.to($root.current, {
      "--preloader-progress": 1,
      duration: 2,
      ease: "power2.inOut",
      onComplete: () => {
        setStartEndAnimation();
        gsap.to($root.current, {
          "--close-progress": 1,
          ease: "power4.inOut",
          onComplete: () => {
            setFinishEndAnimation(true);
          },
        });
      },
    });
  }, [setFinishEndAnimation, setStartEndAnimation]);

  return (
    <div ref={$root} className={clsx(s.root, className)}>
      {imageSrc && (
        <div className={s.media} aria-hidden>
          <Image
            className={s.image}
            src={imageSrc}
            alt=""
            height="100%"
            objectFit="cover"
            loading="eager"
            sizes="100vw"
          />
        </div>
      )}

      <div className={s.inner}>
        <div className={s.icon}>
          <div className={s.percents}>{formattedPercents}</div>
        </div>
      </div>
    </div>
  );
};

Preloader.displayName = "Preloader";
