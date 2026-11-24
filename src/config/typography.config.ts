/**
 * Centralized Typography Configuration
 * Professional SaaS Typography Scale (Geist primary)
 */

export const typographyConfig = {
  fontFamily: {
    sans: 'var(--font-geist-sans, "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    mono: 'var(--font-geist-mono, "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace)',
  },

  // Token Hierarchy matching exact requirements
  scale: {
    pageTitle: {
      fontSize: '24px',
      lineHeight: '32px',
      fontWeight: '600',
      letterSpacing: '-0.02em',
      className: 'text-2xl font-semibold tracking-tight',
    },
    sectionTitle: {
      fontSize: '18px',
      lineHeight: '26px',
      fontWeight: '600',
      letterSpacing: '-0.015em',
      className: 'text-lg font-semibold tracking-tight',
    },
    cardTitle: {
      fontSize: '15px',
      lineHeight: '22px',
      fontWeight: '600',
      letterSpacing: '-0.01em',
      className: 'text-[15px] font-semibold leading-snug',
    },
    body: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: '400',
      letterSpacing: '0',
      className: 'text-sm font-normal leading-normal',
    },
    label: {
      fontSize: '13px',
      lineHeight: '18px',
      fontWeight: '500',
      letterSpacing: '0.01em',
      className: 'text-[13px] font-medium leading-tight',
    },
    helperText: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: '400',
      letterSpacing: '0',
      className: 'text-xs font-normal text-muted-foreground',
    },
  },
} as const;
