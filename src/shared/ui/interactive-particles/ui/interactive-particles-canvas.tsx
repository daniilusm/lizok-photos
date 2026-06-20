"use client";

import { Suspense, useCallback, useRef, useState } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { PARTICLE_CAMERA } from "../constants";
import {
  getParticleCameraZ,
  ParticlesMesh,
  type ParticlesMeshHandle,
} from "./particles-mesh";

export type InteractiveParticlesCanvasProps = {
  images: readonly string[];
  className?: string;
};

export const InteractiveParticlesCanvas = ({
  images,
  className,
}: InteractiveParticlesCanvasProps) => {
  const meshRef = useRef<ParticlesMeshHandle>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeImage, setActiveImage] = useState(images[0]);
  const isTransitioningRef = useRef(false);

  const goTo = useCallback(
    async (index: number) => {
      if (isTransitioningRef.current || !images[index]) return;

      isTransitioningRef.current = true;
      await meshRef.current?.hide(true);

      setCurrentIndex(index);
      setActiveImage(images[index]);
      isTransitioningRef.current = false;
    },
    [images],
  );

  const next = useCallback(() => {
    const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;

    void goTo(nextIndex);
  }, [currentIndex, goTo, images.length]);

  const handleClick = useCallback(() => {
    void next();
  }, [next]);

  return (
    <Canvas
      className={className}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      // onClick={handleClick}
    >
      <Suspense fallback={null}>
        <PerspectiveCamera
          makeDefault
          fov={PARTICLE_CAMERA.fov}
          near={PARTICLE_CAMERA.near}
          far={PARTICLE_CAMERA.far}
          position={[0, 0, getParticleCameraZ()]}
        />
        <ParticlesMesh key={activeImage} ref={meshRef} src={activeImage} />
      </Suspense>
    </Canvas>
  );
};
