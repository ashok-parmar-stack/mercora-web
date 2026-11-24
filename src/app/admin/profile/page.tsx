"use client";

import React, { useState, useEffect } from "react";
import { User, Sun, Key, Laptop, LogOut } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common";
import { useAuthStore } from "@/lib/store/auth-store";
import { useUIStore } from "@/lib/store/ui-store";
import {
  ProfileHeroCard,
  ProfileGeneralTab,
  ProfileAppearanceTab,
  ProfileSecurityTab,
  ProfileSessionsTab,
  ProfileAvatarModal,
} from "@/features/profile/components";

export default function AdminProfilePage() {
  const { user, updateUser, logout } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);
  const activePersona = useUIStore((s) => s.activePersona);

  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatarUrl || "");
  const [avatarError, setAvatarError] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [storageInfo, setStorageInfo] = useState<{
    driver: string;
    bucketName: string;
    region?: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"profile" | "appearance" | "security" | "sessions">("profile");

  useEffect(() => {
    setAvatarError(false);
  }, [avatarUrl]);

  useEffect(() => {
    if (user?.avatarUrl !== undefined) setAvatarUrl(user.avatarUrl || "");

    fetch("/api/upload")
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) setStorageInfo(json.data);
      })
      .catch(() => {});
  }, [user]);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      addToast("error", "Invalid File", "Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast("error", "File Too Large", "Image size exceeds 5MB limit.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const prevUrl = avatarUrl;
    setAvatarUrl(objectUrl);
    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "avatars");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Upload failed");

      const finalUrl = json.data?.url || objectUrl;
      setAvatarUrl(finalUrl);
      updateUser({ avatarUrl: finalUrl });
      addToast("success", "Avatar Uploaded", `Stored successfully in bucket.`);
    } catch (err: any) {
      setAvatarUrl(prevUrl);
      addToast("error", "Upload Failed", err?.message || "Could not complete upload.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl("");
    updateUser({ avatarUrl: "" });
    addToast("info", "Avatar Removed", "Profile avatar reset to initials.");
  };

  const handleSaveProfile = async (data: {
    name: string;
    email: string;
    phone: string;
    company: string;
    designation: string;
    bio: string;
    timezone: string;
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    updateUser({ name: data.name, email: data.email, phone: data.phone });
    addToast("success", "Profile Updated", "Your administrator profile has been saved successfully.");
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

  const tabs = [
    { id: "profile" as const, label: "Personal Details", icon: User },
    { id: "appearance" as const, label: "Appearance & Theme", icon: Sun },
    { id: "security" as const, label: "Password & Credentials", icon: Key },
    { id: "sessions" as const, label: "Active Sessions & Security", icon: Laptop },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <PageHeader
        title="Admin Profile & Security"
        description="Manage your personal identity, contact details, authentication credentials, and active administrative sessions."
        extraActions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLogout}
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
          >
            Sign Out
          </Button>
        }
      />

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 md:p-7 shadow-xs">
        <ProfileHeroCard
          name={user?.name || "Ashok Parmar"}
          email={user?.email || "ashokparmar72038@gmail.com"}
          company="Mercora Enterprise Global"
          roleName={activePersona.roleName}
          avatarUrl={avatarUrl}
          avatarError={avatarError}
          isUploadingAvatar={isUploadingAvatar}
          storageInfo={storageInfo}
          onOpenAvatarModal={() => setIsAvatarModalOpen(true)}
          onAvatarFileChange={handleAvatarFileChange}
          onRemoveAvatar={handleRemoveAvatar}
          onAvatarError={() => setAvatarError(true)}
        />

        <div className="flex items-center gap-1.5 sm:gap-2 mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-[var(--border)] overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-white shadow-xs font-bold"
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

      {activeTab === "profile" && (
        <ProfileGeneralTab
          initialName={user?.name || "Ashok Parmar"}
          initialEmail={user?.email || "ashokparmar72038@gmail.com"}
          initialPhone={user?.phone || "+91 98765 43210"}
          initialCompany="Mercora Enterprise Global"
          initialDesignation="Lead Systems Architect"
          initialBio="Senior Core Platform Engineer overseeing global B2B trade intelligence, distributed databases, and high-security access controls."
          initialTimezone="Asia/Kolkata (IST, UTC+5:30)"
          avatarUrl={avatarUrl}
          roleName={activePersona.roleName}
          storageInfo={storageInfo}
          onAvatarChange={(newUrl, meta) => {
            setAvatarUrl(newUrl);
            updateUser({ avatarUrl: newUrl });
            addToast("success", "Avatar Uploaded", `Stored in bucket: ${meta?.bucket || "configured bucket"}`);
          }}
          onRemoveAvatar={handleRemoveAvatar}
          onSaveProfile={handleSaveProfile}
        />
      )}

      {activeTab === "appearance" && <ProfileAppearanceTab />}

      {activeTab === "security" && <ProfileSecurityTab />}

      {activeTab === "sessions" && (
        <ProfileSessionsTab onTerminateCurrentSession={handleLogout} />
      )}

      <ProfileAvatarModal
        isOpen={isAvatarModalOpen}
        avatarUrl={avatarUrl}
        onClose={() => setIsAvatarModalOpen(false)}
        onAvatarChange={(newUrl, meta) => {
          setAvatarUrl(newUrl);
          updateUser({ avatarUrl: newUrl });
          addToast("success", "Avatar Uploaded", `Stored in bucket: ${meta?.bucket || "configured bucket"}`);
        }}
        onRemoveAvatar={handleRemoveAvatar}
      />
    </div>
  );
}
