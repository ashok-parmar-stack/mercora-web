"use client";

import React, { useState } from "react";
import { Lock, Key, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Button, Input } from "@/components/common";
import { useUIStore } from "@/lib/store/ui-store";

export function ProfileSecurityTab() {
  const addToast = useUIStore((s) => s.addToast);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "None", color: "bg-gray-200" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-status-error" };
    if (score === 2) return { score: 2, label: "Fair", color: "bg-status-warning" };
    if (score === 3) return { score: 3, label: "Good", color: "bg-status-info" };
    return { score: 4, label: "Strong", color: "bg-status-success" };
  };

  const strength = getPasswordStrength(newPassword);

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

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-xs">
      <div className="mb-6">
        <h3 className="text-base font-extrabold text-[var(--text-primary)]">
          Update Password
        </h3>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Maintain strict cryptographic security by updating your master password periodically.
        </p>
      </div>

      <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-xl">
        <Input
          label="Current Password"
          type={showPassword ? "text" : "password"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
          leftIcon={<Lock className="w-4 h-4 text-text-muted" />}
          required
        />

        <div className="relative">
          <Input
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            leftIcon={<Key className="w-4 h-4 text-text-muted" />}
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

        <Input
          label="Confirm New Password"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-type new password"
          leftIcon={<CheckCircle2 className="w-4 h-4 text-text-muted" />}
          required
        />

        <div className="pt-3">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={savingPassword}
            leftIcon={<Key className="w-4 h-4" />}
          >
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}
