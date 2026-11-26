"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Plus, Save, Upload } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  Input,
  PageHeader,
  Select,
  Textarea,
} from "@/components/common";
import { Business } from "../../types/business.types";
import { useTaxonomyStore } from "@/lib/store/taxonomy-store";
import { fetchCategories } from "@/features/categories/category-api";
import { CategoryItem } from "@/features/categories/types";

const STEPS = [
  "Basic Info",
  "Contact & Legal",
  "Address",
  "Products & Media",
  "Review & Submit",
] as const;

export interface AdminBusinessFormProps {
  mode: "create" | "edit";
  initialData?: Business | null;
  isSubmitting: boolean;
  error: string | null;
  cancelHref: string;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
}

export function AdminBusinessForm({
  mode,
  initialData,
  isSubmitting,
  error,
  cancelHref,
  onSubmit,
}: AdminBusinessFormProps) {
  const [step, setStep] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { businessCategories, fetchTaxonomy } = useTaxonomyStore();
  const [productCategories, setProductCategories] = useState<CategoryItem[]>([]);

  const [name, setName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [fullOverview, setFullOverview] = useState("");
  const [establishedYear, setEstablishedYear] = useState("2020");
  const [employeeCount, setEmployeeCount] = useState("50-200");
  const [tier, setTier] = useState("Unverified");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [gstin, setGstin] = useState("");
  const [cin, setCin] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [logoUrl, setLogoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [products, setProducts] = useState<Array<{ id: string; name: string; category: string; imageUrl: string; description: string }>>([]);

  useEffect(() => {
    fetchTaxonomy();
    fetchCategories()
      .then((list) => setProductCategories(list || []))
      .catch(() => {});
  }, [fetchTaxonomy]);

  useEffect(() => {
    if (mode === "create") {
      if (!businessType && businessCategories.length > 0) {
        setBusinessType(businessCategories[0].name);
      }
      if (!category && productCategories.length > 0) {
        setCategory(productCategories[0].name);
      }
    }
  }, [mode, businessType, category, businessCategories, productCategories]);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.name || "");
      setBusinessType(initialData.businessType || "Manufacturer");
      setCategory(initialData.category || "Industrial Machinery");
      setDescription(initialData.description || "");
      setFullOverview(initialData.fullOverview || "");
      setEstablishedYear(String(initialData.establishedYear || 2020));
      setEmployeeCount(initialData.employeeCount || "50-200");
      setTier(initialData.tier || "Unverified");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setWebsite(initialData.website || "");
      setGstin(initialData.gstin || "");
      setCin(initialData.cin || "");
      setAddress(initialData.address || "");
      setCity(initialData.city || "");
      setState(initialData.state || "");
      setPincode(initialData.pincode || "");
      setLogoUrl(initialData.logoUrl || "");
      setImageUrl(initialData.imageUrl || "");
      setProducts(
        (initialData.products || []).map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          imageUrl: p.imageUrl || "",
          description: p.description || "",
        }))
      );
    }
  }, [mode, initialData]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setValidationError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "businesses");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Failed to upload logo.");
      }
      setLogoUrl(data.url);
    } catch (err: any) {
      setValidationError(err?.message || "Logo upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const validateAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError("Business Name is required.");
      setStep(0);
      return;
    }
    if (!city.trim() || !state.trim()) {
      setValidationError("City and State are required.");
      setStep(2);
      return;
    }
    setValidationError(null);

    const matchedBizCat = businessCategories.find(
      (c) => c.name.toLowerCase() === businessType.trim().toLowerCase()
    );

    const payload: Record<string, unknown> = {
      name: name.trim(),
      businessType: businessType.trim(),
      category: category.trim(),
      categoryIds: matchedBizCat ? [matchedBizCat.id] : undefined,
      description: description.trim() || undefined,
      fullOverview: fullOverview.trim() || undefined,
      establishedYear: Number(establishedYear) || undefined,
      employeeCount: employeeCount.trim() || undefined,
      verificationStatus: tier,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      website: website.trim() || undefined,
      gstin: gstin.trim() || undefined,
      cin: cin.trim() || undefined,
      address: address.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim() || undefined,
      logoUrl: logoUrl.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      products: products.filter((p) => p.name.trim().length > 0),
    };

    await onSubmit(payload);
  };

  const displayError = validationError || error;

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <PageHeader
        title={mode === "edit" ? `Edit ${initialData?.name || "Business"}` : "Add New Business"}
        description="Complete business profile, contact, location, and product details."
        backHref={cancelHref}
      />

      {/* Step Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {STEPS.map((label, idx) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(idx)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              step === idx
                ? "bg-primary text-primary-foreground"
                : "bg-surface border border-border text-text-secondary hover:text-foreground"
            }`}
          >
            {idx + 1}. {label}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={validateAndSubmit} className="space-y-5">
            {displayError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{displayError}</span>
              </div>
            )}

            {step === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Business Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Apex Steel & Alloys Pvt. Ltd."
                    required
                  />
                  <Select
                    label="Business Category *"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    required
                  >
                    <option value="">Select Business Category</option>
                    {businessCategories.map((bc) => (
                      <option key={bc.id} value={bc.name}>
                        {bc.name}
                      </option>
                    ))}
                    {businessType &&
                      !businessCategories.some((bc) => bc.name === businessType) && (
                        <option value={businessType}>{businessType}</option>
                      )}
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Select
                    label="Product / Industry Category *"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select Product Category</option>
                    {productCategories.map((pc) => (
                      <option key={pc.id} value={pc.name}>
                        {pc.name}
                      </option>
                    ))}
                    {category &&
                      !productCategories.some((pc) => pc.name === category) && (
                        <option value={category}>{category}</option>
                      )}
                  </Select>
                  <Input
                    label="Established Year"
                    type="number"
                    value={establishedYear}
                    onChange={(e) => setEstablishedYear(e.target.value)}
                  />
                  <Select
                    label="Verification Tier"
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                  >
                    <option value="Unverified">Unverified</option>
                    <option value="Standard">Standard</option>
                    <option value="Verified">Verified</option>
                    <option value="Premium">Premium</option>
                  </Select>
                </div>
                <Textarea
                  label="Short Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
                <Textarea
                  label="Full Overview"
                  value={fullOverview}
                  onChange={(e) => setFullOverview(e.target.value)}
                  rows={4}
                />
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Business Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.com"
                />
                <Input
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
                <Input
                  label="Website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://company.com"
                />
                <Input
                  label="Employee Count"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  placeholder="50-200"
                />
                <Input
                  label="GSTIN"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                />
                <Input
                  label="CIN"
                  value={cin}
                  onChange={(e) => setCin(e.target.value.toUpperCase())}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <Textarea
                  label="Registered Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="City *"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ahmedabad"
                    required
                  />
                  <Input
                    label="State *"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Gujarat"
                    required
                  />
                  <Input
                    label="PIN Code"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="380001"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <Input
                    label="Logo URL"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="/uploads/businesses/..."
                  />
                  <label className="inline-flex items-center gap-2 px-4 h-10 rounded-lg border border-border bg-surface hover:bg-surface-hover text-xs font-semibold cursor-pointer w-fit">
                    <Upload className="w-4 h-4 text-primary" />
                    <span>{isUploading ? "Uploading..." : "Upload Logo"}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </label>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Products & Services</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setProducts((prev) => [
                          ...prev,
                          {
                            id: `prod-${Date.now()}`,
                            name: "",
                            category: category || "General",
                            imageUrl: "",
                            description: "",
                          },
                        ])
                      }
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                    >
                      Add Product
                    </Button>
                  </div>
                  {products.map((p, idx) => (
                    <div
                      key={p.id}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl border border-border bg-surface-hover/30"
                    >
                      <Input
                        placeholder="Product name"
                        value={p.name}
                        onChange={(e) =>
                          setProducts((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, name: e.target.value } : item))
                          )
                        }
                      />
                      <Select
                        value={p.category}
                        onChange={(e) =>
                          setProducts((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, category: e.target.value } : item))
                          )
                        }
                      >
                        <option value="">Select Category</option>
                        {productCategories.map((pc) => (
                          <option key={pc.id} value={pc.name}>
                            {pc.name}
                          </option>
                        ))}
                        {p.category &&
                          !productCategories.some((pc) => pc.name === p.category) && (
                            <option value={p.category}>{p.category}</option>
                          )}
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setProducts((prev) => prev.filter((_, i) => i !== idx))}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3 text-sm p-4 rounded-xl border border-border bg-surface-hover/30">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Review Summary</span>
                </div>
                <p><strong>Name:</strong> {name || "—"}</p>
                <p><strong>Type / Category:</strong> {businessType} / {category}</p>
                <p><strong>Location:</strong> {[city, state, pincode].filter(Boolean).join(", ") || "—"}</p>
                <p><strong>Contact:</strong> {email || "—"} | {phone || "—"}</p>
                <p><strong>Verification Tier:</strong> {tier}</p>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Button variant="outline" asChild>
                  <Link href={cancelHref}>Cancel</Link>
                </Button>
                {step > 0 && (
                  <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {step < STEPS.length - 1 ? (
                  <Button type="button" variant="primary" onClick={() => setStep((s) => s + 1)}>
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    leftIcon={mode === "edit" ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  >
                    {mode === "edit" ? "Save Changes" : "Create Business"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
