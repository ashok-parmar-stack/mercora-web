import React from "react";

export function AuthBackgroundRibbons() {
  return (
    <>
      {/* 1. Top-Left Silk Flow (Soft rosy blush ribbons curving down) */}
      <div className="absolute top-0 left-0 w-[240px] sm:w-[320px] md:w-[420px] h-[200px] sm:h-[260px] md:h-[360px] pointer-events-none z-0 overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 420 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M -40,-40 C 80,60 180,110 260,80 C 340,50 390,140 420,240 L 420,-40 Z"
            fill="url(#silk-top-1)"
            opacity="0.55"
          />
          <path
            d="M -40,-40 C 60,110 140,160 210,130 C 290,100 310,210 340,300 L -40,300 Z"
            fill="url(#silk-top-2)"
            opacity="0.35"
          />
          <defs>
            <linearGradient id="silk-top-1" x1="0" y1="0" x2="380" y2="240" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F6DFE7" />
              <stop offset="0.6" stopColor="#FBF0F4" />
              <stop offset="1" stopColor="#FAF3F5" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="silk-top-2" x1="-40" y1="-40" x2="300" y2="300" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ECD3DC" />
              <stop offset="0.7" stopColor="#F8E8EE" />
              <stop offset="1" stopColor="#FAF3F5" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 2. Bottom-Left Silk Flow (Soft blush ribbons curving up) */}
      <div className="absolute bottom-0 left-0 w-[220px] sm:w-[280px] md:w-[380px] h-[180px] sm:h-[240px] md:h-[320px] pointer-events-none z-0 overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 380 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M -40,360 C 90,260 160,280 240,210 C 320,140 340,60 380,0 L -40,0 Z"
            fill="url(#silk-btm-1)"
            opacity="0.4"
          />
          <defs>
            <linearGradient id="silk-btm-1" x1="-40" y1="360" x2="340" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F2D7E0" />
              <stop offset="0.6" stopColor="#F9ECF1" />
              <stop offset="1" stopColor="#FAF3F5" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  );
}
