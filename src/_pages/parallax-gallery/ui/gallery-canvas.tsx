"use client";

import { type RefObject, Suspense } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { getCameraFov } from "../lib/get-camera-fov";
import type { GalleryPointerState, GalleryViewport } from "../lib/types";
import { GalleryMediaMesh } from "./gallery-media-mesh";

import s from "./parallax-gallery-page.module.scss";

type GalleryCanvasProps = {
  images: string[];
  mediaRefs: RefObject<(HTMLDivElement | null)[]>;
  pointersRef: RefObject<GalleryPointerState[]>;
  viewport: GalleryViewport;
};

export const GalleryCanvas = ({
  images,
  mediaRefs,
  pointersRef,
  viewport,
}: GalleryCanvasProps) => {
  if (viewport.width === 0 || viewport.height === 0) {
    return null;
  }

  return (
    <Canvas
      className={s.canvas}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
    >
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 100]}
        fov={getCameraFov(viewport.height)}
        near={0.01}
        far={1000}
      />

      <Suspense fallback={null}>
        {images.map((src, index) => (
          <GalleryMediaMesh
            key={src}
            index={index}
            src={src}
            mediaRefs={mediaRefs}
            pointersRef={pointersRef}
            viewport={viewport}
          />
        ))}
      </Suspense>
    </Canvas>
  );
};
