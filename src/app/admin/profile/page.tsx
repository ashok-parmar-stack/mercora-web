"use client";

import React, { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuthStore } from "@/lib/store/auth-store";
import { useUIStore } from "@/lib/store/ui-store";
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Shield,
  Key,
  Clock,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  Save,
  LogOut,
  Sparkles,
  Camera,
  RefreshCw,
  Globe,
  Sun,
  Moon,
  Loader2,
  Trash2,
  HardDrive,
  UploadCloud,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { ImageUploadDropzone } from "@/components/ui/ImageUploadDropzone";

export default function AdminProfilePage() {
  const { user, updateUser, logout } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);
  const activePersona = useUIStore((s) => s.activePersona);

  // Avatar Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatarUrl || "");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [storageInfo, setStorageInfo] = useState<{
    driver: string;
    bucketName: string;
    region?: string;
  } | null>(null);

  // Profile Form State
  const [name, setName] = useState(user?.name || "Ashok Parmar");
  const [email, setEmail] = useState(user?.email || "ashokparmar72038@gmail.com");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [company, setCompany] = useState("Mercora Enterprise Global");
  const [designation, setDesignation] = useState("Lead Systems Architect");
  const [bio, setBio] = useState(
    "Senior Core Platform Engineer overseeing global B2B trade intelligence, distributed databases, and high-security access controls."
  );
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST, UTC+5:30)");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"profile" | "appearance" | "security" | "sessions">("profile");
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.email) setEmail(user.email);
    if (user?.phone) setPhone(user.phone);
    if (user?.avatarUrl !== undefined) setAvatarUrl(user.avatarUrl || "");

    // Fetch storage configuration info from API
    fetch("/api/upload")
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) {
          setStorageInfo(json.data);
        }
      })
      .catch(() => {});
  }, [user]);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      addToast("error", "Invalid File", "Please select a valid image file (JPG, PNG, WEBP, GIF, SVG).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast("error", "File Too Large", "Image size exceeds 5MB limit.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const previousUrl = avatarUrl;
    setAvatarUrl(objectUrl);
    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "avatars");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to upload image.");
      }

      const finalUrl = json.data?.url || objectUrl;
      setAvatarUrl(finalUrl);
      updateUser({ avatarUrl: finalUrl });
      addToast(
        "success",
        "Avatar Uploaded",
        `Stored successfully in bucket: ${json.data?.bucket || "configured bucket"} (${json.data?.driver?.toUpperCase() || "STORE"}).`
      );
    } catch (err: any) {
      setAvatarUrl(previousUrl);
      addToast("error", "Upload Failed", err?.message || "Could not complete upload.");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl("");
    updateUser({ avatarUrl: "" });
    addToast("info", "Avatar Removed", "Profile avatar reset to initials.");
  };

  const getInitials = (n: string) => {
    return n
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Password Strength Calculator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "None", color: "bg-gray-200" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
    if (score === 2) return { score: 2, label: "Fair", color: "bg-amber-500" };
    if (score === 3) return { score: 3, label: "Good", color: "bg-blue-500" };
    return { score: 4, label: "Strong", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(newPassword);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast("error", "Validation Error", "Full name cannot be empty.");
      return;
    }
    setSavingProfile(true);

    try {
      // Simulate API call / Store update
      await new Promise((resolve) => setTimeout(resolve, 600));
      updateUser({
        name,
        email,
        phone,
      });

      addToast("success", "Profile Updated", "Your administrator profile has been saved successfully.");
    } catch (err) {
      addToast("error", "Update Failed", "Could not save profile changes.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      addToast("error", "Validation Error", "Please provide your current password.");
      return;
    }
    if (newPassword.length < 8) {
      addToast("error", "Validation Error", "New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast("error", "Validation Error", "New password and confirmation do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      addToast("success", "Password Updated", "Your administrative credentials were successfully renewed.");
    } catch (err) {
      addToast("error", "Password Change Error", "Failed to update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      addToast("info", "Signing out...", "Revoking session keys");
      const { logoutServerAction } = await import("@/app/actions/auth-actions");
      await logoutServerAction();
    } catch (e) {
      console.warn("Logout error:", e);
    } finally {
      try {
        const { logoutUser } = await import("@/lib/auth-api");
        await logoutUser();
      } catch (e) {
        logout();
      }
      window.location.replace("/login");
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <PageHeader
        title="Admin Profile & Security"
        description="Manage your personal identity, contact details, authentication credentials, and active administrative sessions."
        extraActions={
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-gray-700 hover:text-red-600 bg-white hover:bg-red-50/60 border border-gray-200 hover:border-red-200 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:text-red-400 transition-colors shadow-2xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        }
      />

      {/* ── Profile Hero Card ───────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 md:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5 min-w-0">
            {/* Hidden file input for bucket image upload */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarFileChange}
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              className="hidden"
            />

            {/* Avatar with Initials or Uploaded Photo & Camera Badge */}
            <div
              className="relative group/avatar cursor-pointer flex-shrink-0"
              onClick={() => setIsAvatarModalOpen(true)}
              title="Click to open image upload dropzone"
            >
              {avatarUrl ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-2xl overflow-hidden shadow-sm border border-slate-700/30 bg-slate-900">
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white font-extrabold flex items-center justify-center text-xl sm:text-2xl md:text-3xl shadow-sm border border-slate-700/20 font-jakarta">
                  {getInitials(name)}
                </div>
              )}

              {/* Hover upload trigger overlay */}
              <div
                className={`absolute inset-0 rounded-2xl bg-black/60 flex flex-col items-center justify-center text-white transition-opacity duration-200 ${
                  isUploadingAvatar ? "opacity-100" : "opacity-0 group-hover/avatar:opacity-100"
                }`}
              >
                {isUploadingAvatar ? (
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-brand-400" />
                ) : (
                  <>
                    <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-[9px] sm:text-[10px] font-bold mt-1 tracking-tight">Upload</span>
                  </>
                )}
              </div>
            </div>

            {/* User Meta */}
            <div className="flex flex-col min-w-0 items-center sm:items-start">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight font-jakarta">
                  {name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  Active
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700">
                  {activePersona.roleName}
                </span>
              </div>

              <p className="text-xs text-[var(--text-muted)] mt-1 font-work flex items-center justify-center sm:justify-start gap-2 sm:gap-3 flex-wrap">
                <span className="truncate max-w-[220px] sm:max-w-none">{email}</span>
                <span>•</span>
                <span>{company}</span>
              </p>

              {/* Bucket Storage & Avatar Controls Row */}
              <div className="flex items-center gap-2 mt-2.5 flex-wrap justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  disabled={isUploadingAvatar}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[var(--surface-hover)] hover:bg-[var(--border)] text-[var(--text-primary)] border border-[var(--border)] transition-colors cursor-pointer disabled:opacity-50"
                  title="Open drag-and-drop upload zone for storage bucket"
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="w-3 h-3 animate-spin text-brand-500" />
                  ) : (
                    <UploadCloud className="w-3 h-3 text-brand-500" />
                  )}
                  <span>{isUploadingAvatar ? "Uploading..." : avatarUrl ? "Change Photo" : "Upload Photo"}</span>
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={isUploadingAvatar}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors cursor-pointer"
                    title="Remove avatar image"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                )}

                {/* Storage Bucket Parameter Indicator */}
                <div
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface-hover)] border border-[var(--border)]"
                  title="Storage bucket configured via .env parameters"
                >
                  <HardDrive className="w-2.5 h-2.5 text-brand-500" />
                  <span>
                    Bucket:{" "}
                    <strong className="text-[var(--text-primary)] font-semibold">
                      {storageInfo?.bucketName || "mercora-media-bucket"}
                    </strong>{" "}
                    ({storageInfo?.driver?.toUpperCase() || "ENV"})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:flex items-center gap-2.5 sm:gap-4 pt-3 sm:pt-4 md:pt-0 border-t md:border-t-0 border-[var(--border)]">
            <div className="bg-[var(--surface-hover)] border border-[var(--border)] p-2.5 sm:p-3 rounded-xl text-center">
              <span className="text-[9px] sm:text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-0.5">
                Role Authority
              </span>
              <span className="text-xs font-extrabold text-[var(--text-primary)] font-jakarta">
                Super Admin
              </span>
            </div>

            <div className="bg-[var(--surface-hover)] border border-[var(--border)] p-2.5 sm:p-3 rounded-xl text-center">
              <span className="text-[9px] sm:text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-0.5">
                Session Guard
              </span>
              <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 font-jakarta">
                Single Active
              </span>
            </div>
          </div>
        </div>

        {/* ── Navigation Tabs ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-[var(--border)] overflow-x-auto no-scrollbar">
          {[
            { id: "profile", label: "Personal Details", icon: User },
            { id: "appearance", label: "Appearance & Theme", icon: Sun },
            { id: "security", label: "Password & Credentials", icon: Key },
            { id: "sessions", label: "Active Sessions & Security", icon: Laptop },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900 font-bold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] font-semibold"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab 1: Personal Details ─────────────────────────────────────────── */}
      {activeTab === "profile" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          <div className="border-b border-[var(--border)] pb-4 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-[var(--text-primary)] font-jakarta">
                Personal Information
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 font-work">
                Update your account identity and notification contacts.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 dark:bg-brand-950/50 dark:text-brand-300 dark:border-brand-800/60">
              {activePersona.roleName}
            </span>
          </div>

          {/* Avatar Dropzone Component */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface-hover)]/30 border border-[var(--border)] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-extrabold text-[var(--text-primary)] font-jakarta">
                  Avatar Photo & Identity Asset
                </h4>
                <p className="text-[11px] text-[var(--text-muted)] font-work">
                  Upload an image headshot for your administrative identity. Automatically saved to your configured bucket store.
                </p>
              </div>
              {storageInfo?.bucketName && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]">
                  <HardDrive className="w-2.5 h-2.5 text-brand-500" />
                  {storageInfo.bucketName}
                </span>
              )}
            </div>

            <ImageUploadDropzone
              value={avatarUrl}
              onChange={(newUrl, meta) => {
                setAvatarUrl(newUrl);
                updateUser({ avatarUrl: newUrl });
                addToast(
                  "success",
                  "Avatar Uploaded",
                  `Stored successfully in bucket: ${meta?.bucket || "configured bucket"}`
                );
              }}
              onRemove={handleRemoveAvatar}
              folder="avatars"
              maxSizeMB={5}
              variant="compact-avatar"
              showBucketBadge={true}
            />
          </div>

          <form onSubmit={handleSaveProfile} className="w-full flex flex-col gap-6" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Full Name"
                leftIcon={<User className="w-4 h-4" />}
                required
              />

              {/* Email Address */}
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@company.com"
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              {/* Phone Number */}
              <Input
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                leftIcon={<Phone className="w-4 h-4" />}
              />

              {/* Company / Organization */}
              <Input
                label="Company / Organization"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Mercora Enterprise Global"
                leftIcon={<Building className="w-4 h-4" />}
              />

              {/* Job Title / Role */}
              <Input
                label="Job Title / Department"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="Lead Systems Architect"
                leftIcon={<Briefcase className="w-4 h-4" />}
              />

              {/* Preferred Timezone (Custom Design System Select Component) */}
              <Select
                label="Preferred Timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                options={[
                  { value: "Asia/Kolkata (IST, UTC+5:30)", label: "Asia/Kolkata (IST, UTC+5:30)" },
                  { value: "UTC (Universal Coordinated Time)", label: "UTC (Universal Coordinated Time)" },
                  { value: "America/New_York (EST, UTC-5)", label: "America/New_York (EST, UTC-5)" },
                  { value: "Europe/London (GMT, UTC+0)", label: "Europe/London (GMT, UTC+0)" },
                  { value: "Asia/Dubai (GST, UTC+4)", label: "Asia/Dubai (GST, UTC+4)" },
                ]}
              />
            </div>

            {/* Bio / Administrative Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] font-rethink">
                Administrative Bio & Operational Notes
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--input-border)] bg-[var(--input-background)] text-sm text-[var(--text-primary)] placeholder:text-[var(--input-placeholder)] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--border-focus)]/20 transition-all font-rethink"
                placeholder="Brief administrative bio..."
              />
            </div>

            {/* Footer Actions */}
            <div className="border-t border-[var(--border)] pt-6 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {savingProfile ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Tab: Appearance & Theme ─────────────────────────────────────────── */}
      {activeTab === "appearance" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-xs">
          <div className="mb-6">
            <h3 className="text-base font-extrabold text-[var(--text-primary)] font-jakarta">
              Appearance & Theme Settings
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 font-work">
              Customize how the Mercora administrative console is displayed on your screen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
            {/* Light Mode Card */}
            <div
              onClick={() => {
                setTheme("light");
                addToast("success", "Theme Changed", "Light mode activated.");
              }}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between gap-4 ${
                theme === "light"
                  ? "border-brand-500 bg-brand-50/20 shadow-xs"
                  : "border-[var(--border)] bg-[var(--surface-hover)] hover:border-gray-400 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  <Sun className="w-5 h-5" />
                </div>
                {theme === "light" && (
                  <span className="w-3 h-3 rounded-full bg-brand-500 shadow-xs" />
                )}
              </div>
              <div>
                <span className="font-extrabold text-sm text-[var(--text-primary)] block font-jakarta">Light Mode</span>
                <span className="text-xs text-[var(--text-muted)] mt-0.5 block font-work">Crisp, clean daytime interface with clear separation.</span>
              </div>
            </div>

            {/* Dark Mode Card */}
            <div
              onClick={() => {
                setTheme("dark");
                addToast("success", "Theme Changed", "Dark mode activated.");
              }}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between gap-4 ${
                theme === "dark"
                  ? "border-brand-500 bg-brand-50/20 shadow-xs"
                  : "border-[var(--border)] bg-[var(--surface-hover)] hover:border-gray-400 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                  <Moon className="w-5 h-5" />
                </div>
                {theme === "dark" && (
                  <span className="w-3 h-3 rounded-full bg-brand-500 shadow-xs" />
                )}
              </div>
              <div>
                <span className="font-extrabold text-sm text-[var(--text-primary)] block font-jakarta">Dark Mode</span>
                <span className="text-xs text-[var(--text-muted)] mt-0.5 block font-work">Deep navy background with high contrast and brand accents.</span>
              </div>
            </div>

            {/* System Preference */}
            <div
              onClick={() => {
                setTheme("system");
                addToast("success", "Theme Changed", "Syncing with OS system theme.");
              }}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between gap-4 ${
                theme === "system"
                  ? "border-brand-500 bg-brand-50/20 shadow-xs"
                  : "border-[var(--border)] bg-[var(--surface-hover)] hover:border-gray-400 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                  <Laptop className="w-5 h-5" />
                </div>
                {theme === "system" && (
                  <span className="w-3 h-3 rounded-full bg-brand-500 shadow-xs" />
                )}
              </div>
              <div>
                <span className="font-extrabold text-sm text-[var(--text-primary)] block font-jakarta">System Auto</span>
                <span className="text-xs text-[var(--text-muted)] mt-0.5 block font-work">Adapts dynamically based on your operating system mode.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: Password & Credentials ───────────────────────────────────── */}
      {activeTab === "security" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-xs">
          <div className="mb-6">
            <h3 className="text-base font-extrabold text-[var(--text-primary)] font-jakarta">
              Update Password
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 font-work">
              Maintain strict cryptographic security by updating your master password periodically.
            </p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-xl">
            {/* Current Password */}
            <Input
              label="Current Password"
              type={showPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            {/* New Password */}
            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                leftIcon={<Key className="w-4 h-4" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              {/* Strength Indicator */}
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.score ? strength.color : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] font-semibold text-[var(--text-muted)]">
                    Password strength: <span className="font-bold text-[var(--text-primary)]">{strength.label}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <Input
              label="Confirm New Password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
              required
            />

            {/* Action */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={savingPassword}
                className="btn-red flex items-center gap-2 py-2.5 px-6 rounded-xl text-xs font-bold tracking-wider cursor-pointer"
              >
                {savingPassword ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-3.5 h-3.5" />
                    <span>UPDATE PASSWORD</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Tab 3: Active Sessions & Device Security ────────────────────────── */}
      {activeTab === "sessions" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-[var(--text-primary)] font-jakarta">
              Active Security Sessions
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 font-work">
              Real-time monitoring of all devices authenticated with your credentials.
            </p>
          </div>

          {/* Current Active Session Card */}
          <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white dark:bg-emerald-600 flex items-center justify-center shadow-xs flex-shrink-0">
                <Laptop className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[var(--text-primary)] font-jakarta">
                    Windows PC — Chrome Desktop (Current Session)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
                  IP: 127.0.0.1 • Authenticated Port 9000 • Session ID: sess_active_live
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-bold text-gray-500 hover:text-red-600 hover:underline px-3 py-1.5 self-start sm:self-auto cursor-pointer"
            >
              Terminate
            </button>
          </div>

          {/* Single-Session Enforcement Policy Alert */}
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] flex items-start gap-3 text-xs leading-relaxed">
            <Shield className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-[var(--text-primary)] block mb-0.5 font-jakarta">
                Single Active Session Policy Enforced
              </strong>
              <p className="text-[var(--text-secondary)] font-work">
                Mercora Deal OS automatically invalidates prior active tokens whenever a new login is initiated on another machine. Your session is protected against concurrent token hijacking.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Avatar Drag-and-Drop Zone ─────────────────────────────────── */}
      <Modal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        title="Upload Profile Picture"
        description="Drag and drop or select an image file. It will be uploaded to your storage bucket configured in .env."
        maxWidth="md"
      >
        <div className="flex flex-col gap-4 py-2">
          <ImageUploadDropzone
            value={avatarUrl}
            onChange={(newUrl, meta) => {
              setAvatarUrl(newUrl);
              updateUser({ avatarUrl: newUrl });
              addToast(
                "success",
                "Avatar Uploaded",
                `Stored successfully in bucket: ${meta?.bucket || "configured bucket"} (${meta?.driver?.toUpperCase() || "STORE"}).`
              );
            }}
            onRemove={handleRemoveAvatar}
            folder="avatars"
            maxSizeMB={5}
            variant="standard"
            label="Avatar Image Dropzone"
            description="Drag and drop your picture here, or click to browse. Max 5MB."
            showBucketBadge={true}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(false)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity cursor-pointer font-jakarta"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

