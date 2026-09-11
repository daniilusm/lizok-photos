"use client";

import { useEffect } from "react";
import gsap from "gsap";

import { round } from "@shared/utils";
import { loaderAllImages } from "@shared/utils/loaders/image";
import { usePreloaderActions } from "@widgets/preloader/model/preloaderStore";

const uniqueSources = (sources: string[]) =>
  [...new Set(sources.map((src) => src.trim()).filter(Boolean))];

export const usePreloader = (delay = 0, additionalResources: string[] = []) => {
  const { setPercents } = usePreloaderActions();

  useEffect(() => {
    const markedImages = document.querySelectorAll<HTMLImageElement>(
      'img[data-preloaded="true"]',
    );

    const sources = uniqueSources([
      ...[...markedImages].map((img) => img.currentSrc || img.src || ""),
      ...additionalResources,
    ]);

    if (sources.length === 0) {
      setPercents(1);
      return;
    }

    const progress = { value: 0 };

    loaderAllImages(
      sources,
      delay,
      () => {
        setPercents(1);
      },
      ({ loaded, length }) => {
        gsap.to(progress, {
          value: loaded / length,
          overwrite: true,
          onUpdate: () => {
            setPercents(round(progress.value, 2));
          },
        });
      },
    );

    return () => {
      setPercents(0);
    };
  }, [additionalResources, delay, setPercents]);
};
