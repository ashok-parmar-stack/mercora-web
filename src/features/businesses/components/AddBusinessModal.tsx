"use client";

import React, { useState } from "react";
import {
  Factory,
  Layers,
  Shield,
  Building2,
  Truck,
  Wrench,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Package,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploadDropzone } from "@/components/ui/ImageUploadDropzone";
import { createBusiness } from "../api/business-api";

export interface AddBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBusinessCreated?: () => void;
}

const BUSINESS_TYPE_OPTIONS = [
  { name: "Distributor", icon: Truck },
  { name: "Exporter", icon: Shield },
  { name: "Manufacturer", icon: Factory },
  { name: "Seller / Supplier", icon: Layers },
  { name: "Service Provider", icon: Wrench },
  { name: "Wholesaler", icon: Building2 },
];

const COMMON_CATEGORIES = [
  "Industrial Machinery",
  "Textiles & Fabrics",
  "Ceramics & Tiles",
  "Pharmaceuticals",
  "Renewable Energy",
  "Chemicals & Petrochemicals",
  "Metals & Engineering",
  "Electronics & Electrical",
  "Food & Agriculture",
  "Packaging & Plastics",
];

export function AddBusinessModal({
  isOpen,
  onClose,
  onBusinessCreated,
}: AddBusinessModalProps) {
  const [businessType, setBusinessType] = useState("Manufacturer");
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
  const [verificationStatus, setVerificationStatus] = useState("Verified");

  // Dynamic Product items
  const [products, setProducts] = useState<
    Array<{ id: string; name: string; category: string; imageUrl: string; description: string }>
  >([
    {
      id: "prod-1",
      name: "",
      category: "",
      imageUrl: "",
      description: "",
    },
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

  const handleProductChange = (index: number, field: string, value: string) => {
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
      // Filter valid products
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
        products: validProducts,
      };

      await createBusiness(payload);

      setSuccessMessage(`Business "${name}" registered successfully!`);
      setTimeout(() => {
        onBusinessCreated?.();
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error("[Add Business Error]", err);
      setError(err?.message || "Failed to create business profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register Verified Business"
      description="Add your company profile to the official Mercora B2B Directory & Deal OS."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2 pb-1">
        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ── Business Type Selector Menu (Screenshot style) ────────────── */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
            Select Business Type
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {BUSINESS_TYPE_OPTIONS.map((item) => {
              const Icon = item.icon;
              const isSelected = businessType === item.name;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setBusinessType(item.name)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-red-600 text-white shadow-md shadow-red-600/30 border-red-600 scale-[1.02]"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/60 dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-800 shadow-2xs"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isSelected ? "text-white" : "text-slate-500 dark:text-slate-400"
                    }`}
                  />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Primary Details ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company / Business Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Shree Industries Pvt Ltd"
            required
            leftIcon={<Building2 className="w-4 h-4" />}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Category / Industry
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              {COMMON_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Location ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Ahmedabad"
            required
            leftIcon={<MapPin className="w-4 h-4" />}
          />
          <Input
            label="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="e.g. Gujarat"
            required
          />
          <Input
            label="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="e.g. 380001"
          />
        </div>

        <Input
          label="Full Operational Address / Industrial Area"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g. Phase-IV, Vatva GIDC, Ahmedabad, Gujarat"
          leftIcon={<MapPin className="w-4 h-4" />}
        />

        {/* ── Contact & Statutory ────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            leftIcon={<Phone className="w-4 h-4" />}
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="info@company.com"
            leftIcon={<Mail className="w-4 h-4" />}
          />
          <Input
            label="Website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="www.company.com"
            leftIcon={<Globe className="w-4 h-4" />}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="GSTIN"
            value={gstin}
            onChange={(e) => setGstin(e.target.value.toUpperCase())}
            placeholder="24AAAAA0000A1Z5"
          />
          <Input
            label="CIN (Optional)"
            value={cin}
            onChange={(e) => setCin(e.target.value.toUpperCase())}
            placeholder="U27100GJ2015PTC084321"
          />
        </div>

        {/* ── Operational Scale ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Established Year"
            type="number"
            value={establishedYear}
            onChange={(e) => setEstablishedYear(Number(e.target.value))}
            placeholder="2018"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Employee Count
            </label>
            <select
              value={employeeCount}
              onChange={(e) => setEmployeeCount(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none"
            >
              <option value="1-10">1 - 10</option>
              <option value="10-50">10 - 50</option>
              <option value="50-200">50 - 200</option>
              <option value="200-500">200 - 500</option>
              <option value="500+">500+</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Verification Tier
            </label>
            <select
              value={verificationStatus}
              onChange={(e) => setVerificationStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none"
            >
              <option value="Verified">Verified Vendor</option>
              <option value="Premium">Premium Gold Supplier</option>
            </select>
          </div>
        </div>

        {/* ── Company Logo & Cover Image ─────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Company Logo
            </label>
            <ImageUploadDropzone
              value={logoUrl}
              onChange={(url) => setLogoUrl(url)}
              onRemove={() => setLogoUrl("")}
              folder="businesses"
              variant="compact-avatar"
              label="Brand Logo"
              description="Drop PNG or JPG logo"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Cover / Facility Image
            </label>
            <ImageUploadDropzone
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              onRemove={() => setImageUrl("")}
              folder="businesses"
              variant="standard"
              label="Factory / Office Photo"
              description="High-resolution cover image"
            />
          </div>
        </div>

        {/* ── Descriptions ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Short Description / Tagline
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Brief 1-2 sentence overview for directory listings..."
            className="w-full px-3 py-2 text-sm rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Full Commercial Overview
          </label>
          <textarea
            value={fullOverview}
            onChange={(e) => setFullOverview(e.target.value)}
            rows={3}
            placeholder="Detailed capabilities, machinery, international export certificates..."
            className="w-full px-3 py-2 text-sm rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>

        {/* ── Dynamic Product Catalog ────────────────────────────────── */}
        <div className="space-y-3 pt-2 border-t border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-red-500" />
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Products & Offerings
              </label>
            </div>
            <button
              type="button"
              onClick={handleAddProduct}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="space-y-3">
            {products.map((item, index) => (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/30 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-secondary)]">
                    Product #{index + 1}
                  </span>
                  {products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(index)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                      title="Remove product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleProductChange(index, "name", e.target.value)}
                    placeholder="Product Name (e.g. CNC Machine)"
                    className="px-3 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) => handleProductChange(index, "category", e.target.value)}
                    placeholder="Product Category (e.g. Heavy Equipment)"
                    className="px-3 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none"
                  />
                </div>

                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleProductChange(index, "description", e.target.value)}
                  placeholder="Short description / specs"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Action Buttons ─────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
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
            className="font-bold shadow-md"
          >
            Create Business Profile
          </Button>
        </div>
      </form>
    </Modal>
  );
}
