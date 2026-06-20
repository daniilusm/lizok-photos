export const INTERACTIVE_PARTICLES_IMAGES = [
  "/interactive-particles/3.webp",
] as const;

// export const INTERACTIVE_PARTICLES_IMAGES = [
//   "/parallax-gallery/1.webp",
//   "/parallax-gallery/2.webp",
//   "/parallax-gallery/3.webp",
//   "/parallax-gallery/4.webp",
//   "/parallax-gallery/5.webp",
// ] as const;

export const PARTICLE_CAMERA = {
  fov: 50,
  positionZ: 300,
  near: 1,
  far: 10000,
} as const;

export const PARTICLE_THRESHOLD = 34;

export const TOUCH_TEXTURE = {
  size: 80,
  maxAge: 160,
  radius: 0.15,
} as const;
