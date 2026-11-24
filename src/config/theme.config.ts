/**
 * Centralized Theme Configuration
 * Official Canva Design Specification for Mercora
 */

export interface ThemeColors {
  background: string;
  backgroundSecondary: string;
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
  secondaryBrand: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentSoft: string;
  accentForeground: string;
  border: string;
  borderHover: string;
  borderFocus: string;
  destructive: string;
  destructiveHover: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  info: string;
  infoForeground: string;
  navigationDark: string;
}

export const lightTheme: ThemeColors = {
  background: '#FFF7F5',
  backgroundSecondary: '#F9EDEF',
  foreground: '#3F2932',
  surface: '#FFFFFF',
  surfaceRaised: '#FFFFFF',
  surfaceHover: '#FBF2F4',
  surfaceActive: '#F5E2E6',
  primary: '#7F1D3F',
  primaryHover: '#641631',
  primaryActive: '#521127',
  primaryForeground: '#FFFFFF',
  secondary: '#F9EDEF',
  secondaryForeground: '#3F2932',
  secondaryBrand: '#A63D5A',
  muted: '#F9EDEF',
  mutedForeground: '#765C67',
  accent: '#C08497',
  accentSoft: '#F2D9DF',
  accentForeground: '#2B1220',
  border: '#E5D4DA',
  borderHover: '#C08497',
  borderFocus: '#7F1D3F',
  destructive: '#B42318',
  destructiveHover: '#961C13',
  destructiveForeground: '#FFFFFF',
  success: '#16846A',
  successForeground: '#FFFFFF',
  warning: '#B7791F',
  warningForeground: '#FFFFFF',
  info: '#356AE6',
  infoForeground: '#FFFFFF',
  navigationDark: '#2B1220',
};

export const darkTheme: ThemeColors = {
  background: '#171018',
  backgroundSecondary: '#211722',
  foreground: '#FFF7F5',
  surface: '#211722',
  surfaceRaised: '#2C1E2D',
  surfaceHover: '#362537',
  surfaceActive: '#422E44',
  primary: '#C45A83',
  primaryHover: '#D8799C',
  primaryActive: '#A63D5A',
  primaryForeground: '#FFFFFF',
  secondary: '#30212D',
  secondaryForeground: '#FFF7F5',
  secondaryBrand: '#A63D5A',
  muted: '#211722',
  mutedForeground: '#B9A7B0',
  accent: '#7F1D3F',
  accentSoft: 'rgba(127, 29, 63, 0.25)',
  accentForeground: '#FFF7F5',
  border: '#45313D',
  borderHover: '#5C4252',
  borderFocus: '#C45A83',
  destructive: '#F06A6A',
  destructiveHover: '#E54848',
  destructiveForeground: '#FFFFFF',
  success: '#42BD89',
  successForeground: '#FFFFFF',
  warning: '#E8B451',
  warningForeground: '#171018',
  info: '#5C8FF7',
  infoForeground: '#FFFFFF',
  navigationDark: '#120A13',
};

export const themeConfig = {
  defaultTheme: 'light',
  storageKey: 'mercora-theme',
  colors: {
    light: lightTheme,
    dark: darkTheme,
  },
};

export default themeConfig;
