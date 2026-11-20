/**
 * Centralized Mercora Design Tokens & Theme Configuration
 * High-End Enterprise B2B SaaS Design System
 *
 * Provides single source of truth for colors, typography, spacing, and shadows
 * across NestJS backend, Next.js frontend, and shared packages.
 */

export const mercoraTokens = {
  colors: {
    // Mercora Signature Brand Crimson Spectrum
    brand: {
      50: '#fff1f2',
      100: '#ffe4e6',
      200: '#fecdd3',
      300: '#fda4af',
      400: '#fb7185',
      500: '#ee3135', // Primary Signature Crimson
      600: '#d92c30', // Hover
      700: '#b82029', // Active
      800: '#991b1b', // Deep
      900: '#7f1d1d', // Dark
      950: '#450a0a',
    },

    // Refined Slate & Neutral Scale
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },

    // ☀️ Light Mode Tokens
    light: {
      background: '#ffffff',
      backgroundSecondary: '#f8fafc',
      surface: '#ffffff',
      surfaceRaised: '#ffffff',
      surfaceHover: '#f8fafc',
      surfaceActive: '#f1f5f9',
      textPrimary: '#0f172a',
      textSecondary: '#334155',
      textMuted: '#64748b',
      textDisabled: '#94a3b8',
      border: '#e2e8f0',
      borderHover: '#cbd5e1',
      borderFocus: '#ee3135',
      sidebarBg: '#ffffff',
      sidebarBorder: '#e2e8f0',
      sidebarText: '#475569',
      sidebarActiveBg: '#fff1f2',
      sidebarActiveText: '#ee3135',
      headerBg: '#ffffff',
      headerBorder: '#e2e8f0',
      tableHeaderBg: '#f8fafc',
      tableRowHover: '#f1f5f9',
      tableBorder: '#e2e8f0',
      inputBackground: '#ffffff',
      inputBorder: '#d1d5db',
    },

    // 🌙 Dark Mode Tokens (Rich Obsidian Slate & High-Contrast Hierarchy)
    dark: {
      background: '#080b11',
      backgroundSecondary: '#0d121c',
      surface: '#121826',
      surfaceRaised: '#182032',
      surfaceHover: '#1e283d',
      surfaceActive: '#25324c',
      textPrimary: '#ffffff',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      textDisabled: '#526075',
      border: 'rgba(255, 255, 255, 0.08)',
      borderHover: 'rgba(255, 255, 255, 0.16)',
      borderFocus: '#ee3135',
      sidebarBg: '#0a0e17',
      sidebarBorder: 'rgba(255, 255, 255, 0.07)',
      sidebarText: '#94a3b8',
      sidebarActiveBg: 'rgba(238, 49, 53, 0.14)',
      sidebarActiveText: '#ffffff',
      headerBg: 'rgba(10, 14, 23, 0.85)',
      headerBorder: 'rgba(255, 255, 255, 0.07)',
      tableHeaderBg: '#0d121c',
      tableRowHover: 'rgba(255, 255, 255, 0.03)',
      tableBorder: 'rgba(255, 255, 255, 0.07)',
      inputBackground: '#0a0e17',
      inputBorder: 'rgba(255, 255, 255, 0.12)',
    },

    // Semantic Status Tokens
    semantic: {
      success: {
        light: { text: '#166534', bg: '#f0fdf4', border: '#bbf7d0', solid: '#15803d' },
        dark: { text: '#34d399', bg: 'rgba(16, 185, 129, 0.14)', border: 'rgba(16, 185, 129, 0.32)', solid: '#10b981' },
      },
      warning: {
        light: { text: '#92400e', bg: '#fffbeb', border: '#fde68a', solid: '#b45309' },
        dark: { text: '#fbbf24', bg: 'rgba(245, 158, 11, 0.14)', border: 'rgba(245, 158, 11, 0.32)', solid: '#f59e0b' },
      },
      error: {
        light: { text: '#991b1b', bg: '#fef2f2', border: '#fecaca', solid: '#dc2626' },
        dark: { text: '#f87171', bg: 'rgba(239, 68, 68, 0.14)', border: 'rgba(239, 68, 68, 0.32)', solid: '#ef4444' },
      },
      info: {
        light: { text: '#1e40af', bg: '#eff6ff', border: '#bfdbfe', solid: '#1d4ed8' },
        dark: { text: '#60a5fa', bg: 'rgba(59, 130, 246, 0.14)', border: 'rgba(59, 130, 246, 0.32)', solid: '#3b82f6' },
      },
      purple: {
        light: { text: '#6b21a8', bg: '#faf5ff', border: '#e9d5ff', solid: '#7e22ce' },
        dark: { text: '#c084fc', bg: 'rgba(168, 85, 247, 0.14)', border: 'rgba(168, 85, 247, 0.32)', solid: '#a855f7' },
      },
    },

    // Compatibility Bindings for theme.css.ts
    primary: {
      default: '#ee3135',
      hover: '#d92c30',
      dark: '#b82029',
      soft: '#fff1f2',
      glow: 'rgba(238, 49, 53, 0.25)',
      transparent10: 'rgba(238, 49, 53, 0.1)',
      transparent20: 'rgba(238, 49, 53, 0.2)',
    },
    ink: {
      darkest: '#0f172a',
      darker: '#1e293b',
      cardDark: '#111827',
      primary: '#334155',
      hover: '#1e293b',
    },
    gray: {
      900: '#0f172a',
      800: '#1e293b',
      700: '#334155',
      600: '#475569',
      500: '#64748b',
      400: '#94a3b8',
      300: '#cbd5e1',
      200: '#e2e8f0',
      100: '#f1f5f9',
      50: '#f8fafc',
    },
    surface: {
      canvas: '#ffffff',
      warmLine: '#e2e8f0',
      blush: '#fff1f2',
      glassHeader: 'rgba(255, 255, 255, 0.95)',
      glassBorder: '#e2e8f0',
      cardBg: '#ffffff',
      cardMuted: '#f8fafc',
      panelBg: '#f8fafc',
    },
    status: {
      success: '#15803d',
      successBg: '#f0fdf4',
      successBorder: '#bbf7d0',
      warning: '#b45309',
      warningBg: '#fffbeb',
      warningBorder: '#fde68a',
      error: '#ee3135',
      errorBg: '#fff1f2',
      errorBorder: '#fecaca',
      info: '#1d4ed8',
      infoBg: '#eff6ff',
      infoBorder: '#bfdbfe',
    },
  },

  // Typography — Mercora Global Typography System (4 Approved Fonts)
  typography: {
    fontFamily: {
      jakarta: 'var(--font-jakarta), "Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
      rethink: 'var(--font-rethink), "Rethink Sans", system-ui, -apple-system, sans-serif',
      work: 'var(--font-work), "Work Sans", system-ui, -apple-system, sans-serif',
      instrument: 'var(--font-instrument), "Instrument Sans", system-ui, -apple-system, sans-serif',
      // Functional aliases
      display: 'var(--font-jakarta), "Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
      ui: 'var(--font-rethink), "Rethink Sans", system-ui, -apple-system, sans-serif',
      body: 'var(--font-work), "Work Sans", system-ui, -apple-system, sans-serif',
      data: 'var(--font-instrument), "Instrument Sans", system-ui, -apple-system, sans-serif',
      sans: 'var(--font-work), "Work Sans", system-ui, -apple-system, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    letterSpacing: {
      tighter: '-0.04em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.04em',
      wider: '0.08em',
      widest: '0.12em',
    },
  },

  // Borders & Radii
  radii: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(15, 23, 42, 0.05)',
    md: '0 4px 12px rgba(15, 23, 42, 0.08)',
    lg: '0 12px 32px rgba(15, 23, 42, 0.12)',
    card: '0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)',
    glowRed: '0 0 20px rgba(238, 49, 53, 0.35)',
  },

  // Layout & Container Max-Width
  layout: {
    shell: 'min(1280px, calc(100vw - 48px))',
  },
} as const;

export type MercoraThemeTokens = typeof mercoraTokens;
export const themeTokens = mercoraTokens;
