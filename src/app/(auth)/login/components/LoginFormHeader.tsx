import React from 'react';

export function LoginFormHeader() {
  return (
    <div className="mb-3.5 sm:mb-4 text-center">
      <h1
        className="text-xl sm:text-2xl font-extrabold tracking-[-0.03em] mb-1 font-jakarta"
        style={{ color: 'var(--theme-ink-darkest)', lineHeight: 1.2 }}
      >
        Welcome back
      </h1>
      <p className="text-xs font-work" style={{ color: 'var(--theme-gray-600)', lineHeight: 1.5 }}>
        Your listings, contacts & market intel — just where you left them.
      </p>
    </div>
  );
}
