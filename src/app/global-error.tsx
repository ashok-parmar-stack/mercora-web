"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-900 text-white font-sans">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center space-y-4">
          <h2 className="text-2xl font-black text-red-500">System Error</h2>
          <p className="text-sm text-slate-300">
            An unexpected application error occurred.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
