/**
 * Centralized Animation Configuration
 * Controlled, Subtle, Lightweight SaaS Motion Standards (Motion & CSS Transitions)
 */

export const animationConfig = {
  durations: {
    tooltip: '120ms',
    buttonHover: '140ms',
    inputTransition: '150ms',
    dropdown: '160ms',
    cardHover: '180ms',
    dialog: '200ms',
    toast: '200ms',
    sidebar: '220ms',
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
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1],
      overlay: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      },
      content: {
        initial: { opacity: 0, scale: 0.98, y: 8 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.98, y: 4 },
      },
    },
    dropdown: {
      duration: 0.16,
      ease: [0.16, 1, 0.3, 1],
      initial: { opacity: 0, y: -4, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -2, scale: 0.98 },
    },
    buttonHover: {
      tapScale: 0.985,
      lift: '-1px',
      duration: 0.14,
    },
    cardHover: {
      lift: '-2px',
      duration: 0.18,
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
