import React from 'react';

export function LoginFormHeader() {
  return (
    <div className="mb-6 text-center space-y-1.5">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
        Welcome Back
      </h1>
      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
        Sign in to your enterprise control plane and master data catalog.
      </p>
    </div>
  );
}
