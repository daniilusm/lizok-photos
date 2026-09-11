"use client";

import { type ComponentProps, useEffect, useMemo, useRef } from "react";
import { usePreloader } from "@widgets/preloader/hooks/use-preloader";
import {
  usePreloaderActions,
  usePreloaderStore,
} from "@widgets/preloader/model/preloaderStore";
import clsx from "clsx";
import gsap from "gsap";

import { optimizeCloudinaryImage } from "@/shared/lib/cloudinary-image";
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
  const isFinishEndAnimation = usePreloaderStore(
    (state) => state.isFinishEndAnimation,
  );
  const isPreloaded = usePreloaderStore((state) => state.isPreloaded);
  const { setFinishEndAnimation, setStartEndAnimation } = usePreloaderActions();

  const preloadSources = useMemo(() => {
    const optimizedHero = imageSrc
      ? optimizeCloudinaryImage(imageSrc, { role: "hero" })
      : "";

    return [
      ...(optimizedHero ? [optimizedHero] : []),
      ...(additionalResources || []),
    ];
  }, [additionalResources, imageSrc]);

  usePreloader(0, preloadSources);

  useEffect(() => {
    if (isFinishEndAnimation || !isPreloaded) return;

    const root = $root.current;
    if (!root) return;

    const tween = gsap.to(root, {
      "--preloader-progress": 1,
      duration: 1.2,
      ease: "power2.inOut",
      onComplete: () => {
        setStartEndAnimation();
        gsap.to(root, {
          "--close-progress": 1,
          duration: 1,
          ease: "power4.inOut",
          onComplete: () => {
            setFinishEndAnimation(true);
          },
        });
      },
    });

    return () => {
      tween.kill();
    };
  }, [
    isFinishEndAnimation,
    isPreloaded,
    setFinishEndAnimation,
    setStartEndAnimation,
  ]);

  if (isFinishEndAnimation) {
    return null;
  }

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
            imageRole="hero"
            loading="eager"
            sizes="100vw"
            preloaded
          />
        </div>
      )}
    </div>
  );
};

Preloader.displayName = "Preloader";
