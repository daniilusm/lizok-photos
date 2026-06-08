"use client";

import type { RefObject } from "react";
import { useEffect, useMemo, useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { PARALLAX_INTENSITY, POINTER_SMOOTHING } from "../constants";
import { createGalleryShaderMaterial } from "../lib/create-gallery-shader-material";
import type { GalleryPointerState, GalleryViewport } from "../lib/types";

type GalleryMediaMeshProps = {
  index: number;
  src: string;
  mediaRefs: RefObject<(HTMLDivElement | null)[]>;
  pointersRef: RefObject<GalleryPointerState[]>;
  viewport: GalleryViewport;
};

export const GalleryMediaMesh = ({
  index,
  src,
  mediaRefs,
  pointersRef,
  viewport,
}: GalleryMediaMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const smoothPointerRef = useRef<GalleryPointerState>({
    x: 0.5,
    y: 0.5,
    velocityX: 0,
    velocityY: 0,
    hover: 0,
  });
  const texture = useTexture(src);

  const material = useMemo(
    () => createGalleryShaderMaterial(texture),
    [texture],
  );

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame(() => {
    const media = mediaRefs.current[index];
    const mesh = meshRef.current;
    const pointer = pointersRef.current[index];
    const smoothPointer = smoothPointerRef.current;

    if (!media || !mesh || !pointer) return;

    const bounds = media.getBoundingClientRect();

    mesh.scale.set(bounds.width, bounds.height, 1);
    mesh.position.set(
      bounds.left - viewport.width / 2 + bounds.width / 2,
      -bounds.top + viewport.height / 2 - bounds.height / 2,
      0,
    );

    const elementCenter = bounds.left + bounds.width / 2;
    const distance = (elementCenter - viewport.width / 2) / viewport.width;

    smoothPointer.x = THREE.MathUtils.lerp(
      smoothPointer.x,
      pointer.x,
      POINTER_SMOOTHING,
    );
    smoothPointer.y = THREE.MathUtils.lerp(
      smoothPointer.y,
      pointer.y,
      POINTER_SMOOTHING,
    );
    smoothPointer.velocityX = THREE.MathUtils.lerp(
      smoothPointer.velocityX,
      pointer.velocityX,
      POINTER_SMOOTHING,
    );
    smoothPointer.velocityY = THREE.MathUtils.lerp(
      smoothPointer.velocityY,
      pointer.velocityY,
      POINTER_SMOOTHING,
    );
    smoothPointer.hover = THREE.MathUtils.lerp(
      smoothPointer.hover,
      pointer.hover,
      POINTER_SMOOTHING,
    );

    material.uniforms.uParallax.value = distance * PARALLAX_INTENSITY;
    material.uniforms.uMouse.value.set(smoothPointer.x, smoothPointer.y);
    material.uniforms.uMouseVelocity.value.set(
      smoothPointer.velocityX,
      smoothPointer.velocityY,
    );
    material.uniforms.uHover.value = smoothPointer.hover;
    material.uniforms.uResolution.value.set(bounds.width, bounds.height);
    material.uniforms.uImageResolution.value.set(
      texture.image?.width ?? 1,
      texture.image?.height ?? 1,
    );
  });

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[1, 1, 32, 32]} />
    </mesh>
  );
};
