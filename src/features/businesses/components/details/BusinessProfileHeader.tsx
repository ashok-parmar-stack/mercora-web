"use client";

import React from "react";
import Image from "next/image";
import { Star, Building2, Calendar, Users, Briefcase, Bookmark, Share2, Mail } from "lucide-react";
import { Business } from "../../types/business.types";
import { BusinessBadge } from "../shared/BusinessBadge";
import { Button } from "@/components/common";
import { APP_HEADERS } from "@/config/headers.config";

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
  const tabs = [
    { id: "overview", label: APP_HEADERS.businessDetails.tabs.overview },
    { id: "products", label: APP_HEADERS.businessDetails.tabs.products },
    { id: "contact", label: APP_HEADERS.businessDetails.tabs.contact },
    { id: "location", label: APP_HEADERS.businessDetails.tabs.location },
    { id: "reviews", label: APP_HEADERS.businessDetails.tabs.reviews },
  ];

  return (
    <div className="bg-surface rounded-3xl border border-border shadow-xs overflow-hidden">
      {/* Cover / Banner Image */}
      <div className="relative min-h-[14rem] sm:min-h-[18rem] h-56 sm:h-72 w-full bg-sidebar-bg overflow-hidden">
        <Image
          src={business.imageUrl}
          alt={business.name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* Profile Info Bar */}
      <div className="p-6 sm:p-8 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
          {/* Logo & Name */}
          <div className="flex items-end gap-4 sm:gap-6">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-surface border-4 border-surface shadow-md overflow-hidden flex items-center justify-center flex-shrink-0">
              {business.logoUrl ? (
                <img src={business.logoUrl} alt={business.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-12 h-12 text-primary" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-text-primary tracking-tight">
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
                  {business.city}, {business.state}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-status-warning">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-sm font-bold text-text-primary">{business.rating}</span>
                <span className="text-xs text-text-muted">({business.reviewCount} Reviews)</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
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
              variant={isSaved ? "primary" : "outline"}
              size="md"
              onClick={onToggleSave}
              leftIcon={<Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />}
            >
              {isSaved ? APP_HEADERS.businessDetails.actions.saved : APP_HEADERS.businessDetails.actions.saveBusiness}
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
