/**
 * Centralized Animation Configuration
 * Controlled, Subtle, Lightweight SaaS Motion Standards
 */

export const animationConfig = {
  durations: {
    instant: '100ms',
    fast: '150ms',
    normal: '200ms',
    slow: '250ms',
    shimmer: '1.5s',
  },

  easings: {
    default: 'cubic-bezier(0.16, 1, 0.3, 1)', // Smooth ease-out
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
  },

  standards: {
    pageTransition: {
      duration: 0.22,
      ease: [0.16, 1, 0.3, 1],
      initial: { opacity: 0, y: 6 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -4 },
    },
    modal: {
      duration: 0.18,
      ease: [0.16, 1, 0.3, 1],
      overlay: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      },
      content: {
        initial: { opacity: 0, scale: 0.97, y: 6 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.98, y: 4 },
      },
    },
    dropdown: {
      duration: 0.14,
      ease: [0.16, 1, 0.3, 1],
      initial: { opacity: 0, y: -4, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -2, scale: 0.98 },
    },
    buttonHover: {
      tapScale: 0.98,
      duration: 0.12,
    },
    cardHover: {
      duration: 0.16,
    },
    sidebar: {
      duration: 0.22,
      ease: [0.16, 1, 0.3, 1],
    },
    toast: {
      duration: 0.2,
      initial: { opacity: 0, y: 8, scale: 0.96 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -4, scale: 0.96 },
    },
  },
} as const;
