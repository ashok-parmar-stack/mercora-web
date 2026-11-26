"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Bookmark,
  ArrowRight,
  Mail,
  Globe,
  Ship,
  Truck,
  Building2,
  Check,
  Cog,
  BarChart2,
  Package,
} from "lucide-react";
import { Business } from "../../types/business.types";

const CATEGORY_IMAGES: Record<string, string> = {
  export: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
  importer: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80",
  logistics: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
  "freight-forwarder": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
  manufacture: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
  wholesaler: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80",
  "trading-company": "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
  distributor: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80",
  default: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
};

export interface BusinessCardProps {
  business: Business;
  isSaved?: boolean;
  onToggleSave?: (businessId: string) => void;
  onSelect?: (business: Business) => void;
  onContact?: (business: Business) => void;
}

export function BusinessCard({
  business,
  isSaved: controlledIsSaved,
  onToggleSave,
  onSelect,
  onContact,
}: BusinessCardProps) {
  const router = useRouter();
  const [internalSaved, setInternalSaved] = useState(Boolean(controlledIsSaved));

  const categoryType = (business.businessType || business.category || "").toLowerCase();
  const matchedKey =
    Object.keys(CATEGORY_IMAGES).find((k) => categoryType.includes(k)) || "default";

  const defaultImage = CATEGORY_IMAGES[matchedKey] || CATEGORY_IMAGES.default;
  const [imgSrc, setImgSrc] = useState(business.imageUrl || defaultImage);

  useEffect(() => {
    if (controlledIsSaved !== undefined) {
      setInternalSaved(controlledIsSaved);
    }
  }, [controlledIsSaved]);

  useEffect(() => {
    setImgSrc(business.imageUrl || defaultImage);
  }, [business.imageUrl, defaultImage]);

  const saved = controlledIsSaved !== undefined ? controlledIsSaved : internalSaved;

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInternalSaved((prev) => !prev);
    onToggleSave?.(business.id);
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(business);
    } else {
      router.push(`/businesses/${business.slug}`);
    }
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onContact) {
      onContact(business);
    } else {
      router.push(`/businesses/${business.slug}#contact`);
    }
  };

  const getAvatarIcon = () => {
    if (categoryType.includes("export")) return { Icon: Globe, bg: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400" };
    if (categoryType.includes("logistics")) return { Icon: Truck, bg: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400" };
    if (categoryType.includes("manufactur")) return { Icon: Cog, bg: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400" };
    if (categoryType.includes("import")) return { Icon: Ship, bg: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400" };
    if (categoryType.includes("distribut") || categoryType.includes("wholesale"))
      return { Icon: Package, bg: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400" };
    if (categoryType.includes("trading")) return { Icon: BarChart2, bg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400" };
    return { Icon: Building2, bg: "bg-primary-soft text-primary" };
  };

  const { Icon: AvatarIcon, bg: avatarBg } = getAvatarIcon();

  return (
    <div
      role="article"
      tabIndex={0}
      onClick={handleCardClick}
      className="group isolate relative flex flex-col bg-surface rounded-2xl border border-border hover:border-primary/40 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
    >
      {/* 1. Cover Image Banner */}
      <div className="relative h-44 w-full bg-background-secondary overflow-hidden">
        <Image
          src={imgSrc}
          alt={business.name}
          fill
          unoptimized
          loading="eager"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgSrc(defaultImage)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

        {/* Top-Left: Verification Pill Badge */}
        {business.isVerified === true ? (
          <div className="absolute top-3 left-3 z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-emerald-600 text-[11px] font-bold shadow-xs">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>{business.tier === "Premium" ? "Premium Verified" : "Verified"}</span>
            </div>
          </div>
        ) : (
          <div className="absolute top-3 left-3 z-10">
            <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-slate-600 text-[11px] font-semibold shadow-xs">
              <span>{business.tier || "Registered"}</span>
            </div>
          </div>
        )}

        {/* Top-Right: Instagram Bookmark Button */}
        <button
          type="button"
          onClick={handleSaveClick}
          aria-label={saved ? "Remove from saved" : "Save business"}
          title={saved ? "Saved" : "Save business"}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 shadow-xs cursor-pointer ${
            saved
              ? "bg-[#7F1D3F] text-white shadow-sm"
              : "bg-white/90 hover:bg-white text-gray-700 hover:text-[#7F1D3F]"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? "fill-white text-white" : ""}`} />
        </button>
      </div>

      {/* 2. Overlapping Circular Avatar */}
      <div className="relative -mt-7 ml-4 z-10 w-14 h-14 rounded-full bg-surface p-1 border-2 border-surface shadow-md flex items-center justify-center">
        {business.logoUrl ? (
          <Image
            src={business.logoUrl}
            alt={business.name}
            width={48}
            height={48}
            unoptimized
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className={`w-full h-full rounded-full flex items-center justify-center ${avatarBg}`}>
            <AvatarIcon className="w-6 h-6 stroke-[2]" />
          </div>
        )}
      </div>

      {/* 3. Card Body Content */}
      <div className="p-4 pt-2 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <h3 className="font-extrabold text-base text-text-primary group-hover:text-primary transition-colors line-clamp-1">
            {business.name}
          </h3>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FCECEE] dark:bg-primary-soft text-[#7F1D3F] dark:text-primary">
              <span className="w-1.5 h-1.5 rounded-full border border-current" />
              <span>{business.businessType || business.category || "Verified Member"}</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-text-muted font-medium pt-0.5">
            <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <span className="line-clamp-1">
              {[business.city, business.state].filter(Boolean).join(", ") || "Location not specified"}
            </span>
          </div>

          <p className="text-xs text-text-secondary font-normal line-clamp-2 leading-relaxed pt-1">
            {business.description ||
              business.fullOverview ||
              "Verified enterprise supplier offering high-grade industrial capabilities, certified trade quality, and dedicated supply chain support."}
          </p>
        </div>

        {/* 4. Card Footer */}
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <Link
            href={`/businesses/${business.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#7F1D3F] dark:text-primary hover:underline"
          >
            <span>View Profile</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          <button
            type="button"
            onClick={handleContactClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#7F1D3F] hover:bg-[#681532] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact</span>
          </button>
        </div>
      </div>
    </div>
  );
}
