"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { useTexture } from "@react-three/drei";
import { type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import * as THREE from "three";

import { PARTICLE_CAMERA } from "../constants";
import { buildParticleGeometry } from "../lib/build-particle-geometry";
import { TouchTexture } from "../lib/touch-texture";
import { particleFragmentShader, particleVertexShader } from "../shaders";

export type ParticlesMeshHandle = {
  show: (duration?: number) => void;
  hide: (destroy?: boolean, duration?: number) => Promise<void>;
};

type ParticlesMeshProps = {
  src: string;
  interactive?: boolean;
};

const getFovHeight = (camera: THREE.PerspectiveCamera) => {
  return (
    2 * Math.tan((camera.fov * Math.PI) / 180 / 2) * Math.abs(camera.position.z)
  );
};

export const ParticlesMesh = forwardRef<
  ParticlesMeshHandle,
  ParticlesMeshProps
>(({ src, interactive = true }, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const hitAreaRef = useRef<THREE.Mesh>(null);
  const touchRef = useRef<TouchTexture | null>(null);
  const interactiveRef = useRef(interactive);
  const disposedRef = useRef(false);

  const texture = useTexture(src);
  const { camera } = useThree();

  const { geometry, width, height } = useMemo(() => {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    return buildParticleGeometry(texture);
  }, [texture]);

  const material = useMemo(() => {
    touchRef.current = new TouchTexture();

    return new THREE.RawShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uRandom: { value: 1 },
        uDepth: { value: 2 },
        uSize: { value: 0 },
        uTextureSize: { value: new THREE.Vector2(width, height) },
        uTexture: { value: texture },
        uTouch: { value: touchRef.current.texture },
      },
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      depthTest: false,
      transparent: true,
    });
  }, [height, texture, width]);

  useImperativeHandle(ref, () => ({
    show(duration = 1) {
      if (!material) return;

      gsap.fromTo(
        material.uniforms.uSize,
        { value: 0.5 },
        { value: 1.5, duration },
      );
      gsap.to(material.uniforms.uRandom, { value: 2, duration });
      gsap.fromTo(
        material.uniforms.uDepth,
        { value: 40 },
        { value: 4, duration: duration * 1.5 },
      );

      interactiveRef.current = interactive;
    },
    hide(destroy = false, duration = 0.8) {
      if (!material || disposedRef.current) {
        return Promise.resolve();
      }

      interactiveRef.current = false;

      return new Promise((resolve) => {
        gsap.to(material.uniforms.uRandom, {
          value: 5,
          duration,
          onComplete: () => {
            if (destroy && !disposedRef.current) {
              disposedRef.current = true;
              geometry.dispose();
              material.dispose();
              touchRef.current?.dispose();
              touchRef.current = null;
            }

            resolve();
          },
        });
        gsap.to(material.uniforms.uDepth, {
          value: -20,
          duration,
          ease: "power2.in",
        });
        gsap.to(material.uniforms.uSize, {
          value: 0,
          duration: duration * 0.8,
        });
      });
    },
  }));

  useEffect(() => {
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    const scale = getFovHeight(perspectiveCamera) / height;

    if (meshRef.current) {
      meshRef.current.scale.set(scale, scale, 1);
    }

    if (hitAreaRef.current) {
      hitAreaRef.current.scale.set(scale, scale, 1);
    }
  }, [camera, height]);

  useFrame((_state, delta) => {
    material.uniforms.uTime.value += delta;
    touchRef.current?.update();
  });

  useEffect(() => {
    gsap.fromTo(
      material.uniforms.uSize,
      { value: 0.5 },
      { value: 1.5, duration: 1 },
    );
    gsap.to(material.uniforms.uRandom, { value: 2, duration: 1 });
    gsap.fromTo(
      material.uniforms.uDepth,
      { value: 40 },
      { value: 4, duration: 1.5 },
    );
  }, [material]);

  useEffect(() => {
    return () => {
      if (disposedRef.current) return;

      disposedRef.current = true;
      geometry.dispose();
      material.dispose();
      touchRef.current?.dispose();
    };
  }, [geometry, material]);

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!interactiveRef.current || !event.uv || !touchRef.current) return;

    touchRef.current.addTouch({
      x: event.uv.x,
      y: event.uv.y,
    });
  };

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} material={material} />

      <mesh ref={hitAreaRef} visible={false} onPointerMove={handlePointerMove}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
});

ParticlesMesh.displayName = "ParticlesMesh";

export const getParticleCameraZ = () => PARTICLE_CAMERA.positionZ;
