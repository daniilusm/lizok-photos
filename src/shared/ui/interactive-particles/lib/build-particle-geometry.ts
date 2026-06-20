import * as THREE from "three";

import { PARTICLE_THRESHOLD } from "../constants";

export type ParticleGeometryResult = {
  geometry: THREE.InstancedBufferGeometry;
  width: number;
  height: number;
};

export const buildParticleGeometry = (
  texture: THREE.Texture,
  threshold = PARTICLE_THRESHOLD,
): ParticleGeometryResult => {
  const image = texture.image as HTMLImageElement;
  const width = image.width;
  const height = image.height;
  const numPoints = width * height;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to create canvas context for particles");
  }

  canvas.width = width;
  canvas.height = height;
  ctx.scale(1, -1);
  ctx.drawImage(image, 0, 0, width, height * -1);

  const imageData = ctx.getImageData(0, 0, width, height);
  const originalColors = Float32Array.from(imageData.data);

  let numVisible = 0;

  for (let index = 0; index < numPoints; index += 1) {
    if (originalColors[index * 4] > threshold) {
      numVisible += 1;
    }
  }

  const geometry = new THREE.InstancedBufferGeometry();

  const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
  positions.setXYZ(0, -0.5, 0.5, 0);
  positions.setXYZ(1, 0.5, 0.5, 0);
  positions.setXYZ(2, -0.5, -0.5, 0);
  positions.setXYZ(3, 0.5, -0.5, 0);
  geometry.setAttribute("position", positions);

  const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
  uvs.setXY(0, 0, 0);
  uvs.setXY(1, 1, 0);
  uvs.setXY(2, 0, 1);
  uvs.setXY(3, 1, 1);
  geometry.setAttribute("uv", uvs);

  geometry.setIndex(new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1));

  const indices = new Uint16Array(numVisible);
  const offsets = new Float32Array(numVisible * 3);
  const angles = new Float32Array(numVisible);

  for (let index = 0, visibleIndex = 0; index < numPoints; index += 1) {
    if (originalColors[index * 4] <= threshold) continue;

    offsets[visibleIndex * 3] = index % width;
    offsets[visibleIndex * 3 + 1] = Math.floor(index / width);
    indices[visibleIndex] = index;
    angles[visibleIndex] = Math.random() * Math.PI;
    visibleIndex += 1;
  }

  geometry.setAttribute(
    "pindex",
    new THREE.InstancedBufferAttribute(indices, 1, false),
  );
  geometry.setAttribute(
    "offset",
    new THREE.InstancedBufferAttribute(offsets, 3, false),
  );
  geometry.setAttribute(
    "angle",
    new THREE.InstancedBufferAttribute(angles, 1, false),
  );

  return { geometry, width, height };
};
