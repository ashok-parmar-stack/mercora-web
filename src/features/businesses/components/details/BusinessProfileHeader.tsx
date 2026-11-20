"use client";

import React from "react";
import Image from "next/image";
import { Star, Building2, Calendar, Users, Briefcase, Heart, Share2, Mail } from "lucide-react";
import { Business } from "../../types/business.types";
import { BusinessBadge } from "../shared/BusinessBadge";
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
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Cover / Banner Image */}
        <div className="relative min-h-[14rem] sm:min-h-[18rem] h-56 sm:h-72 w-full bg-slate-800 overflow-hidden">
          <Image
            src={business.imageUrl}
            alt={business.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        </div>

        {/* Profile Info Bar */}
        <div className="p-6 sm:p-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
            {/* Logo & Name */}
            <div className="flex items-end gap-4 sm:gap-6">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                {business.logoUrl ? (
                  <img src={business.logoUrl} alt={business.name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-12 h-12 text-red-600" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {business.name}
                  </h1>
                  <BusinessBadge isVerified={business.isVerified} tier={business.tier} size="md" />
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-red-600 dark:text-red-400">{business.businessType}</span>
                  <span>·</span>
                  <span>{business.category}</span>
                  <span>·</span>
                  <span>{business.city}, {business.state}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{business.rating}</span>
                  <span className="text-xs text-slate-400">({business.reviewCount} Reviews)</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={onContactClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all shadow-md shadow-red-600/30 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>{APP_HEADERS.businessDetails.actions.contactBusiness}</span>
              </button>

              <button
                type="button"
                onClick={onToggleSave}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${isSaved
                    ? "border-red-600 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                  }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                <span>{isSaved ? APP_HEADERS.businessDetails.actions.saved : APP_HEADERS.businessDetails.actions.saveBusiness}</span>
              </button>

              <button
                type="button"
                onClick={onShareClick}
                aria-label="Share profile"
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Highlights Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 text-xs">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-red-600" />
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">Established</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{business.establishedYear}</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-red-600" />
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">Employees</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{business.employeeCount}</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 text-red-600" />
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">Business Type</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{business.businessType}</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-red-600" />
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">Ownership</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{business.ownershipType || "Private Ltd"}</div>
              </div>
            </div>
          </div>

          {/* Tabs Bar */}
          <div className="flex items-center gap-2 mt-6 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`pb-3 px-3 text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer ${activeTab === tab.id
                    ? "text-red-600 dark:text-red-400"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
              >
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      );
}
