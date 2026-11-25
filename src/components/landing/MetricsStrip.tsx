import React from "react";

export function MetricsStrip() {
  return (
    <section
      id="operating-view"
      className="w-full border-y border-[#EFE1E6] bg-[#FFF8F6] py-6 sm:py-8 transition-colors select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-center">
          {/* Column 1: Context note */}
          <div className="text-left border-b sm:border-b-0 sm:border-r border-[#EFE1E6] pb-4 sm:pb-0 pr-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              One connected operating view
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Illustrative product preview, not live platform data.
            </p>
          </div>

          {/* Column 2: 06 profiles */}
          <div className="text-left border-b sm:border-b-0 lg:border-r border-[#EFE1E6] pb-4 sm:pb-0 sm:pl-4 lg:pl-0 lg:pr-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#7F1D3F] tracking-tight">
              06
            </div>
            <div className="text-xs text-slate-600 font-medium mt-0.5">
              categorized partner profiles
            </div>
          </div>

          {/* Column 3: 04 categories */}
          <div className="text-left border-b sm:border-b-0 sm:border-r border-[#EFE1E6] pb-4 sm:pb-0 pr-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#7F1D3F] tracking-tight">
              04
            </div>
            <div className="text-xs text-slate-600 font-medium mt-0.5">
              business categories
            </div>
          </div>

          {/* Column 4: 03 steps */}
          <div className="text-left sm:pl-4 lg:pl-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#7F1D3F] tracking-tight">
              03
            </div>
            <div className="text-xs text-slate-600 font-medium mt-0.5">
              structured execution steps
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MetricsStrip;