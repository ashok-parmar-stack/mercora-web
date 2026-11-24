/**
 * Centralized Theme Configuration
 * High-Craft Enterprise SaaS UI Design System
 */

export interface ThemeColors {
  background: string;
  foreground: string;
  surface: string;
  surfaceRaised: string;
  surfaceHover: string;
  surfaceActive: string;
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  borderHover: string;
  borderFocus: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
}

export const lightTheme: ThemeColors = {
  background: '#F8F9FB',
  foreground: '#17191F',
  surface: '#FFFFFF',
  surfaceRaised: '#FFFFFF',
  surfaceHover: '#F4F5F8',
  surfaceActive: '#EAECEF',
  primary: '#5B5BD6',
  primaryHover: '#4B4BC7',
  primaryActive: '#3E3EB5',
  primaryForeground: '#FFFFFF',
  secondary: '#F0F1F5',
  secondaryForeground: '#17191F',
  muted: '#F1F2F6',
  mutedForeground: '#737784',
  accent: '#EDEEFF',
  accentForeground: '#5B5BD6',
  border: '#E5E7ED',
  borderHover: '#D4D7E1',
  borderFocus: '#5B5BD6',
  destructive: '#DC4545',
  destructiveForeground: '#FFFFFF',
  success: '#16865B',
  successForeground: '#FFFFFF',
  warning: '#C58A24',
  warningForeground: '#FFFFFF',
};

export const darkTheme: ThemeColors = {
  background: '#111318',
  foreground: '#F4F5F7',
  surface: '#191C23',
  surfaceRaised: '#20242D',
  surfaceHover: '#262A35',
  surfaceActive: '#2D323E',
  primary: '#8585F5',
  primaryHover: '#9898F8',
  primaryActive: '#7272EB',
  primaryForeground: '#FFFFFF',
  secondary: '#242832',
  secondaryForeground: '#F4F5F7',
  muted: '#20242D',
  mutedForeground: '#A0A5B1',
  accent: '#292B3A',
  accentForeground: '#8585F5',
  border: '#2C303A',
  borderHover: '#3A3F4C',
  borderFocus: '#8585F5',
  destructive: '#F06A6A',
  destructiveForeground: '#FFFFFF',
  success: '#42BD89',
  successForeground: '#FFFFFF',
  warning: '#E8B451',
  warningForeground: '#111318',
};

export const themeConfig = {
  defaultTheme: 'system' as const,
  storageKey: 'mercora-theme',
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
} as const;
