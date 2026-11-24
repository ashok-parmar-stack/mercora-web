"use client";

import React, { useEffect } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { QueryProvider } from "./QueryProvider";
import { GlobalToasts } from "../components/common/GlobalToasts";
import { useAuthStore } from "../lib/store/auth-store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAuthStore.getState().initialize();

    // Default touchstart and touchmove to passive: true to prevent scroll-blocking violations
    if (typeof window !== "undefined" && typeof EventTarget !== "undefined") {
      const originalAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function (
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
      ) {
        let modifiedOptions = options;
        if (type === "touchstart" || type === "touchmove") {
          if (typeof options === "boolean") {
            modifiedOptions = { capture: options, passive: true };
          } else if (typeof options === "object" && options !== null) {
            if (options.passive === undefined) {
              modifiedOptions = { ...options, passive: true };
            }
          } else if (options === undefined) {
            modifiedOptions = { passive: true };
          }
        }
        return originalAddEventListener.call(
          this,
          type,
          listener,
          modifiedOptions as boolean | AddEventListenerOptions
        );
      };
    }
  }, []);

  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={true}
        disableTransitionOnChange={false}
      >
        {children}
        <GlobalToasts />
      </ThemeProvider>
    </QueryProvider>
  );
}
