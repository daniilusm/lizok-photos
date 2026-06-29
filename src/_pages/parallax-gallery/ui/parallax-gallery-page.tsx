"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { projects } from "@/shared/stub/projects";

import { useGalleryPointer } from "../hooks/use-gallery-pointer";
import { useParallaxGallery } from "../hooks/use-parallax-gallery";
import { GalleryCanvas } from "./gallery-canvas";
import { GalleryTrack } from "./gallery-track";

import s from "./parallax-gallery-page.module.scss";

export const ParallaxGalleryPage = () => {
  const [isMounted, setIsMounted] = useState(false);

  const projectsImages = useMemo(() => {
    return projects.map((item) => item.mainImage);
  }, []);

  const {
    wrapperRef,
    containerRef,
    mediaRefs,
    setMediaRef,
    setImageRef,
    isReady,
    viewport,
    images,
  } = useParallaxGallery(projectsImages);

  const pointersRef = useGalleryPointer(mediaRefs, images.length);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section id="gl" className={s.root} data-lenis-prevent>
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
