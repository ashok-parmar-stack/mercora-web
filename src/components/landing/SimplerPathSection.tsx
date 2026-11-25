import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SimplerPathSection() {
  const steps = [
    {
      number: "01",
      title: "Find the right fit",
      description: "Search by business, category, license, or capability.",
    },
    {
      number: "02",
      title: "Understand the business",
      description:
        "Review a structured profile before starting the conversation.",
    },
    {
      number: "03",
      title: "Move the deal forward",
      description:
        "Submit an enquiry with the context needed for follow-up.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-18 sm:py-24 bg-[#F5EBEF] border-y border-[#E9DFE4] text-slate-900 transition-colors select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Headline and Link */}
          <div className="lg:col-span-5 text-left">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold tracking-widest text-[#7F1D3F] uppercase">
              <span className="w-4 h-[1.5px] bg-[#7F1D3F]" />
              <span>A SIMPLER PATH FOR SALES</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-slate-900 leading-[1.18] mb-4">
              From first search to next step.
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6 font-normal">
              Mercora is designed around the moments that turn business
              information into useful progress.
            </p>

            <Link
              href="/businesses"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#7F1D3F] hover:text-[#99224B] transition-colors group"
            >
              <span className="border-b border-[#7F1D3F]/30 pb-0.5 group-hover:border-[#7F1D3F]">
                Explore sample businesses
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Right Column: 3 Stacked Numbered Step Cards */}
          <div className="lg:col-span-7 space-y-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-white rounded-xl p-5 sm:p-6 border border-[#E8DFE3] shadow-xs flex items-center gap-5 sm:gap-6 text-left hover:border-[#DDBDC9] transition-all"
              >
                <div className="text-xl sm:text-2xl font-extrabold text-[#7F1D3F] shrink-0 tracking-tight">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SimplerPathSection;