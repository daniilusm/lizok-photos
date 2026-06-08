"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useGalleryPointer } from "../hooks/use-gallery-pointer";
import { useParallaxGallery } from "../hooks/use-parallax-gallery";
import { GalleryCanvas } from "./gallery-canvas";
import { GalleryTrack } from "./gallery-track";

import s from "./parallax-gallery-page.module.scss";

export const ParallaxGalleryPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const {
    wrapperRef,
    containerRef,
    mediaRefs,
    setMediaRef,
    setImageRef,
    isReady,
    viewport,
    images,
  } = useParallaxGallery();

  const pointersRef = useGalleryPointer(mediaRefs, images.length);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section id="gl" className={s.root}>
      <div ref={wrapperRef} className={s.wrapper}>
        {isMounted &&
          isReady &&
          createPortal(
            <GalleryCanvas
              images={images}
              mediaRefs={mediaRefs}
              pointersRef={pointersRef}
              viewport={viewport}
            />,
            document.body,
          )}

        <GalleryTrack
          images={images}
          containerRef={containerRef}
          setMediaRef={setMediaRef}
          setImageRef={setImageRef}
        />
      </div>
    </section>
  );
};

ParallaxGalleryPage.displayName = "ParallaxGalleryPage";
