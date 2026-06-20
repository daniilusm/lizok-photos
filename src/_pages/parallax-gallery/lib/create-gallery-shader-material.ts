import * as THREE from "three";

import {
  COLOR_MASK_RADIUS,
  CURSOR_DISTORT_INTENSITY,
  MEDIA_BORDER_RADIUS,
} from "../constants";
import { mediaFragmentShader, mediaVertexShader } from "../shaders";

export const createGalleryShaderMaterial = (texture: THREE.Texture) => {
  const image = texture.image as HTMLImageElement | undefined;

  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uTexture: { value: texture },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uImageResolution: {
        value: new THREE.Vector2(image?.width ?? 1, image?.height ?? 1),
      },
      uParallax: { value: 0 },
      uUvScale: { value: 0.85 },
      uShaderMultiplier: { value: 1.0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseVelocity: { value: new THREE.Vector2(0, 0) },
      uHover: { value: 0 },
      uMaskRadius: { value: COLOR_MASK_RADIUS },
      uCursorDistort: { value: CURSOR_DISTORT_INTENSITY },
      uBorderRadius: { value: MEDIA_BORDER_RADIUS },
    },
    vertexShader: mediaVertexShader,
    fragmentShader: mediaFragmentShader,
  });
};
