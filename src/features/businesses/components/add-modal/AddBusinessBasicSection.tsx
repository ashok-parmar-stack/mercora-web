"use client";

import React from "react";
import { Building2, MapPin } from "lucide-react";
import { Input } from "@/components/common";
import { BUSINESS_TYPE_OPTIONS, COMMON_CATEGORIES } from "./add-business.types";

interface AddBusinessBasicSectionProps {
  businessType: string;
  setBusinessType: (val: string) => void;
  name: string;
  setName: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  state: string;
  setState: (val: string) => void;
  pincode: string;
  setPincode: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
}

export function AddBusinessBasicSection({
  businessType,
  setBusinessType,
  name,
  setName,
  category,
  setCategory,
  city,
  setCity,
  state,
  setState,
  pincode,
  setPincode,
  address,
  setAddress,
}: AddBusinessBasicSectionProps) {
  return (
    <div className="space-y-4">
      {/* Business Type Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
          Select Business Type
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {BUSINESS_TYPE_OPTIONS.map((item) => {
            const Icon = item.icon;
            const isSelected = businessType === item.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => setBusinessType(item.name)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs border-primary"
                    : "bg-surface text-text-secondary hover:text-primary hover:bg-surface-hover border-border"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-primary-foreground" : "text-text-muted"}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Name and Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Company / Business Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Shree Industries Pvt Ltd"
          required
          leftIcon={<Building2 className="w-4 h-4" />}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            Category / Industry
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {COMMON_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Ahmedabad"
          required
          leftIcon={<MapPin className="w-4 h-4" />}
        />
        <Input
          label="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="e.g. Gujarat"
          required
        />
        <Input
          label="Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="e.g. 380001"
        />
      </div>

      <Input
        label="Full Operational Address / Industrial Area"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="e.g. Phase-IV, Vatva GIDC, Ahmedabad, Gujarat"
        leftIcon={<MapPin className="w-4 h-4" />}
      />
    </div>
  );
}
