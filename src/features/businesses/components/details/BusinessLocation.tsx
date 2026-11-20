"use client";

import React, { useState } from "react";
import { Navigation, MapPin, ExternalLink, Loader2, Maximize2, X } from "lucide-react";
import { Business } from "../../types/business.types";
import { APP_HEADERS } from "@/config/headers.config";

export interface BusinessLocationProps {
  business: Business;
}

export function BusinessLocation({ business }: BusinessLocationProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryParts = [
    business.name,
    business.address,
    business.city,
    business.state,
    business.pincode,
  ].filter(Boolean).join(", ");

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryParts)}`;
  const iframeSrc = `https://maps.google.com/maps?q=${encodeURIComponent(queryParts)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Operational Location & Directions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Registered industrial premises and dispatch warehouse.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            aria-label="Expand Map"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Expand Map</span>
          </button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all shadow-sm w-fit"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{APP_HEADERS.businessDetails.actions.getDirections}</span>
          </a>
        </div>
      </div>

      {/* Interactive Map Iframe Container */}
      <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-inner group">
        {!mapLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500">
            <Loader2 className="w-7 h-7 text-red-600 animate-spin mb-2" />
            <span className="text-xs font-semibold">Loading interactive map...</span>
          </div>
        )}

        <iframe
          src={iframeSrc}
          title={`${business.name} location map`}
          width="100%"
          height="100%"
          className="w-full h-full border-0 rounded-2xl"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setMapLoaded(true)}
        />

        {/* Floating Quick Action Overlay */}
        <div className="absolute bottom-3 right-3 z-20">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-md hover:bg-white dark:hover:bg-slate-900 hover:text-red-600 transition-colors backdrop-blur-xs border border-slate-200/80 dark:border-slate-700"
          >
            <MapPin className="w-3.5 h-3.5 text-red-600" />
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Location Details Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
          <span className="text-slate-400 block mb-0.5">District / City</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{business.city}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
          <span className="text-slate-400 block mb-0.5">State</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{business.state}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
          <span className="text-slate-400 block mb-0.5">Postal Code</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{business.pincode}</span>
        </div>
      </div>

      {/* Expanded Map Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-4xl h-[80vh] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {business.name} — Interactive Map
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close Map"
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 w-full h-full bg-slate-100 dark:bg-slate-800">
              <iframe
                src={iframeSrc}
                title={`${business.name} full map`}
                width="100%"
                height="100%"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
