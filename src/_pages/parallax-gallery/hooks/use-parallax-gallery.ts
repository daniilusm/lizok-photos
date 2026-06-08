"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { GALLERY_IMAGES } from "../constants";
import { getWindowViewport } from "../lib/get-window-viewport";
import { preloadGalleryImages } from "../lib/preload-gallery-images";
import type { GalleryViewport } from "../lib/types";
import { useParallaxGalleryScroll } from "./use-parallax-gallery-scroll";

export const useParallaxGallery = (images = GALLERY_IMAGES) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  const [isReady, setIsReady] = useState(false);
  const [viewport, setViewport] = useState<GalleryViewport>(getWindowViewport);

  const { setScrollLimit } = useParallaxGalleryScroll({
    wrapperRef,
    containerRef,
    imageRefs,
  });

  const updateLayout = useCallback(() => {
    const wrapper = wrapperRef.current;
    const container = containerRef.current;

    setViewport(getWindowViewport());

    if (!wrapper || !container) return;

    setScrollLimit(Math.max(0, container.scrollWidth - wrapper.clientWidth));
  }, [setScrollLimit]);

  useLayoutEffect(() => {
    updateLayout();
  }, [updateLayout]);

  useEffect(() => {
    let isMounted = true;

    document.body.classList.add("loading");

    preloadGalleryImages(images).then(() => {
      if (!isMounted) return;

      document.body.classList.remove("loading");
      updateLayout();
      setIsReady(true);
    });

    return () => {
      isMounted = false;
      document.body.classList.remove("loading");
    };
  }, [images, updateLayout]);

  useEffect(() => {
    window.addEventListener("resize", updateLayout);

    return () => {
      window.removeEventListener("resize", updateLayout);
    };
  }, [updateLayout]);

  const setMediaRef = useCallback(
    (index: number, node: HTMLDivElement | null) => {
      mediaRefs.current[index] = node;
    },
    [],
  );

  const setImageRef = useCallback(
    (index: number, node: HTMLImageElement | null) => {
      imageRefs.current[index] = node;
    },
    [],
  );

  return {
    wrapperRef,
    containerRef,
    mediaRefs,
    setMediaRef,
    setImageRef,
    isReady,
    viewport,
    images,
  };
};
