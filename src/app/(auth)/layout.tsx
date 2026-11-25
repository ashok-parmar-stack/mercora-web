import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Building2, Users2 } from 'lucide-react';
import { RotatingGlobe } from './login/components/RotatingGlobe';
import { getServerAuth } from '@/lib/server-auth';
import { AuthRouteGuard } from './components/AuthRouteGuard';
import { AuthBackgroundRibbons } from './components/AuthBackgroundRibbons';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sign In — Mercora',
  description: 'Enterprise B2B Business Intelligence & Data Engine Authentication.',
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getServerAuth();
  if (auth.isAuthenticated) {
    redirect('/admin');
  }
  return (
    <div className="min-h-screen md:h-screen md:max-h-screen w-full flex flex-col md:flex-row font-sans relative overflow-x-hidden md:overflow-hidden bg-[#FAF3F5] text-[#2B1220] selection:bg-[#7F1D3F]/20 selection:text-[#7F1D3F]">
      {/* ── CSS KEYFRAME ANIMATIONS & RESPONSIVE SCROLL OPTIMIZATION ── */}
      <style>{`
        /* Lock HTML and BODY on desktop/tablet to prevent dual window scrollbars, allow natural flow on mobile */
        @media (min-width: 768px) {
          html, body {
            height: 100% !important;
            max-height: 100% !important;
            overflow: hidden !important;
          }
        }
        @media (max-width: 767px) {
          html, body {
            min-height: 100% !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
          }
        }

        /* Prevent browser autofill from turning inputs light blue */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
          -webkit-text-fill-color: #2b1220 !important;
          caret-color: #2b1220 !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        @keyframes sine-wave-float {
          0%, 100% { transform: translateY(0px) scaleY(1); }
          50% { transform: translateY(-6px) scaleY(1.02); }
        }
        @keyframes ambient-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.04); }
        }
      `}</style>

      {/* ── SMOOTH AMBIENT CANVAS BACKGROUND ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(circle at 10% 12%, rgba(242, 217, 223, 0.75) 0%, transparent 45%),
            radial-gradient(circle at 35% 88%, rgba(229, 212, 218, 0.45) 0%, transparent 42%),
            radial-gradient(circle at 80% 15%, rgba(127, 29, 63, 0.06) 0%, transparent 50%),
            #FAF3F5
          `,
        }}
      />

      {/* ── LUXURY ORGANIC SILK FLUID CURVES ── */}
      <AuthBackgroundRibbons />

      {/* ── LEFT COLUMN: Login Form Area (Responsive 50% split on desktop, full width on mobile) ── */}
      <div className="w-full md:w-1/2 lg:w-[50%] xl:w-[48%] 2xl:w-[46%] h-full min-h-0 min-w-0 flex-1 flex flex-col items-center justify-start md:justify-center px-4 sm:px-6 md:px-8 xl:px-12 py-6 sm:py-8 md:py-4 z-10 relative overflow-y-auto overflow-x-hidden">
        {/* Soft Ambient Silk Ribbon for Left Corner (strictly tucked at top right, non-overlapping) */}
        <div className="hidden md:block absolute top-0 right-0 w-[180px] h-[90px] pointer-events-none z-0 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 180 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 180,0 C 130,12 85,35 45,90 L 180,90 Z" fill="url(#berry-top-corner)" opacity="0.2" />
            <defs>
              <linearGradient id="berry-top-corner" x1="180" y1="0" x2="45" y2="90" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A63D5A" />
                <stop offset="1" stopColor="#7F1D3F" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="w-full max-w-[400px] sm:max-w-[420px] xl:max-w-[440px] mx-auto my-auto flex flex-col justify-center relative z-10">
          <AuthRouteGuard>{children}</AuthRouteGuard>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Dark Hero Card with 3D Rotating Globe (Clean 50% split on desktop) ── */}
      <div className="hidden md:flex md:w-1/2 lg:w-[50%] xl:w-[52%] 2xl:w-[54%] h-full min-h-0 min-w-0 p-2.5 sm:p-3 md:p-3.5 lg:p-4 xl:p-5 shrink-0">
        <div className="relative w-full h-full rounded-[24px] xl:rounded-[30px] overflow-hidden flex flex-col justify-between p-5 md:p-6 lg:p-8 2xl:p-10 bg-gradient-to-br from-[#12040E] via-[#200B1A] to-[#0E030B] border border-white/10 shadow-2xl text-white">
          {/* Ambient Lighting Gradients */}
          <div
            className="absolute top-1/2 -translate-y-1/2 right-4 w-[360px] md:w-[400px] lg:w-[460px] h-[360px] md:h-[400px] lg:h-[460px] rounded-full pointer-events-none opacity-50 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #A63D5A 0%, #7F1D3F 45%, transparent 75%)',
              animation: 'ambient-pulse 7s ease-in-out infinite',
            }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full pointer-events-none opacity-30 blur-3xl"
            style={{ background: 'radial-gradient(circle, #7F1D3F 0%, transparent 70%)' }}
          />

          {/* ── 3D ROTATING GLOBE (Responsive sizing & placement) ── */}
          <div className="absolute top-1/2 -translate-y-1/2 -right-12 md:-right-8 lg:-right-4 xl:right-2 2xl:right-6 w-[320px] md:w-[360px] lg:w-[420px] xl:w-[480px] 2xl:w-[510px] h-[320px] md:h-[360px] lg:h-[420px] xl:h-[480px] 2xl:h-[510px] pointer-events-none select-none z-0">
            <RotatingGlobe />
          </div>

          {/* ── BOTTOM LUMINOUS SILK RIBBON WAVES ── */}
          <div
            className="absolute -bottom-2 -left-10 -right-10 h-32 md:h-36 pointer-events-none z-0 overflow-hidden"
            style={{ animation: 'sine-wave-float 6s ease-in-out infinite' }}
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 900 240"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="silk-wave-1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7F1D3F" stopOpacity="0" />
                  <stop offset="35%" stopColor="#A63D5A" stopOpacity="0.45" />
                  <stop offset="65%" stopColor="#E85D75" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#7F1D3F" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="silk-wave-2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E85D75" stopOpacity="0" />
                  <stop offset="50%" stopColor="#FF85A1" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#7F1D3F" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="silk-wave-3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#641631" stopOpacity="0" />
                  <stop offset="60%" stopColor="#C08497" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#180814" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path
                d="M 0,165 Q 240,95 480,155 T 900,135 L 900,240 L 0,240 Z"
                fill="url(#silk-wave-1)"
                opacity="0.45"
              />
              <path
                d="M 0,185 Q 320,125 620,185 T 900,155"
                fill="none"
                stroke="url(#silk-wave-2)"
                strokeWidth="2.2"
                opacity="0.75"
              />
              <path
                d="M 0,205 Q 260,155 520,200 T 900,175"
                fill="none"
                stroke="url(#silk-wave-3)"
                strokeWidth="1.6"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* ── TOP BADGE: ENTERPRISE PLATFORM ── */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-3.5 py-1 md:py-1.5 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-md shadow-sm">
              <span className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-[#FF3366] shadow-[0_0_8px_#FF3366] animate-pulse" />
              <span className="text-[10px] md:text-[11px] font-bold tracking-[0.14em] uppercase text-white/90">
                ENTERPRISE PLATFORM
              </span>
            </div>
          </div>

          {/* ── CENTER HEADLINE & CONTENT (Responsive font scaling) ── */}
          <div className="relative z-10 space-y-2.5 md:space-y-3.5 my-auto max-w-xs md:max-w-sm xl:max-w-md">
            <h2 className="text-xl md:text-2xl lg:text-3xl 2xl:text-[34px] font-extrabold text-white leading-[1.22] tracking-tight">
              Empowering global<br />
              trade decisions with<br />
              <span className="text-[#FF4D79] drop-shadow-[0_0_16px_rgba(255,77,121,0.5)]">
                predictive intelligence
              </span><br />
              and actionable insights.
            </h2>

            <p className="text-[11px] md:text-xs xl:text-[13px] text-[#A898A2] leading-relaxed max-w-xs xl:max-w-sm mt-2 md:mt-3">
              The definitive platform for enterprise B2B network analysis, supplier discovery, and deal intelligence.
            </p>

            <div className="w-7 md:w-8 h-1 rounded-full bg-[#FF4D79] shadow-[0_0_8px_rgba(255,77,121,0.6)] mt-2.5 md:mt-3.5" />
          </div>

          {/* ── BOTTOM STATS ROW (Responsive glass cards) ── */}
          <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center gap-2.5 md:gap-3 lg:gap-4 xl:gap-5 pt-2">
            {/* Stat 1: 50K+ Enterprises */}
            <div className="flex items-center gap-2 md:gap-2.5 lg:gap-3 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm shadow-sm">
              <Building2 className="w-4 h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 text-white/80 shrink-0" />
              <div>
                <div className="text-base sm:text-lg xl:text-xl font-extrabold text-white tracking-tight leading-none">
                  50K+
                </div>
                <div className="text-[10px] lg:text-[11px] text-[#A898A2] font-medium mt-0.5 lg:mt-1">
                  Enterprises
                </div>
              </div>
            </div>

            {/* Stat 2: 2M+ Suppliers */}
            <div className="flex items-center gap-2 md:gap-2.5 lg:gap-3 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm shadow-sm">
              <Users2 className="w-4 h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 text-white/80 shrink-0" />
              <div>
                <div className="text-base sm:text-lg xl:text-xl font-extrabold text-white tracking-tight leading-none">
                  2M+
                </div>
                <div className="text-[10px] lg:text-[11px] text-[#A898A2] font-medium mt-0.5 lg:mt-1">
                  Suppliers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}