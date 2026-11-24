"use client";

import React, { useEffect, useState, useCallback } from "react";
import { User } from "../../lib/admin-types";
import { fetchUserPermissions } from "../../lib/admin-api";
import { UserDrawerHeader } from "./drawer/UserDrawerHeader";
import { UserDrawerHero } from "./drawer/UserDrawerHero";
import { UserDrawerDetails } from "./drawer/UserDrawerDetails";
import { UserDrawerGovernance } from "./drawer/UserDrawerGovernance";
import { UserDrawerAudit } from "./drawer/UserDrawerAudit";
import { UserDrawerFooter } from "./drawer/UserDrawerFooter";

export interface UserDetailDrawerProps {
  user: User | null;
  usersList?: User[];
  isOpen: boolean;
  onClose: () => void;
  onSelectUser?: (user: User) => void;
  onDeleteUser?: (user: User) => void;
  onRestoreUser?: (user: User) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({
  user,
  usersList = [],
  isOpen,
  onClose,
  onSelectUser,
  onDeleteUser,
  onRestoreUser,
  canEdit = true,
  canDelete = true,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [userPermissions, setUserPermissions] = useState<any[]>([]);
  const [isLoadingPerms, setIsLoadingPerms] = useState(false);

  const currentIndex = user
    ? usersList.findIndex((u) => u.id === user.id || (u.slug && u.slug === user.slug))
    : -1;

  const handlePrevUser = useCallback(() => {
    if (currentIndex > 0 && onSelectUser) {
      onSelectUser(usersList[currentIndex - 1]);
    }
  }, [currentIndex, usersList, onSelectUser]);

  const handleNextUser = useCallback(() => {
    if (currentIndex < usersList.length - 1 && onSelectUser) {
      onSelectUser(usersList[currentIndex + 1]);
    }
  }, [currentIndex, usersList, onSelectUser]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevUser();
      if (e.key === "ArrowRight") handleNextUser();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrevUser, handleNextUser]);

  useEffect(() => {
    if (!user || !isOpen) {
      setUserPermissions([]);
      return;
    }

    let isMounted = true;
    setIsLoadingPerms(true);

    fetchUserPermissions(user.id)
      .then((res) => {
        if (isMounted) {
          const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
          setUserPermissions(list);
        }
      })
      .catch(() => {
        if (isMounted) setUserPermissions([]);
      })
      .finally(() => {
        if (isMounted) setIsLoadingPerms(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const isDeleted = Boolean(user.deletedAt);
  const fullName =
    user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email.split("@")[0];
  const initials = (user.name?.[0] || user.firstName?.[0] || user.email[0] || "U").toUpperCase();
  const roleName = user.role?.name || "User";
  const derivedFirst = user.firstName || (user.name ? user.name.split(" ")[0] : "");
  const derivedLast =
    user.lastName || (user.name && user.name.split(" ").length > 1 ? user.name.split(" ").slice(1).join(" ") : "");

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-xl bg-surface border-l border-border h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-250">
        <UserDrawerHeader
          currentIndex={currentIndex}
          totalUsers={usersList.length}
          hasUsersList={usersList.length > 0 && currentIndex !== -1}
          onPrevUser={handlePrevUser}
          onNextUser={handleNextUser}
          onClose={onClose}
        />

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <UserDrawerHero
            user={user}
            initials={initials}
            fullName={fullName}
            roleName={roleName}
            isDeleted={isDeleted}
            copiedKey={copiedKey}
            onCopy={copyToClipboard}
          />

          <div className="space-y-4">
            <UserDrawerDetails
              user={user}
              derivedFirst={derivedFirst}
              derivedLast={derivedLast}
              copiedKey={copiedKey}
              onCopy={copyToClipboard}
            />

            <UserDrawerGovernance
              user={user}
              roleName={roleName}
              userPermissions={userPermissions}
              isLoadingPerms={isLoadingPerms}
            />

            <UserDrawerAudit user={user} />
          </div>
        </div>

        <UserDrawerFooter
          user={user}
          isDeleted={isDeleted}
          canEdit={canEdit}
          canDelete={canDelete}
          onRestore={() => onRestoreUser && onRestoreUser(user)}
          onDelete={() => onDeleteUser && onDeleteUser(user)}
          onClose={onClose}
        />
      </div>
    </div>
  );
};
