"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BusinessProfileHeader } from "@/features/businesses/components/details/BusinessProfileHeader";
import { BusinessOverview } from "@/features/businesses/components/details/BusinessOverview";
import { BusinessProducts } from "@/features/businesses/components/details/BusinessProducts";
import { BusinessLocation } from "@/features/businesses/components/details/BusinessLocation";
import { BusinessContactPanel } from "@/features/businesses/components/details/BusinessContactPanel";
import { ShareBusinessModal } from "@/features/businesses/components/details/ShareBusinessModal";
import { ContactInquiryModal } from "@/features/enquiries/components/ContactInquiryModal";
import { SavedBusinessesDrawer } from "@/features/saved-businesses/components/SavedBusinessesDrawer";
import { useBusinessDetails } from "@/features/businesses/hooks/use-business-details";
import { useSavedBusinesses } from "@/features/saved-businesses/hooks/use-saved-businesses";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { APP_MESSAGES, formatUserFriendlyError } from "@/config/messages";

export default function BusinessProfileDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";

  const { business, isLoading, error, refresh } = useBusinessDetails(slug);
  const { savedIds, isSaved, toggleSave } = useSavedBusinesses();

  const [activeTab, setActiveTab] = useState("overview");
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function" && business) {
      try {
        await navigator.share({
          title: business.name,
          text: `${business.name} — ${business.businessType}`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to ShareBusinessModal if cancelled or unsupported
      }
    }
    setIsShareModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans transition-colors">
      <Header savedCount={savedIds.length} />

      {/* Breadcrumb Bar */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs text-text-muted font-medium">
            <Link href="/" className="hover:text-primary transition-colors">
              <Home className="w-3.5 h-3.5" />
            </Link>
            <span>/</span>
            <Link href="/businesses" className="hover:text-text-primary transition-colors">
              Businesses
            </Link>
            <span>/</span>
            <span className="text-text-primary font-bold truncate max-w-[200px]">
              {business ? business.name : slug}
            </span>
          </nav>

          <Link
            href="/businesses"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Directory</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <LoadingState message="Loading business profile..." />
        ) : error || !business ? (
          <ErrorState
            title="Business Not Found"
            message={
              error
                ? formatUserFriendlyError(error, APP_MESSAGES.errors.businessNotFound)
                : APP_MESSAGES.errors.businessNotFound
            }
            onRetry={refresh}
          />
        ) : (
          <div className="space-y-8">
            {/* Header Card */}
            <BusinessProfileHeader
              business={business}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isSaved={isSaved(business.id)}
              onToggleSave={() => toggleSave(business.id)}
              onContactClick={() => {
                setSelectedProduct(undefined);
                setIsInquiryModalOpen(true);
              }}
              onShareClick={handleShare}
            />

            {/* Content Grid: Left Main + Right Contact */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left / Center Tab Content */}
              <div className="lg:col-span-2 space-y-6">
                {activeTab === "overview" && <BusinessOverview business={business} />}
                {activeTab === "products" && (
                  <BusinessProducts
                    products={business.products || []}
                    onEnquire={(p) => {
                      setSelectedProduct(p.name);
                      setIsInquiryModalOpen(true);
                    }}
                  />
                )}
                {activeTab === "contact" && (
                  <BusinessContactPanel
                    business={business}
                    onOpenInquiry={() => {
                      setSelectedProduct(undefined);
                      setIsInquiryModalOpen(true);
                    }}
                  />
                )}
                {activeTab === "location" && <BusinessLocation business={business} />}
                {activeTab === "reviews" && (
                  <div className="bg-surface rounded-3xl border border-border p-6 sm:p-8 space-y-2">
                    <h3 className="text-base font-bold text-text-primary">
                      Buyer Ratings &amp; Reviews
                    </h3>
                    {business.reviewCount > 0 ? (
                      <p className="text-sm text-text-secondary">
                        Rated <strong className="text-text-primary">{business.rating} / 5</strong> across{" "}
                        <strong className="text-text-primary">{business.reviewCount}</strong> verified commercial ratings.
                      </p>
                    ) : (
                      <p className="text-xs text-text-muted">
                        No buyer reviews recorded yet for this business.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Right Sidebar: Contact Panel */}
              <div className="w-full">
                <BusinessContactPanel
                  business={business}
                  onOpenInquiry={() => {
                    setSelectedProduct(undefined);
                    setIsInquiryModalOpen(true);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Drawers & Modals */}
      <SavedBusinessesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedBusinesses={business ? [business] : []}
        onRemove={toggleSave}
      />

      {business && (
        <>
          <ContactInquiryModal
            isOpen={isInquiryModalOpen}
            onClose={() => setIsInquiryModalOpen(false)}
            businessId={business.id}
            businessName={business.name}
            productName={selectedProduct}
          />
          <ShareBusinessModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            businessName={business.name}
            businessSummary={`${business.businessType} • ${business.city}, ${business.state}`}
          />
        </>
      )}

      <Footer />
    </div>
  );
}
