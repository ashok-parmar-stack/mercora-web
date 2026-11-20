"use client";

import React from "react";
import { useAdminStore } from "../../lib/store/admin-store";
import { Badge } from "../ui/Badge";
import { ShieldCheck } from "lucide-react";

export const PersonaSwitcher: React.FC = () => {
  const { state, setPersonaRole, addToast } = useAdminStore();
  const { persona } = state;

  const personas = [
    { code: "SUPER_ADMIN", name: "Super Administrator", badge: "purple" as const },
    { code: "COMPANY_ADMIN", name: "Company Admin", badge: "brand" as const },
    { code: "STAFF", name: "Operations Staff", badge: "info" as const },
    { code: "BUYER", name: "Standard User / Buyer", badge: "neutral" as const },
  ];

  const handleSelect = (p: typeof personas[0]) => {
    setPersonaRole(p.code, p.name);
    addToast(
      "info",
      `Switched Persona: ${p.name}`,
      `UI capabilities and permissions updated for role [${p.code}]`
    );
  };

  return (
    <div className="bg-white text-gray-900 rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 border border-gray-200">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center font-bold text-xs">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
            Active Role Simulation Mode
            <Badge variant={persona.isSuperAdmin ? "purple" : "warning"} size="sm">
              {persona.roleCode}
            </Badge>
          </div>
          <div className="text-xs text-gray-600 font-medium">
            Currently acting as: <strong className="text-gray-900 font-bold">{persona.roleName}</strong>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">
          Switch Persona:
        </span>
        {personas.map((p) => {
          const isActive = persona.roleCode === p.code;
          return (
            <button
              key={p.code}
              onClick={() => handleSelect(p)}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                isActive
                  ? "bg-brand-500 text-white shadow-xs"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200/80"
              }`}
            >
              {p.code}
            </button>
          );
        })}
      </div>
    </div>
  );
};
