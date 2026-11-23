/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: 'var(--background)',
          secondary: 'var(--background-secondary)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          hover: 'var(--surface-hover)',
          canvas: 'var(--theme-canvas, var(--background))',
          card: 'var(--theme-card-bg, var(--surface))',
          panel: 'var(--theme-panel-bg, var(--background-secondary))',
          warm: 'var(--theme-warm-line, var(--border))',
          blush: 'var(--theme-blush, #fff7f7)',
          border: 'var(--theme-glass-border, var(--border))',
        },
        border: {
          DEFAULT: 'var(--border)',
          hover: 'var(--border-hover)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          foreground: 'var(--primary-foreground)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        brand: {
          50: '#fff3f4',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#ee3135',
          600: '#d92c30',
          700: '#b82029',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
          dark: '#14161a',
          ink: '#282828',
          card: '#1f2126',
        },
        card: {
          DEFAULT: 'var(--surface, #ffffff)',
          foreground: 'var(--text-primary, #0f172a)',
        },
        muted: {
          DEFAULT: 'var(--background-secondary, #f8fafc)',
          foreground: 'var(--text-muted, #64748b)',
        },
        destructive: {
          DEFAULT: 'var(--error, #dc2626)',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: 'var(--background-secondary, #f1f5f9)',
          foreground: 'var(--text-primary, #0f172a)',
        },
        accent: {
          50: '#ebf5f8',
          100: '#d2e7ed',
          200: '#a5d0db',
          300: '#67b5c6',
          400: '#3392a7',
          500: '#1d768b',
          600: '#176073',
          700: '#155e75',
          800: '#116570',
          900: '#0e4149',
        },
        table: {
          header: 'var(--background-secondary)',
          headerBorder: 'var(--border)',
          headerActive: 'rgba(238, 49, 53, 0.1)',
          headerActiveText: 'var(--primary)',
          rowHover: 'var(--surface-hover)',
          rowSelected: 'rgba(238, 49, 53, 0.08)',
        },
        status: {
          success: 'var(--success, #16a34a)',
          'success-bg': 'var(--theme-success-bg, rgba(22, 163, 74, 0.12))',
          'success-border': 'var(--theme-success-border, rgba(22, 163, 74, 0.25))',
          warning: 'var(--warning, #d97706)',
          'warning-bg': 'var(--theme-warning-bg, rgba(217, 119, 6, 0.12))',
          'warning-border': 'var(--theme-warning-border, rgba(217, 119, 6, 0.25))',
          error: 'var(--error, #dc2626)',
          'error-bg': 'var(--theme-error-bg, rgba(220, 38, 38, 0.12))',
          'error-border': 'var(--theme-error-border, rgba(220, 38, 38, 0.25))',
          info: 'var(--info, #2563eb)',
          'info-bg': 'var(--theme-info-bg, rgba(37, 99, 235, 0.12))',
          'info-border': 'var(--theme-info-border, rgba(37, 99, 235, 0.25))',
        },
      },
      fontFamily: {
        // 1. Brand & Display Typography
        jakarta: ['var(--font-jakarta, "Plus Jakarta Sans")', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        // 2. Navigation & Interface Heading Font
        rethink: ['var(--font-rethink, "Rethink Sans")', 'Rethink Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        // 3. Content & Body Font
        work: ['var(--font-work, "Work Sans")', 'Work Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        // 4. Data & Metrics Font
        instrument: ['var(--font-instrument, "Instrument Sans")', 'Instrument Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],

        // Functional aliases
        display: ['var(--font-jakarta, "Plus Jakarta Sans")', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        ui: ['var(--font-rethink, "Rethink Sans")', 'Rethink Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        body: ['var(--font-work, "Work Sans")', 'Work Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        data: ['var(--font-instrument, "Instrument Sans")', 'Instrument Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        sans: ['var(--font-work, "Work Sans")', 'Work Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s infinite',
      },
    },
  },
  plugins: [],
};
