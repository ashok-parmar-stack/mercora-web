/**
 * Centralized Component Geometry & Sizing Configuration
 * Strict Linear-grade SaaS Dimensions & Radii Standards
 */

export const componentConfig = {
  // Input dimensions
  input: {
    sm: {
      height: '36px',
      heightClass: 'h-9',
      px: 'px-3',
      fontSize: 'text-xs',
      radius: 'rounded-lg', // 8px
      iconSize: 'w-3.5 h-3.5',
    },
    md: {
      height: '40px',
      heightClass: 'h-10',
      px: 'px-3.5',
      fontSize: 'text-sm',
      radius: 'rounded-lg', // 8px
      iconSize: 'w-4 h-4',
    },
    lg: {
      height: '44px',
      heightClass: 'h-11',
      px: 'px-4',
      fontSize: 'text-base',
      radius: 'rounded-lg', // 8px
      iconSize: 'w-4.5 h-4.5',
    },
  },

  // Button dimensions
  button: {
    sm: {
      height: '32px',
      heightClass: 'h-8',
      px: 'px-3',
      fontSize: 'text-xs',
      radius: 'rounded-lg', // 8px
      iconSize: 'w-3.5 h-3.5',
    },
    md: {
      height: '40px',
      heightClass: 'h-10',
      px: 'px-4',
      fontSize: 'text-sm',
      radius: 'rounded-lg', // 8px
      iconSize: 'w-4 h-4',
    },
    lg: {
      height: '44px',
      heightClass: 'h-11',
      px: 'px-5',
      fontSize: 'text-base',
      radius: 'rounded-lg', // 8px
      iconSize: 'w-4.5 h-4.5',
    },
    icon: {
      sm: 'h-8 w-8 p-0 rounded-lg',
      md: 'h-10 w-10 p-0 rounded-lg',
      lg: 'h-11 w-11 p-0 rounded-lg',
    },
  },

  // Radii Hierarchy
  radii: {
    xs: 'rounded-xs',     // 2px
    sm: 'rounded-sm',     // 4px
    md: 'rounded-md',     // 6px
    standard: 'rounded-lg', // 8px (standard controls: Button, Input, Select)
    card: 'rounded-xl',    // 12px (Card, Panel, Popover)
    dialog: 'rounded-2xl', // 16px (Dialog, Modal, AlertDialog)
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
