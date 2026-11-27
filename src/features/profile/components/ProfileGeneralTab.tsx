"use client";

import React, { useState } from "react";
import { User, Mail, Phone, Building, Briefcase, Save, HardDrive } from "lucide-react";
import { Button, Input, Select, Textarea, ImageUploadDropzone } from "@/components/common";

export interface ProfileGeneralTabProps {
  initialName: string;
  initialEmail: string;
  initialPhone: string;
  initialCompany: string;
  initialDesignation: string;
  initialBio: string;
  initialTimezone: string;
  avatarUrl: string;
  roleName: string;
  storageInfo: { driver: string; bucketName: string; region?: string } | null;
  onAvatarChange: (newUrl: string, meta?: any) => void;
  onRemoveAvatar: () => void;
  onSaveProfile: (data: {
    name: string;
    email: string;
    phone: string;
    company: string;
    designation: string;
    bio: string;
    timezone: string;
  }) => Promise<void>;
}

export function ProfileGeneralTab({
  initialName,
  initialEmail,
  initialPhone,
  initialCompany,
  initialDesignation,
  initialBio,
  initialTimezone,
  avatarUrl,
  roleName,
  storageInfo,
  onAvatarChange,
  onRemoveAvatar,
  onSaveProfile,
}: ProfileGeneralTabProps) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [company, setCompany] = useState(initialCompany);
  const [designation, setDesignation] = useState(initialDesignation);
  const [bio, setBio] = useState(initialBio);
  const [timezone, setTimezone] = useState(initialTimezone);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveProfile({ name, email, phone, company, designation, bio, timezone });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xs flex flex-col gap-6">
      <div className="border-b border-[var(--border)] pb-4 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-base text-[var(--text-primary)]">
            Personal Information
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Update your account identity and notification contacts.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
          {roleName}
        </span>
      </div>

      {/* Avatar Dropzone Component */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface-hover)]/30 border border-[var(--border)] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-extrabold text-[var(--text-primary)]">
              Avatar Photo & Identity Asset
            </h4>
            <p className="text-[11px] text-[var(--text-muted)]">
              Upload an image headshot for your administrative identity. Automatically saved to your configured bucket store.
            </p>
          </div>
          {storageInfo?.bucketName && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]">
              <HardDrive className="w-2.5 h-2.5 text-primary" />
              {storageInfo.bucketName}
            </span>
          )}
        </div>

        <ImageUploadDropzone
          value={avatarUrl}
          onChange={onAvatarChange}
          onRemove={onRemoveAvatar}
          folder="avatars"
          maxSizeMB={5}
          variant="compact-avatar"
          showBucketBadge={true}
        />
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Full Name"
            leftIcon={<User className="w-4 h-4 text-text-muted" />}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@company.com"
            leftIcon={<Mail className="w-4 h-4 text-text-muted" />}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            leftIcon={<Phone className="w-4 h-4 text-text-muted" />}
          />

          <Input
            label="Company / Organization"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Mercora Enterprise Global"
            leftIcon={<Building className="w-4 h-4 text-text-muted" />}
          />

          <Input
            label="Job Title / Department"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            placeholder="Lead Systems Architect"
            leftIcon={<Briefcase className="w-4 h-4 text-text-muted" />}
          />

          <Select
            label="Preferred Timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            options={[
              { value: "Asia/Kolkata", label: "Asia/Kolkata (India)" },
              { value: "UTC", label: "UTC (Coordinated Universal Time)" },
              { value: "America/New_York", label: "America/New_York (US Eastern)" },
              { value: "Europe/London", label: "Europe/London (UK)" },
              { value: "Asia/Dubai", label: "Asia/Dubai (Gulf)" },
              ...(timezone &&
              !["Asia/Kolkata", "UTC", "America/New_York", "Europe/London", "Asia/Dubai"].includes(timezone)
                ? [{ value: timezone, label: timezone }]
                : []),
            ]}
          />
        </div>

        <Textarea
          label="Administrative Bio & Operational Notes"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Brief administrative bio..."
        />

        <div className="border-t border-[var(--border)] pt-6 flex items-center justify-end gap-3">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
