"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Building2, Calendar, Users, Briefcase, Bookmark, Share2, Mail } from "lucide-react";
import { Business } from "../../types/business.types";
import { BusinessBadge } from "../shared/BusinessBadge";
import { Button } from "@/components/common";
import { APP_HEADERS } from "@/config/headers.config";

const DEFAULT_BANNER_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80";

export interface BusinessProfileHeaderProps {
  business: Business;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
  onContactClick?: () => void;
  onShareClick?: () => void;
}

export function BusinessProfileHeader({
  business,
  activeTab,
  onTabChange,
  isSaved = false,
  onToggleSave,
  onContactClick,
  onShareClick,
}: BusinessProfileHeaderProps) {
  const [bannerSrc, setBannerSrc] = useState(business.imageUrl || DEFAULT_BANNER_IMAGE);

  useEffect(() => {
    setBannerSrc(business.imageUrl || DEFAULT_BANNER_IMAGE);
  }, [business.imageUrl]);

  const tabs = [
    { id: "overview", label: APP_HEADERS.businessDetails.tabs.overview },
    { id: "contact", label: APP_HEADERS.businessDetails.tabs.contact },
    { id: "location", label: APP_HEADERS.businessDetails.tabs.location },
    { id: "reviews", label: APP_HEADERS.businessDetails.tabs.reviews },
  ];

  return (
    <div className="bg-surface rounded-3xl border border-border shadow-xs overflow-hidden">
      {/* Cover / Banner Image */}
      <div className="relative h-48 sm:h-64 w-full bg-sidebar-bg overflow-hidden">
        <Image
          src={bannerSrc}
          alt={business.name}
          fill
          unoptimized
          priority
          sizes="100vw"
          onError={() => setBannerSrc(DEFAULT_BANNER_IMAGE)}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />
      </div>

      {/* Profile Info Bar */}
      <div className="px-6 pb-6 pt-0 sm:px-8 sm:pb-8 relative">
        {/* Top Row: Overlapping Avatar on Left + Action Buttons safely aligned on solid surface */}
        <div className="flex flex-wrap items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-5 relative z-10">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-surface border-4 border-surface shadow-md overflow-hidden flex items-center justify-center flex-shrink-0">
            {business.logoUrl ? (
              <img src={business.logoUrl} alt={business.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-11 h-11 text-primary" />
            )}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap pt-2">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={onContactClick}
              leftIcon={<Mail className="w-4 h-4" />}
            >
              {APP_HEADERS.businessDetails.actions.contactBusiness}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onToggleSave}
              className={`p-2.5 transition-colors ${
                isSaved
                  ? "border-primary/40 bg-primary-soft text-primary hover:bg-primary-soft/80"
                  : ""
              }`}
              aria-label={isSaved ? APP_HEADERS.businessDetails.actions.saved : APP_HEADERS.businessDetails.actions.saveBusiness}
              title={isSaved ? "Saved" : "Save business"}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onShareClick}
              className="p-2.5"
              aria-label="Share profile"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Title, Badge, Metadata & Rating (cleanly inside white surface below cover photo) */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
              {business.name}
            </h1>
            <BusinessBadge isVerified={business.isVerified} tier={business.tier} size="md" />
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-text-secondary">
            <span className="font-semibold text-primary">{business.businessType}</span>
            <span>·</span>
            <span>{business.category}</span>
            <span>·</span>
            <span>
              {[business.city, business.state].filter(Boolean).join(", ")}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2.5">
            <div className="flex items-center text-status-warning">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <span className="text-sm font-bold text-text-primary">{business.rating}</span>
            <span className="text-xs text-text-muted">({business.reviewCount} Reviews)</span>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-2xl bg-background-secondary border border-border text-xs">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-primary" />
            <div>
              <div className="text-text-muted text-[10px] uppercase font-bold">Established</div>
              <div className="font-bold text-text-primary">{business.establishedYear}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <div className="text-text-muted text-[10px] uppercase font-bold">Employees</div>
              <div className="font-bold text-text-primary">{business.employeeCount}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-4 h-4 text-primary" />
            <div>
              <div className="text-text-muted text-[10px] uppercase font-bold">Business Type</div>
              <div className="font-bold text-text-primary">{business.businessType}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-primary" />
            <div>
              <div className="text-text-muted text-[10px] uppercase font-bold">Ownership</div>
              <div className="font-bold text-text-primary">{business.ownershipType || "Private Ltd"}</div>
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 mt-6 border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`pb-3 px-3 text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "text-primary font-extrabold"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
