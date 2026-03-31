export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const cardEntrance = {
  initial: { opacity: 0, y: 24, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.45, ease: EASE_OUT_EXPO },
};

export const sectionStagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

export const sectionItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: EASE_OUT_EXPO },
};

export const alertSlideDown = {
  initial: { opacity: 0, y: -48, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -48, scale: 0.95 },
  transition: { duration: 0.3, ease: EASE_OUT_EXPO },
};

export const chipInteraction = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.96 },
  transition: { duration: 0.15 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 },
};
