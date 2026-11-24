/**
 * Centralized Mercora & Linear-Inspired Design Tokens
 * High-End Enterprise B2B SaaS Design System
 *
 * Single source of truth for colors, typography, spacing, and component geometry.
 */

export const mercoraTokens = {
  colors: {
    // 🟣 Linear Signature Indigo Brand Spectrum
    brand: {
      50: '#f0f2fd',
      100: '#e0e4fb',
      200: '#c7cefa',
      300: '#a3aef6',
      400: '#7c8cf0',
      500: '#5e6ad2', // Linear Signature Indigo
      600: '#4e5ac0', // Hover
      700: '#434ea8', // Deep
      800: '#38418a', // Dark
      900: '#2f376f',
      950: '#1b2042',
    },

    // ☀️ Light Mode Tokens (Linear Light)
    light: {
      background: '#f8f9fa',
      backgroundSecondary: '#f1f3f5',
      surface: '#ffffff',
      surfaceRaised: '#ffffff',
      surfaceHover: '#f4f5f8',
      surfaceActive: '#ebeef5',
      textPrimary: '#0f1012',
      textSecondary: '#575c66',
      textMuted: '#7a7f8c',
      textDisabled: '#9ea3ac',
      border: '#e1e4e8',
      borderHover: '#d0d4db',
      borderFocus: '#5e6ad2',
      primary: '#5e6ad2',
      primaryHover: '#4e5ac0',
      primaryForeground: '#ffffff',
      ctaStart: '#5e6ad2',
      ctaDemo: '#0f1012',
      sidebarBg: '#ffffff',
      sidebarBorder: '#e1e4e8',
      sidebarText: '#575c66',
      sidebarActiveBg: '#f0f2fd',
      sidebarActiveText: '#5e6ad2',
      headerBg: 'rgba(255, 255, 255, 0.92)',
      headerBorder: '#e1e4e8',
      tableHeaderBg: '#f8f9fa',
      tableRowHover: '#f4f5f8',
      tableBorder: '#e1e4e8',
      inputBackground: '#ffffff',
      inputBorder: '#d0d4db',
    },

    // 🌙 Dark Mode Tokens (Linear High-Craft Void & Indigo)
    dark: {
      background: '#08090a',
      backgroundSecondary: '#0d0e11',
      surface: '#121316',
      surfaceRaised: '#18191d',
      surfaceHover: '#1e2025',
      surfaceActive: '#262830',
      textPrimary: '#ededee',
      textSecondary: '#a0a2a7',
      textMuted: '#686b73',
      textDisabled: '#43464c',
      border: 'rgba(255, 255, 255, 0.08)',
      borderHover: 'rgba(255, 255, 255, 0.16)',
      borderFocus: '#5e6ad2',
      primary: '#5e6ad2',
      primaryHover: '#717eef',
      primaryForeground: '#ffffff',
      ctaStart: '#5e6ad2',
      ctaDemo: '#18191d',
      sidebarBg: '#0a0b0d',
      sidebarBorder: 'rgba(255, 255, 255, 0.07)',
      sidebarText: '#a0a2a7',
      sidebarActiveBg: 'rgba(94, 106, 210, 0.16)',
      sidebarActiveText: '#ffffff',
      headerBg: 'rgba(10, 11, 13, 0.88)',
      headerBorder: 'rgba(255, 255, 255, 0.07)',
      tableHeaderBg: '#0d0e11',
      tableRowHover: 'rgba(255, 255, 255, 0.025)',
      tableBorder: 'rgba(255, 255, 255, 0.07)',
      inputBackground: '#0d0e11',
      inputBorder: 'rgba(255, 255, 255, 0.10)',
    },

    // Semantic Status Tokens
    semantic: {
      success: '#059669',
      warning: '#d97706',
      error: '#e11d48',
      info: '#2563eb',
    },
  },

  // Component Geometry & Spacing
  radii: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    full: '9999px',
  },

  typography: {
    fontFamily: {
      sans: 'var(--font-sans, "Geist", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
  },
} as const;
