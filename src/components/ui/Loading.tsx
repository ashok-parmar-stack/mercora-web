'use client';

import React from 'react';
import { LogoIcon } from '../Logo';

export * from './Skeleton';

/* ─────────────────────────────────────────────────────────────────────────────
 * Mercora Theme Design System - Loading Components
 * ─────────────────────────────────────────────────────────────────────────────*/

export interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'red' | 'white' | 'muted' | 'current';
  className?: string;
  label?: string;
}

/**
 * High-performance theme spinner.
 */
export function LoadingSpinner({
  size = 'md',
  variant = 'primary',
  className = '',
  label = 'Loading...',
}: LoadingSpinnerProps) {
  const sizeMap = {
    xs: 'w-3.5 h-3.5 border-2',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-[2.5px]',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  const variantMap = {
    primary: 'border-[var(--primary)]/20 border-t-[var(--primary)]',
    red: 'border-[var(--theme-red)]/20 border-t-[var(--theme-red)]',
    white: 'border-white/25 border-t-white',
    muted: 'border-[var(--border)] border-t-[var(--text-secondary)]',
    current: 'border-current/25 border-t-current',
  };

  return (
    <div
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
    >
      <div
        className={`rounded-full animate-spin transition-colors ${sizeMap[size]} ${variantMap[variant]}`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

/* ── Branded Mercora Logo Loader ─────────────────────────────────────────── */

export interface LogoLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  subtext?: string;
  className?: string;
  dark?: boolean;
}

/**
 * Clean, high-precision Mercora Logo loader with crisp vector geometry and zero blur.
 */
export function LogoLoader({
  size = 'md',
  text,
  subtext,
  className = '',
  dark,
}: LogoLoaderProps) {
  const config = {
    sm: {
      box: 'w-14 h-14',
      emblem: 'w-[42px] h-[42px]',
      icon: 22,
      title: 'text-xs',
      sub: 'text-[11px]',
    },
    md: {
      box: 'w-20 h-20',
      emblem: 'w-16 h-16',
      icon: 34,
      title: 'text-sm',
      sub: 'text-xs',
    },
    lg: {
      box: 'w-28 h-28',
      emblem: 'w-[88px] h-[88px]',
      icon: 46,
      title: 'text-base',
      sub: 'text-sm',
    },
    xl: {
      box: 'w-36 h-36',
      emblem: 'w-28 h-28',
      icon: 58,
      title: 'text-lg',
      sub: 'text-base',
    },
  }[size] || {
    box: 'w-28 h-28',
    emblem: 'w-[88px] h-[88px]',
    icon: 46,
    title: 'text-base',
    sub: 'text-sm',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center p-2 text-center select-none ${className}`}
    >
      {/* Crisp Spinner & Logo Container */}
      <div className={`relative ${config.box} flex items-center justify-center`}>
        {/* Precision Bezel Spinner Ring */}
        <svg
          className="absolute inset-0 w-full h-full animate-spin"
          viewBox="0 0 64 64"
          fill="none"
          style={{ animationDuration: '1.2s', animationTimingFunction: 'linear' }}
        >
          <circle
            cx="32"
            cy="32"
            r="27.5"
            stroke="var(--border, rgba(15, 23, 42, 0.08))"
            strokeWidth="1.8"
          />
          <circle
            cx="32"
            cy="32"
            r="27.5"
            stroke="var(--primary, var(--theme-red, #ee3135))"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeDasharray="44 130"
          />
        </svg>

        {/* Center Circular Emblem with Razor-Sharp Logo */}
        <div
          className={`${config.emblem} rounded-full flex items-center justify-center relative z-10 transition-all`}
          style={{
            background: 'var(--surface, #ffffff)',
            border: '1px solid var(--border, rgba(15, 23, 42, 0.08))',
            boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
          }}
        >
          <LogoIcon size={config.icon} dark={dark} />
        </div>
      </div>

      {text && (
        <p
          className={`mt-3.5 font-bold tracking-tight font-jakarta ${config.title}`}
          style={{ color: 'var(--text-primary, var(--theme-ink-darkest, #0f172a))' }}
        >
          {text}
        </p>
      )}

      {subtext && (
        <p
          className={`mt-1 font-work font-medium ${config.sub}`}
          style={{ color: 'var(--text-muted, var(--theme-gray-500, #64748b))' }}
        >
          {subtext}
        </p>
      )}

      <span className="sr-only">{text || 'Loading'}</span>
    </div>
  );
}

/* ── Fullscreen or Container Overlay Loader ───────────────────────────────── */

export interface PageLoaderProps {
  text?: string;
  subtext?: string;
  fullscreen?: boolean;
}

export function PageLoader({
  text,
  subtext,
  fullscreen = true,
}: PageLoaderProps) {
  return (
    <div
      className={`${
        fullscreen ? 'fixed inset-0 z-50' : 'relative w-full min-h-[360px]'
      } flex items-center justify-center bg-[var(--background)]/80 backdrop-blur-xs transition-all duration-300`}
    >
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
        <LogoLoader size="md" text={text} subtext={subtext} />
      </div>
    </div>
  );
}
