"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { Modal } from "@/components/common";
import { Button } from "@/components/common";
import { createBusiness } from "../api/business-api";
import { AddBusinessModalProps, ProductItem } from "./add-modal/add-business.types";
import { AddBusinessBasicSection } from "./add-modal/AddBusinessBasicSection";
import { AddBusinessDetailsSection } from "./add-modal/AddBusinessDetailsSection";
import { AddBusinessProductsSection } from "./add-modal/AddBusinessProductsSection";
import { formatUserFriendlyError } from "@/config/messages";
import { extractErrorMessage } from "@/lib/http/client";

export function AddBusinessModal({
  isOpen,
  onClose,
  onBusinessCreated,
}: AddBusinessModalProps) {
  const [businessType, setBusinessType] = useState("Manufacturer");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [categoryData, setCategoryData] = useState<Record<string, any>>({});
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Industrial Machinery");
  const [city, setCity] = useState("Ahmedabad");
  const [state, setState] = useState("Gujarat");
  const [pincode, setPincode] = useState("380001");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [gstin, setGstin] = useState("");
  const [cin, setCin] = useState("");
  const [description, setDescription] = useState("");
  const [fullOverview, setFullOverview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [establishedYear, setEstablishedYear] = useState<number>(2018);
  const [employeeCount, setEmployeeCount] = useState("50-200");
  const [verificationStatus, setVerificationStatus] = useState("Pending");

  const [products, setProducts] = useState<ProductItem[]>([
    { id: "prod-1", name: "", category: "", imageUrl: "", description: "" },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddProduct = () => {
    setProducts((prev) => [
      ...prev,
      {
        id: `prod-${Date.now()}`,
        name: "",
        category: category || "General",
        imageUrl: "",
        description: "",
      },
    ]);
  };

  const handleRemoveProduct = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, field: keyof ProductItem, value: string) => {
    setProducts((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setError("Please provide a valid company or business name.");
      return;
    }
    if (!city.trim() || !state.trim()) {
      setError("City and State are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const validProducts = products.filter((p) => p.name.trim().length > 0);

      const payload = {
        name: name.trim(),
        category: category.trim(),
        businessType,
        industry: category.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        address: address.trim() || `${city.trim()}, ${state.trim()}`,
        phone: phone.trim(),
        email: email.trim(),
        website: website.trim(),
        gstin: gstin.trim(),
        cin: cin.trim(),
        description: description.trim(),
        fullOverview: fullOverview.trim() || description.trim(),
        imageUrl:
          imageUrl ||
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
        logoUrl: logoUrl || "",
        establishedYear: Number(establishedYear) || new Date().getFullYear(),
        employeeCount,
        verificationStatus,
        categoryData,
        categoryIds: [selectedCategoryId, subcategoryId].filter(Boolean),
        products: validProducts,
      };

      await createBusiness(payload);

      setSuccessMessage(`Business "${name}" registered successfully!`);
      setTimeout(() => {
        onBusinessCreated?.();
        onClose();
      }, 1200);
    } catch (err: unknown) {
      const apiMessage = extractErrorMessage(err);
      setError(
        formatUserFriendlyError(
          apiMessage || err,
          "Could not save your business profile right now. Please review your details and try again."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register Verified Business"
      description="Add your company profile to the official Mercora B2B Directory."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2 pb-1">
        {error && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
            {/subscription|plan|upgrade|limit/i.test(error) && (
              <Link
                href="/subscription"
                className="underline font-bold shrink-0 text-primary"
              >
                Upgrade Plan →
              </Link>
            )}
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-status-success-bg border border-status-success/30 text-status-success text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <AddBusinessBasicSection
          businessType={businessType}
          setBusinessType={setBusinessType}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          subcategoryId={subcategoryId}
          setSubcategoryId={setSubcategoryId}
          categoryData={categoryData}
          setCategoryData={setCategoryData}
          name={name}
          setName={setName}
          category={category}
          setCategory={setCategory}
          city={city}
          setCity={setCity}
          state={state}
          setState={setState}
          pincode={pincode}
          setPincode={setPincode}
          address={address}
          setAddress={setAddress}
        />

        <AddBusinessDetailsSection
          phone={phone}
          setPhone={setPhone}
          email={email}
          setEmail={setEmail}
          website={website}
          setWebsite={setWebsite}
          gstin={gstin}
          setGstin={setGstin}
          cin={cin}
          setCin={setCin}
          establishedYear={establishedYear}
          setEstablishedYear={setEstablishedYear}
          employeeCount={employeeCount}
          setEmployeeCount={setEmployeeCount}
          verificationStatus={verificationStatus}
          setVerificationStatus={setVerificationStatus}
          logoUrl={logoUrl}
          setLogoUrl={setLogoUrl}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          description={description}
          setDescription={setDescription}
          fullOverview={fullOverview}
          setFullOverview={setFullOverview}
        />

        <AddBusinessProductsSection
          products={products}
          onAddProduct={handleAddProduct}
          onRemoveProduct={handleRemoveProduct}
          onProductChange={handleProductChange}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            leftIcon={<Sparkles className="w-4 h-4" />}
            className="font-bold shadow-xs"
          >
            Create Business Profile
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default AddBusinessModal;
