import { mercoraTokens } from './tokens';

/**
 * Generates pure CSS Custom Properties mapping to Mercora design tokens
 */
export function generateThemeCssVariables(): string {
  const { colors, radii, typography } = mercoraTokens;

  return `
:root {
  /* Brand Burgundy Palette */
  --primary: ${colors.light.primary};
  --primary-hover: ${colors.light.primaryHover};
  --primary-foreground: ${colors.light.primaryForeground};

  /* Surfaces & Backgrounds */
  --background: ${colors.light.background};
  --background-secondary: ${colors.light.backgroundSecondary};
  --surface: ${colors.light.surface};
  --surface-raised: ${colors.light.surfaceRaised};
  --surface-hover: ${colors.light.surfaceHover};
  --surface-active: ${colors.light.surfaceActive};

  /* Text & Inks */
  --text-primary: ${colors.light.textPrimary};
  --text-secondary: ${colors.light.textSecondary};
  --text-muted: ${colors.light.textMuted};
  --text-disabled: ${colors.light.textDisabled};

  /* Borders & Dividers */
  --border: ${colors.light.border};
  --border-hover: ${colors.light.borderHover};
  --border-focus: ${colors.light.borderFocus};

  /* CTAs */
  --cta-start-bg: ${colors.light.ctaStart};
  --cta-demo-bg: ${colors.light.ctaDemo};

  /* Radii */
  --radius-xs: ${radii.xs};
  --radius-sm: ${radii.sm};
  --radius-md: ${radii.md};
  --radius-lg: ${radii.lg};
  --radius-xl: ${radii.xl};
  --radius-full: ${radii.full};

  /* Status Tokens */
  --status-success: ${colors.semantic.success};
  --status-warning: ${colors.semantic.warning};
  --status-error: ${colors.semantic.error};
  --status-info: ${colors.semantic.info};

  /* Typography */
  --font-sans: ${typography.fontFamily.sans};
}

.dark {
  --primary: ${colors.dark.primary};
  --primary-hover: ${colors.dark.primaryHover};
  --primary-foreground: ${colors.dark.primaryForeground};

  --background: ${colors.dark.background};
  --background-secondary: ${colors.dark.backgroundSecondary};
  --surface: ${colors.dark.surface};
  --surface-raised: ${colors.dark.surfaceRaised};
  --surface-hover: ${colors.dark.surfaceHover};
  --surface-active: ${colors.dark.surfaceActive};

  --text-primary: ${colors.dark.textPrimary};
  --text-secondary: ${colors.dark.textSecondary};
  --text-muted: ${colors.dark.textMuted};
  --text-disabled: ${colors.dark.textDisabled};

  --border: ${colors.dark.border};
  --border-hover: ${colors.dark.borderHover};
  --border-focus: ${colors.dark.borderFocus};

  --cta-start-bg: ${colors.dark.ctaStart};
  --cta-demo-bg: ${colors.dark.ctaDemo};
}
`;
}
