// Types
interface AnimationProperties {
  [key: string]: string | number;
}

interface AnimationPhase {
  [key: string]: string | number | undefined;
  ease?: string;
}

interface AnimationData {
  set: AnimationProperties;
  in: AnimationPhase;
  out: AnimationPhase;
}

interface AnimatesMap {
  [key: string]: AnimationData;
}

// Helper functions
const properties = {
  y: (v: string | number): AnimationProperties => {
    return {
      transform: `translateY(${v})`,
    };
  },
};

export const ANIMATES: AnimatesMap = {
  fade: {
    set: {
      opacity: 0,
    },
    in: {
      opacity: 1,
      ease: "sine.inOut",
    },
    out: {
      opacity: 0,
      ease: "sine.inOut",
    },
  },
  fadeTop: {
    set: {
      ...properties.y("1.8vw"),
      opacity: 0,
    },
    in: {
      y: 0,
      opacity: 1,
      ease: "sine.inOut",
    },
    out: {
      y: "1.8vw",
      opacity: 0,
      ease: "sine.inOut",
    },
  },
  // Раскрытие снизу вверх через clip-path inset
  clipRevealUp: {
    set: {
      clipPath: "inset(100% 0% 0% 0%)",
    },
    in: {
      clipPath: "inset(0% 0% 0% 0%)",
      ease: "power2.inOut",
    },
    out: {
      clipPath: "inset(100% 0% 0% 0%)",
      ease: "power2.inOut",
    },
  },
};

export type { AnimationData, AnimatesMap };
