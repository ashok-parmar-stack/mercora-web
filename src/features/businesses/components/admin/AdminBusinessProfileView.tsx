"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  ExternalLink,
  FileText,
  Globe,
  Image as ImageIcon,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  History,
  Users,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  EmptyState,
  PageHeader,
} from "@/components/common";
import { formatLocalDateTime } from "@/lib/date";
import { Business } from "../../types/business.types";
import { BusinessStatusBadge } from "./BusinessStatusBadge";
import { BusinessVerificationModal } from "./BusinessVerificationModal";

type ProfileTab =
  | "overview"
  | "business-info"
  | "contact"
  | "location"
  | "verification"
  | "media"
  | "team"
  | "activity";

const TABS: Array<{ id: ProfileTab; label: string; icon: React.ComponentType<any> }> = [
  { id: "overview", label: "Overview", icon: Building2 },
  { id: "business-info", label: "Business Info", icon: FileText },
  { id: "contact", label: "Contact & Legal", icon: Phone },
  { id: "location", label: "Address & Location", icon: MapPin },
  { id: "verification", label: "Verification", icon: ShieldCheck },
  { id: "media", label: "Media & Gallery", icon: ImageIcon },
  { id: "team", label: "Users & Team", icon: Users },
  { id: "activity", label: "Activity & History", icon: History },
];

export interface AdminBusinessProfileViewProps {
  business: Business;
  onRefresh: () => void;
}

export function AdminBusinessProfileView({
  business,
  onRefresh,
}: AdminBusinessProfileViewProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={business.name}
        description={`${business.businessType || "Business"} • ${business.category || "General"} • ID: ${business.id}`}
        backHref="/admin/businesses"
        badge={<BusinessStatusBadge tier={business.tier} isVerified={business.isVerified} />}
        extraActions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="md" asChild leftIcon={<ExternalLink className="w-4 h-4" />}>
              <Link href={`/businesses/${encodeURIComponent(business.slug || business.id)}`} target="_blank">
                Public Profile
              </Link>
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsVerifyOpen(true)}
              leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
            >
              Verify / Status
            </Button>
          </div>
        }
        actionButton={{
          label: "Edit Business",
          href: `/admin/businesses/${encodeURIComponent(business.id)}/edit`,
          icon: <Pencil className="w-4 h-4" />,
        }}
      />

      {/* Responsive Tab Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                active
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-text-secondary hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-foreground">Company Overview</h3>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                {business.fullOverview || business.description || "No overview provided."}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-3 text-sm">
              <h3 className="text-sm font-bold text-foreground">Quick Summary</h3>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-text-secondary">Slug</span>
                <span className="font-mono text-xs text-foreground">{business.slug}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-text-secondary">Established</span>
                <span className="font-semibold">{business.establishedYear || "—"}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-text-secondary">Employees</span>
                <span className="font-semibold">{business.employeeCount || "—"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "business-info" && (
        <Card>
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
            <div>
              <p className="text-xs text-text-muted">Business Name</p>
              <p className="font-semibold mt-0.5">{business.name}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Business Type</p>
              <p className="font-semibold mt-0.5">{business.businessType || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Category / Sector</p>
              <p className="font-semibold mt-0.5">{business.category || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Industry</p>
              <p className="font-semibold mt-0.5">{business.industry || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Established Year</p>
              <p className="font-semibold mt-0.5">{business.establishedYear || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Employee Count</p>
              <p className="font-semibold mt-0.5">{business.employeeCount || "—"}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "contact" && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-text-muted">Primary Email</p>
                  <p className="font-semibold">{business.email || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-text-muted">Primary Phone</p>
                  <p className="font-semibold">{business.phone || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-text-muted">Website</p>
                  <p className="font-semibold">{business.website || "—"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-text-muted">GSTIN / PAN / CIN</p>
                <p className="font-mono text-xs mt-1">
                  GSTIN: {business.gstin || "—"} | PAN: {business.pan || "—"} | CIN: {business.cin || "—"}
                </p>
              </div>
            </CardContent>
          </Card>

          {business.contacts && business.contacts.length > 0 && (
            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="text-sm font-bold text-foreground">
                  Department & Role Contacts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {business.contacts.map((c) => (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-xl border border-border bg-surface-hover/30 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                            {c.role}
                          </span>
                          {c.isPrimary && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-semibold">
                              Primary
                            </span>
                          )}
                        </div>
                        {c.name && <p className="font-semibold text-foreground">{c.name}</p>}
                        <p className="text-text-secondary font-medium">{c.phone}</p>
                        {c.email && <p className="text-text-muted">{c.email}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "location" && (
        <Card>
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-sm">
            <div className="sm:col-span-2 lg:col-span-4">
              <p className="text-xs text-text-muted">Street Address</p>
              <p className="font-semibold mt-0.5">{business.address || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">City</p>
              <p className="font-semibold mt-0.5">{business.city || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">State</p>
              <p className="font-semibold mt-0.5">{business.state || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">PIN Code</p>
              <p className="font-semibold mt-0.5">{business.pincode || "—"}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "verification" && (
        <Card>
          <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs text-text-muted">Current Verification Tier</p>
              <BusinessStatusBadge tier={business.tier} isVerified={business.isVerified} />
              <p className="text-xs text-text-secondary pt-1">
                GSTIN: <span className="font-mono">{business.gstin || "—"}</span> • CIN:{" "}
                <span className="font-mono">{business.cin || "—"}</span>
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setIsVerifyOpen(true)}
              leftIcon={<ShieldCheck className="w-4 h-4" />}
            >
              Change Verification Status
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === "media" && (
        <Card>
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-text-muted mb-2">Logo</p>
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={`${business.name} logo`}
                  className="h-32 w-32 object-contain rounded-xl border border-border p-2 bg-surface-hover"
                />
              ) : (
                <p className="text-xs text-text-secondary">No logo uploaded.</p>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-text-muted mb-2">Cover Image</p>
              {business.imageUrl ? (
                <img
                  src={business.imageUrl}
                  alt={`${business.name} cover`}
                  className="h-32 w-full max-w-sm object-cover rounded-xl border border-border"
                />
              ) : (
                <p className="text-xs text-text-secondary">No cover image uploaded.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "team" && (
        <EmptyState
          title="Team Members Not Linked"
          description="Per-business team member mapping is not exposed by the directory API."
        />
      )}

      {activeTab === "activity" && (
        <Card>
          <CardContent className="p-6 space-y-2 text-sm">
            <p className="font-semibold text-foreground">Timestamps</p>
            <p className="text-xs text-text-secondary">
              Created: {formatLocalDateTime(business.createdAt)}
            </p>
            <p className="text-xs text-text-secondary">
              Last Updated: {formatLocalDateTime(business.updatedAt)}
            </p>
          </CardContent>
        </Card>
      )}

      <BusinessVerificationModal
        business={isVerifyOpen ? business : null}
        onClose={() => setIsVerifyOpen(false)}
        onUpdated={onRefresh}
      />
    </div>
  );
}
