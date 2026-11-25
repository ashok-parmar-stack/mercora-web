"use client";

import React from "react";
import { Phone, Mail, Globe } from "lucide-react";
import { Input, Select, Textarea } from "@/components/common";
import { ImageUploadDropzone } from "@/components/ui/ImageUploadDropzone";

interface AddBusinessDetailsSectionProps {
  phone: string;
  setPhone: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  website: string;
  setWebsite: (val: string) => void;
  gstin: string;
  setGstin: (val: string) => void;
  cin: string;
  setCin: (val: string) => void;
  establishedYear: number;
  setEstablishedYear: (val: number) => void;
  employeeCount: string;
  setEmployeeCount: (val: string) => void;
  verificationStatus: string;
  setVerificationStatus: (val: string) => void;
  logoUrl: string;
  setLogoUrl: (val: string) => void;
  imageUrl: string;
  setImageUrl: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  fullOverview: string;
  setFullOverview: (val: string) => void;
}

export function AddBusinessDetailsSection({
  phone,
  setPhone,
  email,
  setEmail,
  website,
  setWebsite,
  gstin,
  setGstin,
  cin,
  setCin,
  establishedYear,
  setEstablishedYear,
  employeeCount,
  setEmployeeCount,
  verificationStatus,
  setVerificationStatus,
  logoUrl,
  setLogoUrl,
  imageUrl,
  setImageUrl,
  description,
  setDescription,
  fullOverview,
  setFullOverview,
}: AddBusinessDetailsSectionProps) {
  return (
    <div className="space-y-4">
      {/* Contact Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 98765 43210"
          leftIcon={<Phone className="w-4 h-4" />}
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="info@company.com"
          leftIcon={<Mail className="w-4 h-4" />}
        />
        <Input
          label="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="www.company.com"
          leftIcon={<Globe className="w-4 h-4" />}
        />
      </div>

      {/* Statutory Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="GSTIN"
          value={gstin}
          onChange={(e) => setGstin(e.target.value.toUpperCase())}
          placeholder="24AAAAA0000A1Z5"
        />
        <Input
          label="CIN (Optional)"
          value={cin}
          onChange={(e) => setCin(e.target.value.toUpperCase())}
          placeholder="U27100GJ2015PTC084321"
        />
      </div>

      {/* Operational Scale */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Established Year"
          type="number"
          value={establishedYear}
          onChange={(e) => setEstablishedYear(Number(e.target.value))}
          placeholder="2018"
        />
        <Select
          label="Employee Count"
          value={employeeCount}
          onChange={(e) => setEmployeeCount(e.target.value)}
          options={[
            { value: "1-10", label: "1 - 10" },
            { value: "10-50", label: "10 - 50" },
            { value: "50-200", label: "50 - 200" },
            { value: "200-500", label: "200 - 500" },
            { value: "500+", label: "500+" },
          ]}
        />
        <Select
          label="Verification Tier"
          value={verificationStatus}
          onChange={(e) => setVerificationStatus(e.target.value)}
          options={[
            { value: "Verified", label: "Verified Vendor" },
            { value: "Premium", label: "Premium Gold Supplier" },
          ]}
        />
      </div>

      {/* Logo & Facility Photo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            Company Logo
          </label>
          <ImageUploadDropzone
            value={logoUrl}
            onChange={(url) => setLogoUrl(url)}
            onRemove={() => setLogoUrl("")}
            folder="businesses"
            variant="compact-avatar"
            label="Brand Logo"
            description="Drop PNG or JPG logo"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            Cover / Facility Image
          </label>
          <ImageUploadDropzone
            value={imageUrl}
            onChange={(url) => setImageUrl(url)}
            onRemove={() => setImageUrl("")}
            folder="businesses"
            variant="standard"
            label="Factory / Office Photo"
            description="High-resolution cover image"
          />
        </div>
      </div>

      {/* Descriptions */}
      <Textarea
        label="Short Description / Tagline"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        placeholder="Brief 1-2 sentence overview for directory listings..."
      />

      <Textarea
        label="Full Commercial Overview"
        value={fullOverview}
        onChange={(e) => setFullOverview(e.target.value)}
        rows={3}
        placeholder="Detailed capabilities, machinery, international export certificates..."
      />
    </div>
  );
}
