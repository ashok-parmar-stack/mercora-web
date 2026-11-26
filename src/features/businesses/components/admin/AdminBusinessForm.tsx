"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  FileCheck,
  Image as ImageIcon,
  Layers,
  MapPin,
  Phone,
  Plus,
  Save,
  Upload,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  Input,
  PageHeader,
  Select,
  Textarea,
} from "@/components/common";
import { Business, BusinessContact } from "../../types/business.types";
import { useTaxonomyStore } from "@/lib/store/taxonomy-store";
import { fetchProductCategories } from "@/lib/catalog-api";
import { fetchStates, fetchDistricts } from "@/lib/geography-api";
import { ProductCategory, State, District } from "@mercora/shared-types";

const SEVEN_STEPS = [
  { id: 0, title: "Basic Business Information", subtitle: "Name, founded year & overview", icon: Building2 },
  { id: 1, title: "Owner & Contact Information", subtitle: "Primary & role-based numbers", icon: Phone },
  { id: 2, title: "Business Address", subtitle: "Registered office & location", icon: MapPin },
  { id: 3, title: "Business Categories", subtitle: "Nested business & industry types", icon: Layers },
  { id: 4, title: "Business Registration Details", subtitle: "GSTIN, PAN & CIN compliance", icon: FileCheck },
  { id: 5, title: "Documents & Media", subtitle: "Company logo & cover image", icon: ImageIcon },
  { id: 6, title: "Review & Submit", subtitle: "Verify details before saving", icon: CheckCircle2 },
] as const;

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

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
  const [uploadingField, setUploadingField] = useState<"logo" | "cover" | null>(null);

  const { businessCategories, fetchTaxonomy } = useTaxonomyStore();
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [statesList, setStatesList] = useState<State[]>([]);
  const [districtsList, setDistrictsList] = useState<District[]>([]);

  // Step 1: Basic Business Information
  const [name, setName] = useState("");
  const [establishedYear, setEstablishedYear] = useState("2020");
  const [employeeCount, setEmployeeCount] = useState("50-200");
  const [description, setDescription] = useState("");
  const [fullOverview, setFullOverview] = useState("");

  // Step 2: Owner & Contact Information
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [contacts, setContacts] = useState<BusinessContact[]>([
    { id: "cnt-1", role: "Owner", name: "", phone: "", email: "", isPrimary: true },
  ]);

  // Step 3: Business Address
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  // Step 4: Business Categories (Nested Parent -> Child + Product Category)
  const [parentBusinessCatId, setParentBusinessCatId] = useState("");
  const [childBusinessCatId, setChildBusinessCatId] = useState("");
  const [category, setCategory] = useState("");

  // Step 5: Business Registration Details (GSTIN + PAN + CIN)
  const [gstin, setGstin] = useState("");
  const [pan, setPan] = useState("");
  const [cin, setCin] = useState("");

  // Step 6: Documents & Media
  const [logoUrl, setLogoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchTaxonomy();
    fetchProductCategories({ limit: 200 })
      .then((res) => setProductCategories(res?.items || []))
      .catch(() => {});
    fetchStates({ limit: 100 })
      .then((res) => setStatesList(res?.items || []))
      .catch(() => {});
  }, [fetchTaxonomy]);

  useEffect(() => {
    if (!state) {
      setDistrictsList([]);
      return;
    }
    const matchedState = statesList.find(
      (s) => s.name.toLowerCase() === state.toLowerCase()
    );
    if (matchedState?.id) {
      fetchDistricts({ stateId: matchedState.id, limit: 200 })
        .then((res) => setDistrictsList(res?.items || []))
        .catch(() => setDistrictsList([]));
    }
  }, [state, statesList]);

  const rootBusinessCategories = useMemo(
    () => businessCategories.filter((c) => !c.parentId),
    [businessCategories]
  );

  const childBusinessCategories = useMemo(
    () =>
      parentBusinessCatId
        ? businessCategories.filter((c) => c.parentId === parentBusinessCatId)
        : [],
    [businessCategories, parentBusinessCatId]
  );

  useEffect(() => {
    if (mode === "create") {
      if (!parentBusinessCatId && rootBusinessCategories.length > 0) {
        setParentBusinessCatId(rootBusinessCategories[0].id);
      }
      if (!category && productCategories.length > 0) {
        setCategory(productCategories[0].name);
      }
    }
  }, [mode, parentBusinessCatId, category, rootBusinessCategories, productCategories]);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.name || "");
      setEstablishedYear(String(initialData.establishedYear || 2020));
      setEmployeeCount(initialData.employeeCount || "50-200");
      setDescription(initialData.description || "");
      setFullOverview(initialData.fullOverview || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setWebsite(initialData.website || "");
      setAddress(initialData.address || "");
      setCity(initialData.city || "");
      setState(initialData.state || "");
      setPincode(initialData.pincode || "");
      setCategory(initialData.category || "");
      setGstin(initialData.gstin || "");
      setPan(initialData.pan || (initialData.gstin?.length === 15 ? initialData.gstin.slice(2, 12) : ""));
      setCin(initialData.cin || "");
      setLogoUrl(initialData.logoUrl || "");
      setImageUrl(initialData.imageUrl || "");

      if (initialData.contacts && initialData.contacts.length > 0) {
        setContacts(initialData.contacts);
      } else if (initialData.phone) {
        setContacts([
          {
            id: "cnt-1",
            role: "Owner",
            name: "",
            phone: initialData.phone,
            email: initialData.email || "",
            isPrimary: true,
          },
        ]);
      }

      if (businessCategories.length > 0 && initialData.businessType) {
        const matched = businessCategories.find(
          (c) => c.name.toLowerCase() === initialData.businessType.toLowerCase()
        );
        if (matched) {
          if (matched.parentId) {
            setParentBusinessCatId(matched.parentId);
            setChildBusinessCatId(matched.id);
          } else {
            setParentBusinessCatId(matched.id);
          }
        }
      }
    }
  }, [mode, initialData, businessCategories]);

  const handleGstinChange = (raw: string) => {
    const val = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 15);
    setGstin(val);
    if (val.length >= 12) {
      const extractedPan = val.slice(2, 12);
      if (PAN_REGEX.test(extractedPan)) {
        setPan(extractedPan);
      }
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "logo" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(target);
    setValidationError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "businesses");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      const uploadedUrl = data?.data?.url || data?.url;
      if (!res.ok || !uploadedUrl) {
        throw new Error(data?.error || `Failed to upload ${target} image.`);
      }
      if (target === "logo") setLogoUrl(uploadedUrl);
      else setImageUrl(uploadedUrl);
    } catch (err: any) {
      setValidationError(err?.message || "Image upload failed.");
    } finally {
      setUploadingField(null);
    }
  };

  const selectedBusinessCategory = useMemo(() => {
    if (childBusinessCatId) {
      return businessCategories.find((c) => c.id === childBusinessCatId) || null;
    }
    return businessCategories.find((c) => c.id === parentBusinessCatId) || null;
  }, [businessCategories, parentBusinessCatId, childBusinessCatId]);

  const validateStep = (targetStep: number): boolean => {
    setValidationError(null);
    if (targetStep === 0 && !name.trim()) {
      setValidationError("Business Name is required.");
      return false;
    }
    if (targetStep === 2 && (!city.trim() || !state.trim())) {
      setValidationError("City and State are required.");
      return false;
    }
    if (targetStep === 3 && (!selectedBusinessCategory || !category.trim())) {
      setValidationError("Please select both a Business Category and an Industry / Product Category.");
      return false;
    }
    if (targetStep === 4) {
      if (gstin.trim() && !GSTIN_REGEX.test(gstin.trim())) {
        setValidationError("Please enter a valid 15-character GSTIN (e.g. 24AAAAA0000A1Z5).");
        return false;
      }
      if (pan.trim() && !PAN_REGEX.test(pan.trim())) {
        setValidationError("Please enter a valid 10-character PAN (e.g. AAAAA0000A).");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(SEVEN_STEPS.length - 1, s + 1));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (const s of [0, 2, 3, 4]) {
      if (!validateStep(s)) {
        setStep(s);
        return;
      }
    }

    const validContacts = contacts.filter((c) => c.phone.trim().length > 0);
    const primaryContact = validContacts.find((c) => c.isPrimary) || validContacts[0];
    const resolvedBizType = selectedBusinessCategory?.name || initialData?.businessType || "Manufacturer";
    const categoryIds = [parentBusinessCatId, childBusinessCatId].filter(Boolean);

    const payload: Record<string, unknown> = {
      name: name.trim(),
      businessType: resolvedBizType,
      category: category.trim(),
      categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
      description: description.trim() || undefined,
      fullOverview: fullOverview.trim() || undefined,
      establishedYear: Number(establishedYear) || undefined,
      employeeCount: employeeCount.trim() || undefined,
      ...(mode === "create" ? { verificationStatus: "Unverified" } : {}),
      email: email.trim() || primaryContact?.email || undefined,
      phone: phone.trim() || primaryContact?.phone || undefined,
      contacts: validContacts,
      website: website.trim() || undefined,
      gstin: gstin.trim() || undefined,
      pan: pan.trim() || undefined,
      cin: cin.trim() || undefined,
      address: address.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim() || undefined,
      logoUrl: logoUrl.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
    };

    await onSubmit(payload);
  };

  const displayError = validationError || error;

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl">
      <PageHeader
        title={mode === "edit" ? `Edit ${initialData?.name || "Business"}` : "Add New Business"}
        description="Complete the 7-step business onboarding profile."
        backHref={cancelHref}
      />

      {/* Mobile Horizontal Stepper (< lg) */}
      <div className="flex lg:hidden items-center gap-2 overflow-x-auto pb-1">
        {SEVEN_STEPS.map((s) => {
          const active = step === s.id;
          const completed = step > s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(s.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                active
                  ? "bg-primary text-primary-foreground"
                  : completed
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-surface border border-border text-text-secondary"
              }`}
            >
              <span>{s.id + 1}.</span>
              <span>{s.title}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Vertical Stepper (Desktop lg+) */}
        <Card className="hidden lg:block lg:col-span-4 border border-border bg-surface sticky top-24">
          <CardContent className="p-4 space-y-1.5">
            <div className="px-2 pb-3 mb-2 border-b border-border">
              <div className="flex items-center justify-between text-xs font-semibold text-text-secondary mb-1.5">
                <span>Onboarding Progress</span>
                <span className="text-primary font-bold">
                  {Math.round(((step + 1) / SEVEN_STEPS.length) * 100)}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-surface-hover overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${((step + 1) / SEVEN_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
            {SEVEN_STEPS.map((s) => {
              const Icon = s.icon;
              const active = step === s.id;
              const completed = step > s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStep(s.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
                    active
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : completed
                      ? "bg-primary/5 hover:bg-primary/10 text-foreground"
                      : "hover:bg-surface-hover text-text-secondary"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      active
                        ? "bg-white/20 text-white"
                        : completed
                        ? "bg-primary/15 text-primary"
                        : "bg-surface-hover text-text-muted"
                    }`}
                  >
                    {completed ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">
                      {s.id + 1}. {s.title}
                    </p>
                    <p
                      className={`text-[11px] truncate mt-0.5 ${
                        active ? "text-white/80" : "text-text-muted"
                      }`}
                    >
                      {s.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Right Form Panel */}
        <Card className="lg:col-span-8 border border-border bg-surface">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="pb-3 border-b border-border">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Step {step + 1} of {SEVEN_STEPS.length}
                </p>
                <h2 className="text-lg font-extrabold text-foreground mt-0.5">
                  {SEVEN_STEPS[step].title}
                </h2>
              </div>

              {displayError && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{displayError}</span>
                </div>
              )}

              {/* Step 1: Basic Business Information */}
              {step === 0 && (
                <div className="space-y-4">
                  <Input
                    label="Business Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Apex Steel & Alloys Pvt. Ltd."
                    required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Established Year"
                      type="number"
                      value={establishedYear}
                      onChange={(e) => setEstablishedYear(e.target.value)}
                    />
                    <Input
                      label="Employee Count"
                      value={employeeCount}
                      onChange={(e) => setEmployeeCount(e.target.value)}
                      placeholder="e.g. 50-200"
                    />
                  </div>
                  <Textarea
                    label="Short Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Concise summary of the business..."
                    rows={3}
                  />
                  <Textarea
                    label="Full Company Overview"
                    value={fullOverview}
                    onChange={(e) => setFullOverview(e.target.value)}
                    placeholder="Detailed capabilities, infrastructure, and certifications..."
                    rows={4}
                  />
                </div>
              )}

              {/* Step 2: Owner & Contact Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Primary Business Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contact@company.com"
                    />
                    <Input
                      label="Primary Phone Number"
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
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          Department & Role Contacts
                        </p>
                        <p className="text-xs text-text-secondary">
                          Add multiple numbers for Owner, Seller, Marketing, IT, or Support teams.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setContacts((prev) => [
                            ...prev,
                            {
                              id: `cnt-${Date.now()}`,
                              role: "Seller",
                              name: "",
                              phone: "",
                              email: "",
                              isPrimary: prev.length === 0,
                            },
                          ])
                        }
                        leftIcon={<Plus className="w-3.5 h-3.5" />}
                      >
                        Add Number
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {contacts.map((c, idx) => (
                        <div
                          key={c.id}
                          className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 rounded-xl border border-border bg-surface-hover/30 items-end"
                        >
                          <div className="sm:col-span-3">
                            <Select
                              label="Role"
                              selectSize="sm"
                              value={c.role}
                              onChange={(e) =>
                                setContacts((prev) =>
                                  prev.map((item, i) =>
                                    i === idx ? { ...item, role: e.target.value } : item
                                  )
                                )
                              }
                            >
                              <option value="Owner">Owner</option>
                              <option value="Seller">Seller / Sales</option>
                              <option value="Marketing">Marketing</option>
                              <option value="IT">IT</option>
                              <option value="Support">Support</option>
                              <option value="Accounts">Accounts</option>
                            </Select>
                          </div>
                          <div className="sm:col-span-3">
                            <Input
                              label="Contact Name"
                              inputSize="sm"
                              placeholder="e.g. Rajesh Patel"
                              value={c.name || ""}
                              onChange={(e) =>
                                setContacts((prev) =>
                                  prev.map((item, i) =>
                                    i === idx ? { ...item, name: e.target.value } : item
                                  )
                                )
                              }
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <Input
                              label="Phone Number *"
                              inputSize="sm"
                              placeholder="+91 98765 43210"
                              value={c.phone}
                              onChange={(e) =>
                                setContacts((prev) =>
                                  prev.map((item, i) =>
                                    i === idx ? { ...item, phone: e.target.value } : item
                                  )
                                )
                              }
                            />
                          </div>
                          <div className="sm:col-span-3 flex items-center justify-between gap-2">
                            <label className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground cursor-pointer">
                              <input
                                type="radio"
                                name="primary-contact"
                                checked={Boolean(c.isPrimary)}
                                onChange={() =>
                                  setContacts((prev) =>
                                    prev.map((item, i) => ({ ...item, isPrimary: i === idx }))
                                  )
                                }
                              />
                              <span>Primary</span>
                            </label>
                            {contacts.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setContacts((prev) => prev.filter((_, i) => i !== idx))
                                }
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Business Address */}
              {step === 2 && (
                <div className="space-y-4">
                  <Textarea
                    label="Registered Office Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Plot / Building, Street, Industrial Area..."
                    rows={3}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Select
                      label="State *"
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        setCity("");
                      }}
                      required
                    >
                      <option value="">Select State</option>
                      {statesList.map((st) => (
                        <option key={st.id} value={st.name}>
                          {st.name}
                        </option>
                      ))}
                      {state && !statesList.some((st) => st.name === state) && (
                        <option value={state}>{state}</option>
                      )}
                    </Select>

                    {districtsList.length > 0 ? (
                      <Select
                        label="City / District *"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      >
                        <option value="">Select City / District</option>
                        {districtsList.map((dist) => (
                          <option key={dist.id} value={dist.name}>
                            {dist.name}
                          </option>
                        ))}
                        {city && !districtsList.some((d) => d.name === city) && (
                          <option value={city}>{city}</option>
                        )}
                      </Select>
                    ) : (
                      <Input
                        label="City *"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ahmedabad"
                        required
                      />
                    )}

                    <Input
                      label="PIN Code"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="380001"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Business Categories */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Primary Business Category *"
                      value={parentBusinessCatId}
                      onChange={(e) => {
                        setParentBusinessCatId(e.target.value);
                        setChildBusinessCatId("");
                      }}
                      required
                    >
                      <option value="">Select Primary Business Category</option>
                      {rootBusinessCategories.map((bc) => (
                        <option key={bc.id} value={bc.id}>
                          {bc.name}
                        </option>
                      ))}
                    </Select>

                    <Select
                      label="Subcategory (Nested)"
                      value={childBusinessCatId}
                      onChange={(e) => setChildBusinessCatId(e.target.value)}
                      disabled={childBusinessCategories.length === 0}
                    >
                      <option value="">
                        {childBusinessCategories.length === 0
                          ? "No subcategories available"
                          : "Select Subcategory (Optional)"}
                      </option>
                      {childBusinessCategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </Select>
                  </div>

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
                    {category && !productCategories.some((pc) => pc.name === category) && (
                      <option value={category}>{category}</option>
                    )}
                  </Select>
                </div>
              )}

              {/* Step 5: Business Registration Details (GSTIN + PAN + CIN) */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="GSTIN (15-Character)"
                      value={gstin}
                      onChange={(e) => handleGstinChange(e.target.value)}
                      placeholder="24AAAAA0000A1Z5"
                      helperText="Entering a valid GSTIN automatically extracts the PAN."
                      maxLength={15}
                    />
                    <Input
                      label="PAN Number (10-Character)"
                      value={pan}
                      onChange={(e) =>
                        setPan(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10))
                      }
                      placeholder="AAAAA0000A"
                      maxLength={10}
                    />
                  </div>
                  <Input
                    label="CIN (Corporate Identification Number)"
                    value={cin}
                    onChange={(e) => setCin(e.target.value.toUpperCase())}
                    placeholder="U00000GJ2025PTC000000"
                  />
                </div>
              )}

              {/* Step 6: Documents & Media */}
              {step === 5 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3 p-4 rounded-xl border border-border bg-surface-hover/20">
                      <Input
                        label="Company Logo URL"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="/uploads/businesses/..."
                      />
                      <label className="inline-flex items-center gap-2 px-4 h-9 rounded-lg border border-border bg-surface hover:bg-surface-hover text-xs font-semibold cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-primary" />
                        <span>{uploadingField === "logo" ? "Uploading..." : "Upload Logo"}</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, "logo")}
                        />
                      </label>
                      {logoUrl && (
                        <img
                          src={logoUrl}
                          alt="Logo preview"
                          className="h-20 w-20 object-contain rounded-lg border border-border bg-surface p-1"
                        />
                      )}
                    </div>

                    <div className="space-y-3 p-4 rounded-xl border border-border bg-surface-hover/20">
                      <Input
                        label="Cover Banner URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="/uploads/businesses/..."
                      />
                      <label className="inline-flex items-center gap-2 px-4 h-9 rounded-lg border border-border bg-surface hover:bg-surface-hover text-xs font-semibold cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-primary" />
                        <span>{uploadingField === "cover" ? "Uploading..." : "Upload Cover"}</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, "cover")}
                        />
                      </label>
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt="Cover preview"
                          className="h-20 w-full object-cover rounded-lg border border-border"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Review & Submit */}
              {step === 6 && (
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-border bg-surface-hover/30">
                    <div>
                      <p className="text-xs text-text-muted">Business Name</p>
                      <p className="font-semibold">{name || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Business / Product Category</p>
                      <p className="font-semibold">
                        {selectedBusinessCategory?.name || "—"} • {category || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Primary Contact</p>
                      <p className="font-semibold">
                        {email || "—"} | {phone || contacts.find((c) => c.isPrimary)?.phone || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Department Contacts</p>
                      <p className="font-semibold">
                        {contacts.filter((c) => c.phone.trim()).length} number(s)
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Location</p>
                      <p className="font-semibold">
                        {[city, state, pincode].filter(Boolean).join(", ") || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">GSTIN / PAN / CIN</p>
                      <p className="font-mono text-xs mt-0.5">
                        {gstin || "—"} / {pan || "—"} / {cin || "—"}
                      </p>
                    </div>
                  </div>
                  {mode === "create" && (
                    <p className="text-xs text-text-secondary">
                      New businesses are created with <strong>Unverified</strong> status and can be verified separately from Business Management.
                    </p>
                  )}
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border">
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

                <div>
                  {step < SEVEN_STEPS.length - 1 ? (
                    <Button type="button" variant="primary" onClick={handleNext}>
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isSubmitting}
                      leftIcon={
                        mode === "edit" ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />
                      }
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
    </div>
  );
}
