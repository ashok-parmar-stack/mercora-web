import React from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
 * Mercora Official Brand Logo Components
 * Pure, crisp vector SVG with zero pixelation and transparent background.
 * ─────────────────────────────────────────────────────────────────────────────*/

export interface LogoProps {
  /** Height in px for the full logo (default 34) */
  height?: number;
  /** Whether to render the dark-mode variant */
  dark?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface LogoIconProps {
  /** Size in px for the square emblem (default 34) */
  size?: number;
  dark?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Official Mercora Square Brand Icon Emblem
 */
export function LogoIcon({
  size = 34,
  dark,
  className = '',
  style,
}: LogoIconProps) {
  const inkColor = dark !== undefined ? (dark ? '#FFFFFF' : '#1D2027') : 'var(--text-primary, #1D2027)';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 1000"
      width={size}
      height={size}
      fill="none"
      className={`select-none flex-shrink-0 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-block',
        ...style,
      }}
      aria-label="Mercora Emblem"
    >
      {/* Obsidian Geometric M Body */}
      <path
        d="M 117 163.5 L 117 711.5 L 287 813.5 L 287 446.5 L 500 571.5 L 883 351.5 L 883 163.5 L 500 382.5 Z"
        fill={inkColor}
      />
      {/* Brand Primary Accent Pillar */}
      <path
        d="M 693 511.5 L 693 836.5 L 883 724.5 L 883 397.5 Z"
        fill="var(--primary, #7F1D3F)"
      />
    </svg>
  );
}

/**
 * Full Official Mercora Wordmark + Emblem Logo
 * Zero font drift, zero collision, natural Plus Jakarta Sans letter kerning.
 */
export function Logo({
  height = 34,
  dark,
  className = '',
  style,
}: LogoProps) {
  const inkColor = dark !== undefined ? (dark ? '#FFFFFF' : '#1D2027') : 'var(--text-primary, #1D2027)';
  // Aspect ratio is 980 / 240 = ~4.08
  const width = Math.round(height * 4.1);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 980 240"
      height={height}
      width={width}
      fill="none"
      className={`select-none flex-shrink-0 ${className}`}
      style={{
        height: `${height}px`,
        width: `${width}px`,
        maxWidth: '100%',
        display: 'inline-block',
        ...style,
      }}
      aria-label="Mercora"
    >
      <defs>
        <style>{`
          .mercora-wordmark {
            font-family: var(--font-jakarta), var(--font-display), 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            font-weight: 800;
            font-size: 132px;
            letter-spacing: 0.04em;
          }
        `}</style>
      </defs>

      {/* 1. Emblem (Geometric M Mark) */}
      <g transform="translate(15, 20) scale(0.2)">
        <path
          d="M 117 163.5 L 117 711.5 L 287 813.5 L 287 446.5 L 500 571.5 L 883 351.5 L 883 163.5 L 500 382.5 Z"
          fill={inkColor}
        />
        <path
          d="M 693 511.5 L 693 836.5 L 883 724.5 L 883 397.5 Z"
          fill="var(--primary, #7F1D3F)"
        />
      </g>

      {/* 2. Unified Wordmark: "MERCORA" with Signature Primary 'A' */}
      <text
        x="230"
        y="164"
        className="mercora-wordmark"
        fill={inkColor}
      >
        MERCOR<tspan fill="var(--primary, #7F1D3F)">A</tspan>
      </text>
    </svg>
  );
}

export default Logo;
