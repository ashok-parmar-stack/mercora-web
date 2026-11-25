"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  Calendar,
  Bookmark,
  ArrowRight,
  Phone,
  Mail,
  Globe,
  Package,
} from "lucide-react";
import { Business } from "../../types/business.types";
import { BusinessBadge } from "../shared/BusinessBadge";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80";

export interface BusinessCardProps {
  business: Business;
  isSaved?: boolean;
  onToggleSave?: (businessId: string) => void;
  onSelect?: (business: Business) => void;
}

export function BusinessCard({
  business,
  isSaved: controlledIsSaved,
  onToggleSave,
  onSelect,
}: BusinessCardProps) {
  const router = useRouter();
  const [internalSaved, setInternalSaved] = useState(Boolean(controlledIsSaved));
  const [imgSrc, setImgSrc] = useState(business.imageUrl || FALLBACK_IMAGE);

  useEffect(() => {
    if (controlledIsSaved !== undefined) {
      setInternalSaved(controlledIsSaved);
    }
  }, [controlledIsSaved]);

  useEffect(() => {
    setImgSrc(business.imageUrl || FALLBACK_IMAGE);
  }, [business.imageUrl]);

  const saved = controlledIsSaved !== undefined ? controlledIsSaved : internalSaved;

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInternalSaved((prev) => !prev);
    if (onToggleSave) {
      onToggleSave(business.id);
    }
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(business);
    } else {
      router.push(`/businesses/${business.slug}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  const productCount = business.products?.length || 0;

  return (
    <div
      role="article"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className="group relative flex flex-col bg-surface rounded-2xl border border-border hover:border-primary/50 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
    >
      {/* Business Image Banner */}
      <div
        className="relative h-44 min-h-[11rem] shrink-0 w-full bg-background-secondary overflow-hidden"
        style={{ minHeight: "11rem", height: "11rem" }}
      >
        <Image
          src={imgSrc}
          alt={business.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <BusinessBadge isVerified={business.isVerified} tier={business.tier} size="sm" />
        </div>

        {/* Save button overlay */}
        <button
          type="button"
          onClick={handleSaveClick}
          aria-label={saved ? "Remove from saved" : "Save business (Instagram bookmark)"}
          title={saved ? "Saved" : "Save to collection"}
          className={`absolute top-3 left-3 p-2 rounded-xl backdrop-blur-md transition-all z-30 pointer-events-auto cursor-pointer shadow-xs border ${
            saved
              ? "bg-primary text-white border-primary shadow-sm ring-2 ring-white/40"
              : "bg-surface/90 text-text-secondary hover:text-primary border-border"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? "fill-current text-white" : ""}`} />
        </button>

        {/* Location pill over image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10 shadow-xs">
          <MapPin className="w-3 h-3 text-accent" />
          <span>
            {business.city}, {business.state}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Business Type & Category */}
          <div className="flex items-center gap-2 text-xs font-semibold text-text-muted mb-1">
            <span className="text-primary font-bold uppercase tracking-wider text-[11px]">
              {business.businessType}
            </span>
            <span className="text-border">·</span>
            <span className="truncate text-text-secondary font-medium">{business.category}</span>
          </div>

          {/* Business Name */}
          <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
            {business.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-status-warning">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-text-primary">
              {business.rating}
            </span>
            <span className="text-xs text-text-muted">
              ({business.reviewCount} Reviews)
            </span>
          </div>

          {/* Short Description */}
          <p className="mt-2 text-xs text-text-secondary line-clamp-2 leading-relaxed font-normal">
            {business.description}
          </p>
        </div>

        {/* Contact Icons Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-border text-text-muted">
          <span
            title={`Call ${business.phone || "N/A"}`}
            className="p-1.5 rounded-lg bg-surface-hover text-text-secondary hover:text-primary transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
          </span>
          <span
            title={`Email ${business.email || "N/A"}`}
            className="p-1.5 rounded-lg bg-surface-hover text-text-secondary hover:text-primary transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
          </span>
          <span
            title={`Visit ${business.website || "N/A"}`}
            className="p-1.5 rounded-lg bg-surface-hover text-text-secondary hover:text-primary transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
          </span>
          <span
            title={`${productCount} Products`}
            className="flex items-center gap-1 text-[11px] font-semibold text-text-muted ml-auto"
          >
            <Package className="w-3.5 h-3.5 text-text-muted" />
            <span>{productCount} Products</span>
          </span>
        </div>

        {/* Footer Meta & Action */}
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Calendar className="w-3.5 h-3.5 text-text-muted" />
            <span>Est. {business.establishedYear}</span>
          </div>

          <Link
            href={`/businesses/${business.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary-soft text-primary group-hover:bg-primary group-hover:text-white text-xs font-bold transition-all shadow-2xs"
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
