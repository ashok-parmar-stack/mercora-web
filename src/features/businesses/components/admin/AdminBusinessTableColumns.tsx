"use client";

import React from "react";
import Link from "next/link";
import { Eye, Pencil, ShieldCheck, Trash2, MapPin, Mail, Phone } from "lucide-react";
import { Column, Tooltip } from "@/components/common";
import { Business } from "../../types/business.types";
import { BusinessStatusBadge } from "./BusinessStatusBadge";

export function getAdminBusinessColumns(): Column<Business>[] {
  return [
    {
      key: "name",
      header: "Business",
      sortable: true,
      render: (b) => (
        <div className="flex items-center gap-3 min-w-[210px]">
          <div className="w-9 h-9 rounded-lg border border-border bg-surface-hover flex items-center justify-center overflow-hidden shrink-0">
            {b.logoUrl || b.imageUrl ? (
              <img
                src={b.logoUrl || b.imageUrl}
                alt={b.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-primary">
                {b.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <Link
              href={`/admin/businesses/${encodeURIComponent(b.slug || b.id)}`}
              className="font-semibold text-sm text-foreground hover:text-primary transition-colors truncate block"
            >
              {b.name}
            </Link>
            <span className="text-[11px] text-text-muted font-mono truncate block">
              {b.id}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (b) => (
        <div className="text-xs space-y-0.5 min-w-[170px]">
          <div className="flex items-center gap-1.5 text-foreground truncate">
            <Mail className="w-3 h-3 text-text-muted shrink-0" />
            <span className="truncate">{b.email || "—"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Phone className="w-3 h-3 text-text-muted shrink-0" />
            <span>{b.phone || "—"}</span>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category / Type",
      sortable: true,
      render: (b) => (
        <div className="text-xs min-w-[140px]">
          <p className="font-medium text-foreground truncate">{b.businessType || "—"}</p>
          <p className="text-text-muted truncate">{b.category || "—"}</p>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      sortable: true,
      sortAccessor: (b) => `${b.city || ""}, ${b.state || ""}`.toLowerCase(),
      render: (b) => (
        <div className="flex items-center gap-1.5 text-xs text-text-secondary min-w-[130px]">
          <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <span className="truncate">
            {[b.city, b.state].filter(Boolean).join(", ") || "—"}
          </span>
        </div>
      ),
    },
    {
      key: "tier",
      header: "Verification",
      sortable: true,
      render: (b) => <BusinessStatusBadge tier={b.tier} isVerified={b.isVerified} />,
    },
    {
      key: "createdAt",
      header: "Registered",
      sortable: true,
      render: (b) => (
        <span className="text-xs text-text-secondary whitespace-nowrap">
          {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
  ];
}

export function renderAdminBusinessRowActions(
  business: Business,
  handlers: {
    onVerify: (b: Business) => void;
    onDelete: (b: Business) => void;
  }
) {
  const detailSlug = encodeURIComponent(business.slug || business.id);
  const editId = encodeURIComponent(business.id);

  return (
    <div className="flex items-center justify-end gap-1">
      <Tooltip content="View Profile">
        <Link
          href={`/admin/businesses/${detailSlug}`}
          className="p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          aria-label={`View ${business.name}`}
        >
          <Eye className="w-4 h-4" />
        </Link>
      </Tooltip>
      <Tooltip content="Edit Business">
        <Link
          href={`/admin/businesses/${editId}/edit`}
          className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
          aria-label={`Edit ${business.name}`}
        >
          <Pencil className="w-4 h-4" />
        </Link>
      </Tooltip>
      <Tooltip content="Update Verification Status">
        <button
          type="button"
          onClick={() => handlers.onVerify(business)}
          className="p-1.5 rounded-lg text-text-muted hover:text-emerald-600 hover:bg-emerald-500/10 transition-colors cursor-pointer"
          aria-label={`Verify ${business.name}`}
        >
          <ShieldCheck className="w-4 h-4" />
        </button>
      </Tooltip>
      <Tooltip content="Delete Business">
        <button
          type="button"
          onClick={() => handlers.onDelete(business)}
          className="p-1.5 rounded-lg text-text-muted hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          aria-label={`Delete ${business.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </Tooltip>
    </div>
  );
}
