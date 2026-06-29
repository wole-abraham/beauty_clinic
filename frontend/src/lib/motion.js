export const ease = [0.25, 0.1, 0.25, 1]
export const easeOut = [0.0, 0.0, 0.2, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.75, ease } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.85, ease } },
}

export const slideLeft = {
  hidden: { opacity: 0, x: -56 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease } },
}

export const slideRight = {
  hidden: { opacity: 0, x: 56 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease } },
}

export const letterUp = {
  hidden: { opacity: 0, y: 64 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

export const stagger = (children = 0.09, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: children, delayChildren: delay } },
})

export const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.28, ease } },
}
