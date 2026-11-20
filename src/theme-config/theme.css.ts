import { mercoraTokens } from './tokens';

/**
 * Generates pure CSS Custom Properties mapping to Mercora design tokens
 */
export function generateThemeCssVariables(): string {
  return `
:root {
  /* Brand Red Palette */
  --theme-red: ${mercoraTokens.colors.primary.default};
  --theme-red-hover: ${mercoraTokens.colors.primary.hover};
  --theme-red-dark: ${mercoraTokens.colors.primary.dark};
  --theme-red-soft: ${mercoraTokens.colors.primary.soft};
  --theme-red-glow: ${mercoraTokens.colors.primary.glow};

  /* Inks & Dark Colors */
  --theme-ink: ${mercoraTokens.colors.ink.primary};
  --theme-ink-darkest: ${mercoraTokens.colors.ink.darkest};
  --theme-ink-darker: ${mercoraTokens.colors.ink.darker};
  --theme-dark: ${mercoraTokens.colors.ink.primary};
  --theme-dark-card: ${mercoraTokens.colors.ink.cardDark};

  /* Grays */
  --theme-gray-900: ${mercoraTokens.colors.gray[900]};
  --theme-gray-800: ${mercoraTokens.colors.gray[800]};
  --theme-gray-700: ${mercoraTokens.colors.gray[700]};
  --theme-gray-600: ${mercoraTokens.colors.gray[600]};
  --theme-gray-500: ${mercoraTokens.colors.gray[500]};
  --theme-gray-400: ${mercoraTokens.colors.gray[400]};
  --theme-gray-300: ${mercoraTokens.colors.gray[300]};
  --theme-gray-200: ${mercoraTokens.colors.gray[200]};
  --theme-gray-100: ${mercoraTokens.colors.gray[100]};
  --theme-gray-50: ${mercoraTokens.colors.gray[50]};

  /* Surfaces */
  --theme-canvas: ${mercoraTokens.colors.surface.canvas};
  --theme-warm-line: ${mercoraTokens.colors.surface.warmLine};
  --theme-blush: ${mercoraTokens.colors.surface.blush};
  --theme-glass-header: ${mercoraTokens.colors.surface.glassHeader};
  --theme-glass-border: ${mercoraTokens.colors.surface.glassBorder};
  --theme-card-bg: ${mercoraTokens.colors.surface.cardBg};
  --theme-panel-bg: ${mercoraTokens.colors.surface.panelBg};

  /* Semantic Status */
  --theme-success: ${mercoraTokens.colors.status.success};
  --theme-success-bg: ${mercoraTokens.colors.status.successBg};
  --theme-success-border: ${mercoraTokens.colors.status.successBorder};
  --theme-warning: ${mercoraTokens.colors.status.warning};
  --theme-warning-bg: ${mercoraTokens.colors.status.warningBg};
  --theme-error: ${mercoraTokens.colors.status.error};
  --theme-error-bg: ${mercoraTokens.colors.status.errorBg};

  /* Radii */
  --theme-radius-sm: ${mercoraTokens.radii.sm};
  --theme-radius-md: ${mercoraTokens.radii.md};
  --theme-radius: ${mercoraTokens.radii.lg};
  --theme-radius-xl: ${mercoraTokens.radii.xl};
  --theme-radius-full: ${mercoraTokens.radii.full};

  /* Layout */
  --theme-shell: ${mercoraTokens.layout.shell};

  /* Typography — Mercora Global Typography System */
  --font-jakarta: var(--font-jakarta, 'Plus Jakarta Sans', system-ui, sans-serif);
  --font-rethink: var(--font-rethink, 'Rethink Sans', system-ui, sans-serif);
  --font-work: var(--font-work, 'Work Sans', system-ui, sans-serif);
  --font-instrument: var(--font-instrument, 'Instrument Sans', system-ui, sans-serif);
  --font-display: var(--font-jakarta);
  --font-ui: var(--font-rethink);
  --font-body: var(--font-work);
  --font-data: var(--font-instrument);
  --font-dm-sans: var(--font-work);
  --theme-font-sans: var(--font-rethink);
  --theme-font-body: var(--font-work);
  --theme-font-mono: ${mercoraTokens.typography.fontFamily.mono};
}
`.trim();
}
