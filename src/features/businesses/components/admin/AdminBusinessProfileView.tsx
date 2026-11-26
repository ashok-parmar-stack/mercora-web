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
  Package,
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
  Pagination,
} from "@/components/common";
import { Business } from "../../types/business.types";
import { BusinessStatusBadge } from "./BusinessStatusBadge";
import { BusinessVerificationModal } from "./BusinessVerificationModal";

type ProfileTab =
  | "overview"
  | "business-info"
  | "contact"
  | "location"
  | "products"
  | "verification"
  | "media"
  | "team"
  | "activity";

const TABS: Array<{ id: ProfileTab; label: string; icon: React.ComponentType<any> }> = [
  { id: "overview", label: "Overview", icon: Building2 },
  { id: "business-info", label: "Business Info", icon: FileText },
  { id: "contact", label: "Contact & Legal", icon: Phone },
  { id: "location", label: "Address & Location", icon: MapPin },
  { id: "products", label: "Products & Services", icon: Package },
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
  const [productPage, setProductPage] = useState(1);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  const products = business.products || [];
  const pageSize = 6;
  const totalProductPages = Math.max(1, Math.ceil(products.length / pageSize));
  const pagedProducts = products.slice((productPage - 1) * pageSize, productPage * pageSize);

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
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-text-secondary">Employees</span>
                <span className="font-semibold">{business.employeeCount || "—"}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-text-secondary">Products</span>
                <span className="font-semibold">{products.length}</span>
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
        <Card>
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-primary mt-0.5" />
              <div>
                <p className="text-xs text-text-muted">Email</p>
                <p className="font-semibold">{business.email || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-primary mt-0.5" />
              <div>
                <p className="text-xs text-text-muted">Phone</p>
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
              <p className="text-xs text-text-muted">GSTIN / CIN</p>
              <p className="font-mono text-xs mt-1">
                GSTIN: {business.gstin || "—"} | CIN: {business.cin || "—"}
              </p>
            </div>
          </CardContent>
        </Card>
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

      {activeTab === "products" && (
        <div className="space-y-4">
          {pagedProducts.length === 0 ? (
            <EmptyState
              title="No products listed"
              description="This business has not added any products or services yet."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pagedProducts.map((p) => (
                  <Card key={p.id}>
                    <CardContent className="p-4 space-y-2">
                      <p className="font-bold text-sm text-foreground">{p.name}</p>
                      <p className="text-xs text-primary font-medium">{p.category}</p>
                      <p className="text-xs text-text-secondary line-clamp-2">
                        {p.description || "No description"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {totalProductPages > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={productPage}
                    totalPages={totalProductPages}
                    pageSize={pageSize}
                    onPageChange={setProductPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
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
              Created: {business.createdAt ? new Date(business.createdAt).toLocaleString() : "—"}
            </p>
            <p className="text-xs text-text-secondary">
              Last Updated: {business.updatedAt ? new Date(business.updatedAt).toLocaleString() : "—"}
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
