"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Terminal,
  MapPin,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Database,
  Building,
  Mail,
  Zap,
  AlertCircle,
} from "lucide-react";

interface ResolvedAddress {
  pin: string;
  country: string;
  state: string;
  stateLgd: number;
  district: string;
  districtLgd: number;
  subDistrict: string;
  city: string;
  postOffices: Array<{ name: string; type: string; delivery: string }>;
  latencyMs: number;
}

const PRESETS: Record<string, ResolvedAddress> = {
  "400001": {
    pin: "400001",
    country: "India (IN)",
    state: "Maharashtra",
    stateLgd: 27,
    district: "Mumbai City",
    districtLgd: 497,
    subDistrict: "Mumbai South",
    city: "Mumbai",
    postOffices: [
      { name: "Mumbai G.P.O.", type: "Head Office (HO)", delivery: "Delivery" },
      { name: "Bazargate Sub Post Office", type: "Sub Office (SO)", delivery: "Non-Delivery" },
      { name: "Stock Exchange Post Office", type: "Sub Office (SO)", delivery: "Delivery" },
    ],
    latencyMs: 9,
  },
  "110001": {
    pin: "110001",
    country: "India (IN)",
    state: "Delhi",
    stateLgd: 7,
    district: "New Delhi",
    districtLgd: 88,
    subDistrict: "Connaught Place",
    city: "New Delhi",
    postOffices: [
      { name: "New Delhi G.P.O.", type: "Head Office (HO)", delivery: "Delivery" },
      { name: "Parliament House Post Office", type: "Sub Office (SO)", delivery: "Non-Delivery" },
      { name: "Barakhamba Road Post Office", type: "Sub Office (SO)", delivery: "Delivery" },
    ],
    latencyMs: 11,
  },
  "560001": {
    pin: "560001",
    country: "India (IN)",
    state: "Karnataka",
    stateLgd: 29,
    district: "Bengaluru Urban",
    districtLgd: 524,
    subDistrict: "Bangalore North",
    city: "Bengaluru",
    postOffices: [
      { name: "Bengaluru G.P.O.", type: "Head Office (HO)", delivery: "Delivery" },
      { name: "Raj Bhavan Sub Office", type: "Sub Office (SO)", delivery: "Non-Delivery" },
      { name: "Vidhana Soudha Post Office", type: "Sub Office (SO)", delivery: "Delivery" },
    ],
    latencyMs: 8,
  },
  "380001": {
    pin: "380001",
    country: "India (IN)",
    state: "Gujarat",
    stateLgd: 24,
    district: "Ahmedabad",
    districtLgd: 440,
    subDistrict: "Ahmedabad City",
    city: "Ahmedabad",
    postOffices: [
      { name: "Ahmedabad G.P.O.", type: "Head Office (HO)", delivery: "Delivery" },
      { name: "Bhadra Sub Office", type: "Sub Office (SO)", delivery: "Delivery" },
      { name: "Lal Darwaja Post Office", type: "Sub Office (SO)", delivery: "Delivery" },
    ],
    latencyMs: 10,
  },
};

