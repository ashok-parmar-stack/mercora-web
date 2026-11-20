"use client";

import { useEffect } from "react";

/**
 * GlobalWheelHandler prevents accidental increment/decrement of number inputs
 * across the entire application whenever a user scrolls with the mouse wheel
 * over or inside any <input type="number">.
 */
export const GlobalWheelHandler = () => {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        target.tagName === "INPUT" &&
        (target as HTMLInputElement).type === "number"
      ) {
        // Prevent default browser number step on wheel
        e.preventDefault();
        // Unfocus if actively focused to avoid unintended keystroke increments
        if (document.activeElement === target) {
          (target as HTMLInputElement).blur();
        }
      }
    };

    // Attach with passive: false to allow e.preventDefault()
    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return null;
};
