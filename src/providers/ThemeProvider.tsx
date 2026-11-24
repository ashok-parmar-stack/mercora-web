"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import themeConfigDefault, { themeConfig as namedThemeConfig } from "@/config/theme.config";

const activeThemeConfig = themeConfigDefault || namedThemeConfig || {
  defaultTheme: "light",
  storageKey: "mercora-theme",
};

export interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
  forcedTheme?: string;
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = activeThemeConfig?.defaultTheme || "light",
  storageKey = activeThemeConfig?.storageKey || "mercora-theme",
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute as any}
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export default ThemeProvider;
