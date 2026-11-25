"use client";

import React from "react";
import { KeyRound, CheckCircle2, XCircle } from "lucide-react";

const SIMULATED_MODULES = ["Companies", "Trade Data", "Products", "Leads", "Users"];
const SIMULATED_ACTIONS = ["VIEW", "CREATE", "UPDATE", "DELETE"];

export function EffectiveAccessPreviewCard({
  resolveEffectiveStatus,
}: {
  resolveEffectiveStatus: (
    permName: string,
    action: string
  ) => { granted: boolean; isOverride: boolean };
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs flex flex-col gap-4 h-fit">
      <div className="border-b border-gray-100 pb-3">
        <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-purple-600" />
          Effective Access Simulation
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Live evaluation of effective permissions for this user.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {SIMULATED_MODULES.map((moduleName) => (
          <div
            key={moduleName}
            className="border border-gray-100 rounded-lg p-3 bg-gray-50/40 flex flex-col gap-2"
          >
            <div className="font-extrabold text-xs text-gray-900">{moduleName}</div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              {SIMULATED_ACTIONS.map((act) => {
                const status = resolveEffectiveStatus(moduleName, act);
                return (
                  <div
                    key={act}
                    className={`flex items-center justify-between p-1.5 rounded border ${
                      status.granted
                        ? status.isOverride
                          ? "bg-green-50/60 border-green-200 text-green-800"
                          : "bg-white border-gray-200 text-gray-700"
                        : "bg-red-50/60 border-red-200 text-red-800"
                    }`}
                  >
                    <span className="font-mono font-bold text-[10px]">{act}</span>
                    {status.granted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
