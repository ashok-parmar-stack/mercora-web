/**
 * Centralized Component Geometry & Sizing Configuration
 */

export const componentConfig = {
  sizes: {
    sm: {
      height: '32px',
      heightClass: 'h-8',
      px: 'px-2.5',
      py: 'py-1',
      fontSize: 'text-xs',
      radius: 'rounded-md',
      iconSize: 'w-3.5 h-3.5',
    },
    md: {
      height: '36px',
      heightClass: 'h-9',
      px: 'px-3.5',
      py: 'py-2',
      fontSize: 'text-sm',
      radius: 'rounded-lg',
      iconSize: 'w-4 h-4',
    },
    lg: {
      height: '40px',
      heightClass: 'h-10',
      px: 'px-4',
      py: 'py-2.5',
      fontSize: 'text-sm',
      radius: 'rounded-lg',
      iconSize: 'w-4 h-4',
    },
  },

  radii: {
    xs: 'rounded-xs', // 2px
    sm: 'rounded-sm', // 4px
    md: 'rounded-md', // 6px
    base: 'rounded-lg', // 8px (Linear Standard)
    lg: 'rounded-xl', // 12px
    xl: 'rounded-2xl', // 16px
    full: 'rounded-full',
  },

  container: {
    maxWidth: 'max-w-7xl',
    padding: 'px-4 sm:px-6 lg:px-8',
    sectionSpacing: 'space-y-6 sm:space-y-8',
  },

  table: {
    headerHeight: 'h-10',
    rowHeight: 'h-12',
    denseRowHeight: 'h-10',
  },
} as const;
