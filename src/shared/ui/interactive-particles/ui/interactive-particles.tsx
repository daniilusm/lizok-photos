"use client";

import clsx from "clsx";

import { INTERACTIVE_PARTICLES_IMAGES } from "../constants";
import { InteractiveParticlesCanvas } from "./interactive-particles-canvas";

import s from "./interactive-particles.module.scss";

export type InteractiveParticlesProps = {
  className?: string;
  images?: readonly string[];
};

export const InteractiveParticles = ({
  className,
  images = INTERACTIVE_PARTICLES_IMAGES,
}: InteractiveParticlesProps) => {
  return (
    <div className={clsx(s.root)}>
      <InteractiveParticlesCanvas
        className={clsx(s.canvas, className)}
        images={images}
      />
    </div>
  );
};

InteractiveParticles.displayName = "InteractiveParticles";
