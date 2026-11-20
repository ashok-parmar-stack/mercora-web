"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = React.createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
});

export interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
  forcedTheme?: Theme;
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  storageKey = "theme",
  forcedTheme,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">("light");

  const applyTheme = React.useCallback(
    (targetTheme: Theme) => {
      if (typeof window === "undefined") return;
      const root = document.documentElement;
      let effective: "light" | "dark" = "light";

      if (forcedTheme) {
        effective = forcedTheme === "system" ? "light" : forcedTheme;
      } else if (targetTheme === "system" && enableSystem) {
        effective = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      } else {
        effective = targetTheme === "dark" ? "dark" : "light";
      }

      setResolvedTheme(effective);

      if (attribute === "class") {
        root.classList.remove("light", "dark");
        root.classList.add(effective);
      } else {
        root.setAttribute(attribute, effective);
      }
    },
    [attribute, enableSystem, forcedTheme]
  );

  React.useEffect(() => {
    let saved: Theme | null = null;
    try {
      saved = localStorage.getItem(storageKey) as Theme | null;
    } catch {
      // Ignore storage errors
    }
    const initial = saved || defaultTheme;
    setThemeState(initial);
    applyTheme(initial);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      let current: Theme | null = null;
      try {
        current = localStorage.getItem(storageKey) as Theme | null;
      } catch {
        // Ignore
      }
      if (!current || current === "system") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [applyTheme, defaultTheme, storageKey]);

  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {
        // Ignore storage errors
      }
      applyTheme(newTheme);
    },
    [applyTheme, storageKey]
  );

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
    }),
    [theme, setTheme, resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => React.useContext(ThemeContext);
