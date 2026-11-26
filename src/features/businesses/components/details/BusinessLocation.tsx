"use client";

import React, { useState } from "react";
import { Navigation, MapPin, Loader2, Maximize2 } from "lucide-react";
import { Business } from "../../types/business.types";
import { Button } from "@/components/common";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
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
    <div className="bg-surface rounded-3xl border border-border p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-text-primary">
            Operational Location &amp; Directions
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Registered industrial premises and dispatch warehouse.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Maximize2 className="w-3.5 h-3.5" />}
          >
            Expand Map
          </Button>

          <Button
            variant="primary"
            size="sm"
            asChild
          >
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{APP_HEADERS.businessDetails.actions.getDirections}</span>
            </a>
          </Button>
        </div>
      </div>

      {/* Interactive Map Iframe Container */}
      <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-border bg-background-secondary shadow-inner group">
        {!mapLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background-secondary text-text-muted">
            <Loader2 className="w-7 h-7 text-primary animate-spin mb-2" />
            <span className="text-xs font-semibold">Loading interactive map...</span>
          </div>
        )}

        <iframe
          src={iframeSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setMapLoaded(true)}
          className="w-full h-full"
          title={`Map for ${business.name}`}
        />
      </div>

      <div className="p-4 rounded-2xl bg-surface-hover/70 border border-border flex items-start gap-3 text-xs">
        <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-text-primary block">Official Registered Site</span>
          <p className="text-text-secondary mt-0.5 font-normal leading-relaxed">
            {[business.address, business.city, business.state, business.pincode ? `PIN ${business.pincode}` : undefined]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-6">
          <DialogHeader>
            <DialogTitle>{business.name} — Operational Location</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[65vh] rounded-2xl overflow-hidden border border-border mt-2">
            <iframe
              src={iframeSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
              title={`Expanded map for ${business.name}`}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
