"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { themeConfig } from "@/config/theme.config";

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={themeConfig.defaultTheme}
      storageKey={themeConfig.storageKey}
      enableSystem={true}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
