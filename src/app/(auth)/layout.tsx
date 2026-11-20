import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Logo } from '@/components/Logo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Authentication — Mercora',
  description: 'Enterprise B2B Business Intelligence & Data Engine Authentication.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden flex flex-col lg:flex-row relative font-sans select-none bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-200">
      {/* ── LEFT COLUMN: Form ───────────────────────────────────────────────── */}
      <div className="flex-1 h-full overflow-y-auto lg:overflow-hidden flex flex-col justify-center px-6 sm:px-10 lg:px-12 xl:px-16 py-4 sm:py-6 lg:py-6 z-10 relative">

        {/* Subtle red radial glow bottom-left */}
        <div
          className="absolute -bottom-48 -left-48 w-[560px] h-[560px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(238,49,53,0.07) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <div className="w-full max-w-[420px] mx-auto relative my-auto">
          {/* Centered Logo */}
          <div className="flex justify-center mb-4 sm:mb-5">
            <Link href="/" className="inline-flex items-center justify-center transition-transform hover:scale-105 duration-200">
              <Logo height={32} />
            </Link>
          </div>

          {/* Page Content */}
          {children}
        </div>
      </div>

      {/* ── RIGHT COLUMN: Dark animated panel ──────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[50%] h-full p-4 lg:p-5 shrink-0">
        <div
          className="relative w-full h-full rounded-[28px] overflow-hidden flex flex-col justify-between p-10 xl:p-12 bg-[#090d16] border border-white/10 shadow-2xl"
        >
          {/* Animated SVG mesh background */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 800 900"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <radialGradient id="glow1" cx="70%" cy="20%" r="50%">
                <stop offset="0%" stopColor="#ee3135" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#ee3135" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="glow2" cx="20%" cy="80%" r="45%">
                <stop offset="0%" stopColor="#ee3135" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#ee3135" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Glow blobs */}
            <ellipse cx="560" cy="180" rx="320" ry="280" fill="url(#glow1)" />
            <ellipse cx="160" cy="720" rx="280" ry="240" fill="url(#glow2)" />

            {/* Geometric mesh lines */}
            {[
              'M 0,200 L 200,80 L 400,200 L 600,60 L 800,180',
              'M 0,350 L 150,250 L 350,380 L 550,220 L 800,320',
              'M 0,520 L 250,420 L 450,540 L 700,380 L 800,480',
              'M 0,680 L 200,580 L 400,700 L 650,560 L 800,640',
              'M 200,0 L 300,200 L 200,400 L 350,600 L 280,800',
              'M 450,0 L 520,180 L 420,380 L 580,560 L 500,800',
              'M 700,0 L 650,200 L 750,400 L 680,600 L 730,800',
            ].map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="#ee3135"
                strokeWidth="0.7"
                strokeOpacity={0.18 + (i % 3) * 0.04}
              />
            ))}

            {/* Connector dots at intersections */}
            {[
              [200, 80], [400, 200], [600, 60],
              [150, 250], [350, 380], [550, 220],
              [250, 420], [450, 540], [700, 380],
              [200, 580], [400, 700], [650, 560],
              [300, 200], [520, 180], [650, 200],
              [420, 380], [350, 600], [580, 560],
            ].map(([cx, cy], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={i % 4 === 0 ? 3.5 : i % 3 === 0 ? 2.5 : 1.8}
                fill="#ee3135"
                fillOpacity={i % 4 === 0 ? 0.65 : 0.35}
              />
            ))}
          </svg>

          {/* Top badge */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-red)] animate-pulse" />
              <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-white/60 font-rethink">
                Enterprise Platform
              </span>
            </div>
          </div>

          {/* Center quote */}
          <div className="relative z-10 space-y-6">
            <div
              className="w-10 h-[3px] rounded-full"
              style={{ background: 'var(--theme-red)' }}
            />
            <blockquote className="text-white text-2xl xl:text-[28px] font-bold leading-snug tracking-tight font-jakarta">
              "Empowering global trade decisions with{' '}
              <span style={{ color: 'var(--theme-red)' }}>predictive intelligence</span>{' '}
              and actionable insights."
            </blockquote>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs font-work">
              The definitive platform for enterprise B2B network analysis, supplier discovery, and deal intelligence.
            </p>
          </div>

          {/* Bottom stats */}
          <div className="relative z-10 grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
            {[
              { value: '50K+', label: 'Enterprises' },
              { value: '2M+', label: 'Suppliers' },
              { value: '120+', label: 'Countries' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-xl font-extrabold text-white tracking-tight font-instrument">{value}</div>
                <div className="text-[11px] text-white/40 font-medium mt-0.5 font-rethink">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
