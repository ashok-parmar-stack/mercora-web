import React from "react";
import { Compass, Zap, Sliders } from "lucide-react";

export function WhyMercoraSection() {
  const pillars = [
    {
      id: "discover",
      icon: Compass,
      title: "Discover with context",
      description:
        "Explore businesses by category, geography, and capability in a structured directory.",
    },
    {
      id: "action",
      icon: Zap,
      title: "Turn interest into action",
      description:
        "Move from a promising profile to a focused request without losing the business context.",
    },
    {
      id: "clarity",
      icon: Sliders,
      title: "Operate with clarity",
      description:
        "Bring discovery, requests, and ecosystem information into a more coherent workflow.",
    },
  ];

  return (
    <section
      id="why-mercora"
      className="py-18 sm:py-24 bg-[#FFF8F6] text-slate-900 transition-colors select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-2xl mb-12 sm:mb-16 text-left">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold tracking-widest text-[#7F1D3F] uppercase">
            <span className="w-4 h-[1.5px] bg-[#7F1D3F]" />
            <span>WHY MERCORA</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-slate-900 leading-[1.18] mb-4">
            Business information that leads somewhere.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Less time piecing together scattered details. More clarity on who to
            work with, what they offer, and what should happen next.
          </p>
        </div>

        {/* 3 Pillar Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="bg-white rounded-2xl p-7 sm:p-8 border border-[#EFE1E6] shadow-xs hover:shadow-md hover:border-[#DDBDC9] transition-all duration-200 flex flex-col justify-between text-left"
              >
                <div>
                  {/* Icon with soft blush container */}
                  <div className="w-12 h-12 rounded-xl bg-[#FDF0F3] text-[#7F1D3F] flex items-center justify-center mb-6 shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyMercoraSection;