import React from "react";
import { Wrench, CheckCircle } from "lucide-react";
import { Business } from "../../types/business.types";
import { EmptyState } from "@/components/common/EmptyState";
import { APP_MESSAGES } from "@/config/messages.config";

export interface BusinessServicesProps {
  business: Business;
}

export function BusinessServices({ business }: BusinessServicesProps) {
  const services = [
    { title: "OEM & Custom Manufacturing", desc: "Tailored industrial fabrication per client blueprints and tolerances." },
    { title: "Bulk Wholesale Distribution", desc: "Pan-India dispatch with GST compliant consignment tracking." },
    { title: "Quality Certification", desc: "Factory inspection, batch testing, and ISO grade verification." },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
        Specialized Services & Capabilities
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {services.map((srv, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2"
          >
            <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {srv.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {srv.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