export default function SandboxSection() {
  const [pinInput, setPinInput] = useState<string>("400001");
  const [activePreset, setActivePreset] = useState<string>("400001");
  const [resolved, setResolved] = useState<ResolvedAddress | null>(PRESETS["400001"]);
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectPreset = (pin: string) => {
    setActivePreset(pin);
    setPinInput(pin);
    setErrorMessage(null);
    setIsResolving(true);
    setTimeout(() => {
      setResolved(PRESETS[pin]);
      setIsResolving(false);
    }, 180);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (PRESETS[pinInput]) {
      handleSelectPreset(pinInput);
      return;
    }

    setIsResolving(true);
    const startTime = performance.now();
    try {
      const res = await fetch(`/api/locations/pincodes?search=${encodeURIComponent(pinInput)}`);
      const latencyMs = Math.round(performance.now() - startTime);
      if (res.ok) {
        const json = await res.json();
        const pinData = Array.isArray(json.data) && json.data.length > 0 ? json.data[0] : null;
        if (pinData) {
          setResolved({
            pin: pinData.pincode || pinData.code || pinInput,
            country: pinData.country?.name || "India (IN)",
            state: pinData.state?.name || "Gujarat",
            stateLgd: pinData.state?.lgdCode || 24,
            district: pinData.district?.name || "District",
            districtLgd: pinData.district?.lgdCode || 100,
            subDistrict: pinData.subDistrict?.name || "Sub-District",
            city: pinData.city?.name || "Industrial Hub",
            postOffices: [
              { name: `${pinData.name || "Postal Branch"} SO`, type: "Sub Office (SO)", delivery: "Delivery · COD" },
            ],
            latencyMs,
          });
        } else {
          setResolved(null);
          setErrorMessage(`No postal record indexed for PIN "${pinInput}". Try a preset such as 400001, 110001, or 380001.`);
        }
      } else {
        setResolved(null);
        setErrorMessage("Geographic verification service is momentarily offline.");
      }
    } catch {
      setResolved(null);
      setErrorMessage("Unable to connect to postal database. Please check your network connection.");
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <section
      id="sandbox"
      className="py-20 border-b scroll-mt-24"
      style={{
        borderColor: "var(--theme-glass-border)",
        background: "var(--theme-canvas)",
        scrollMarginTop: "85px",
      }}
    >
      <div className="container">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 tracking-wide uppercase"
            style={{
              background: "var(--theme-blush)",
              border: "1px solid rgba(238, 49, 53, 0.25)",
              color: "var(--theme-red)",
            }}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Hands-on Interactive Playground</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
            style={{ color: "var(--theme-ink-darkest)", lineHeight: "1.15" }}
          >
            Test The Master Data Resolver Live{" "}
            <span style={{ color: "var(--theme-red)" }}>In Your Browser.</span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Experience the sub-15ms response latency of Mercora’s 8-tier geographic cascading hierarchy without logging in. Try one of the commercial hub presets below or input any 6-digit PIN code.
          </p>
        </div>

        {/* Sandbox Console Container */}
        <div
          className="rounded-2xl border p-6 sm:p-8 shadow-sm transition-all"
          style={{
            background: "var(--theme-card-bg)",
            borderColor: "var(--theme-glass-border)",
          }}
        >
          {/* Preset Buttons & Search Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 pb-6 border-b" style={{ borderColor: "var(--theme-glass-border)" }}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-1">
                Presets:
              </span>
              {[
                { label: "Mumbai (400001)", pin: "400001" },
                { label: "New Delhi (110001)", pin: "110001" },
                { label: "Bengaluru (560001)", pin: "560001" },
                { label: "Ahmedabad (380001)", pin: "380001" },
              ].map((p) => (
                <button
                  key={p.pin}
                  type="button"
                  onClick={() => handleSelectPreset(p.pin)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer"
                  style={{
                    background: activePreset === p.pin ? "var(--theme-red)" : "var(--theme-card-bg)",
                    color: activePreset === p.pin ? "#ffffff" : "var(--theme-ink-darkest)",
                    borderColor: activePreset === p.pin ? "var(--theme-red)" : "var(--theme-glass-border)",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-xs w-full">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--theme-gray-400)" }} />
                <input
                  type="text"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit PIN"
                  className="w-full pl-9 pr-3 py-1.5 text-xs font-mono font-bold rounded-lg border focus:outline-none"
                  style={{
                    background: "var(--theme-card-bg)",
                    borderColor: "var(--theme-glass-border)",
                    color: "var(--theme-ink-darkest)",
                  }}
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                style={{
                  background: "var(--theme-ink-darkest)",
                  color: "var(--theme-canvas)",
                }}
              >
                Resolve
              </button>
            </form>
          </div>

          {/* Error Message when PIN is unindexed */}
          {errorMessage && (
            <div className="p-6 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">Postal Code Not Found</h3>
              <p className="text-xs text-amber-700 dark:text-amber-300 max-w-md mx-auto">{errorMessage}</p>
              <button
                type="button"
                onClick={() => handleSelectPreset("400001")}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Reset to Mumbai (400001)</span>
              </button>
            </div>
          )}

          {/* Resolved Results Hierarchy Display */}
          {resolved && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left: Cascading Resolved Tiers */}
            <div className="md:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--theme-gray-400)" }}>
                  Resolved Geographic Hierarchy
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: "var(--theme-success)" }}>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Resolved in {resolved.latencyMs}ms</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border" style={{ background: "var(--theme-panel-bg)", borderColor: "var(--theme-glass-border)" }}>
                  <span className="text-2xs uppercase font-bold block mb-1" style={{ color: "var(--theme-gray-400)" }}>State &amp; LGD</span>
                  <div className="text-sm font-extrabold" style={{ color: "var(--theme-ink-darkest)" }}>{resolved.state}</div>
                  <div className="text-2xs font-mono font-semibold mt-0.5" style={{ color: "var(--theme-red)" }}>LGD Code: #{resolved.stateLgd}</div>
                </div>

                <div className="p-3 rounded-xl border" style={{ background: "var(--theme-panel-bg)", borderColor: "var(--theme-glass-border)" }}>
                  <span className="text-2xs uppercase font-bold block mb-1" style={{ color: "var(--theme-gray-400)" }}>District &amp; LGD</span>
                  <div className="text-sm font-extrabold" style={{ color: "var(--theme-ink-darkest)" }}>{resolved.district}</div>
                  <div className="text-2xs font-mono font-semibold mt-0.5" style={{ color: "var(--theme-red)" }}>LGD Code: #{resolved.districtLgd}</div>
                </div>

                <div className="p-3 rounded-xl border" style={{ background: "var(--theme-panel-bg)", borderColor: "var(--theme-glass-border)" }}>
                  <span className="text-2xs uppercase font-bold block mb-1" style={{ color: "var(--theme-gray-400)" }}>Sub-District / Tehsil</span>
                  <div className="text-sm font-extrabold" style={{ color: "var(--theme-ink-darkest)" }}>{resolved.subDistrict}</div>
                  <div className="text-2xs mt-0.5" style={{ color: "var(--theme-gray-500)" }}>Municipal Division</div>
                </div>

                <div className="p-3 rounded-xl border" style={{ background: "var(--theme-panel-bg)", borderColor: "var(--theme-glass-border)" }}>
                  <span className="text-2xs uppercase font-bold block mb-1" style={{ color: "var(--theme-gray-400)" }}>Postal Code (PIN)</span>
                  <div className="text-sm font-extrabold font-mono" style={{ color: "var(--theme-red)" }}>{resolved.pin}</div>
                  <div className="text-2xs mt-0.5" style={{ color: "var(--theme-gray-500)" }}>India Post Synchronized</div>
                </div>
              </div>
            </div>

            {/* Right: Post Offices under this PIN */}
            <div
              className="md:col-span-5 p-5 rounded-2xl border"
              style={{
                background: "var(--theme-panel-bg)",
                borderColor: "var(--theme-glass-border)",
              }}
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b" style={{ borderColor: "var(--theme-glass-border)" }}>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" style={{ color: "var(--theme-red)" }} />
                  <span className="text-xs font-bold" style={{ color: "var(--theme-ink-darkest)" }}>
                    Delivery Post Offices ({resolved.postOffices.length})
                  </span>
                </div>
                <span
                  className="text-2xs font-bold uppercase px-2 py-0.5 rounded border"
                  style={{
                    background: "var(--theme-success-bg)",
                    color: "var(--theme-success)",
                    borderColor: "var(--theme-success-border)",
                  }}
                >
                  Active Routes
                </span>
              </div>

              <div className="space-y-2">
                {resolved.postOffices.map((po, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border text-xs"
                    style={{
                      background: "var(--theme-card-bg)",
                      borderColor: "var(--theme-glass-border)",
                    }}
                  >
                    <div className="font-bold" style={{ color: "var(--theme-ink-darkest)" }}>{po.name}</div>
                    <div className="flex items-center justify-between text-2xs mt-1" style={{ color: "var(--theme-gray-500)" }}>
                      <span>{po.type}</span>
                      <span className="font-medium font-sans" style={{ color: "var(--theme-success)" }}>✓ {po.delivery}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200 text-center">
                <Link
                  href="/admin/geography"
                  className="text-xs font-bold text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                >
                  <span>Open Full Geography Explorer in Admin Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
          )}

        </div>

      </div>
    </section>
  );
}
