import React from "react";
import Link from "next/link";
import { X, Pencil } from "lucide-react";
import { Country } from "@mercora/shared-types";

interface CountryDetailModalProps {
  country: Country | null;
  onClose: () => void;
}

export function CountryDetailModal({ country, onClose }: CountryDetailModalProps) {
  if (!country) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="w-7 h-5 rounded bg-gray-100 border text-xs font-bold flex items-center justify-center">
              {country.iso2Code}
            </span>
            <h3 className="font-extrabold text-gray-900 text-sm">
              {country.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4 text-xs">
          <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase">
              Official Name
            </span>
            <span className="font-semibold text-gray-800 text-sm">
              {country.officialName || country.name}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-100">
            <div>
              <span className="text-gray-400 block">ISO Alpha-2:</span>
              <b className="font-mono text-gray-800">{country.iso2Code}</b>
            </div>
            <div>
              <span className="text-gray-400 block">ISO Alpha-3:</span>
              <b className="font-mono text-gray-800">{country.iso3Code}</b>
            </div>
            <div>
              <span className="text-gray-400 block">Numeric Code:</span>
              <b className="font-mono text-gray-800">{country.numericCode || "—"}</b>
            </div>
            <div>
              <span className="text-gray-400 block">Phone Code:</span>
              <b className="font-mono text-gray-800">
                {country.phoneCode ? `+${country.phoneCode.replace("+", "")}` : "—"}
              </b>
            </div>
            <div>
              <span className="text-gray-400 block">Currency:</span>
              <b className="font-mono text-gray-800">{country.currencyCode || "—"}</b>
            </div>
            <div>
              <span className="text-gray-400 block">Source:</span>
              <b className="text-gray-800">{country.source || "MANUAL"}</b>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-[11px] text-gray-500">
            <div>Internal UUID: <span className="font-mono text-[10px]">{country.id}</span></div>
            <div>Created: <span>{new Date(country.createdAt).toLocaleString()}</span></div>
          </div>
        </div>

        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <Link
            href={`/admin/countries/${country.id}/edit`}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
          >
            <Pencil className="w-3.5 h-3.5" />
            Open in Edit Page →
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
