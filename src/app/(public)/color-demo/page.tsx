"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Sparkles,
  Shield,
  Layers,
  ArrowRight,
  Search,
  CheckCircle2,
  TrendingUp,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function ColorDemoPage() {
  const { theme, setTheme } = useTheme();
  const [testInput, setTestInput] = useState("");
  const [isChecked, setIsChecked] = useState(true);

  const swatches = [
    { name: "Linear Signature Indigo", hex: "#5E6AD2", role: "Primary CTA / Brand Accent", varName: "--primary" },
    { name: "Linear Indigo Glow", hex: "#717EEF", role: "Dark Mode Active / Hover", varName: "--primary-hover" },
    { name: "Deep Indigo Pressed", hex: "#4E5AC0", role: "Active Pressed State", varName: "--primary-active" },
    { name: "Linear Void Charcoal", hex: "#0F1012", role: "Headings / Secondary Button", varName: "--text-primary" },
    { name: "Apple Off-White Canvas", hex: "#F8F9FA", role: "Light Theme Canvas", varName: "--background" },
    { name: "Linear Pitch Void", hex: "#08090A", role: "Dark Theme Canvas", varName: "--background (dark)" },
    { name: "Linear Card Surface", hex: "#121316", role: "Dark Elevated Container", varName: "--surface (dark)" },
    { name: "Linear Raised Surface", hex: "#18191D", role: "Dark Modal / Dropdown", varName: "--surface-raised (dark)" },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans transition-colors duration-200">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Page Title & Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Production Design System · Linear Signature (#5E6AD2)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
              Linear (High-Craft Product UI) Design System
            </h1>
            <p className="text-sm text-text-secondary mt-1.5 max-w-2xl">
              Authentic Linear.app signature design system featuring Linear Indigo (#5E6AD2), Pitch Void (#08090A), Hairline Glass borders, and high-craft typography.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="p-1 rounded-lg border border-border bg-surface flex items-center gap-1">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                  theme === "light" ? "bg-primary text-white shadow-xs" : "text-text-muted hover:text-text-primary"
                }`}
                title="Force Light"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                  theme === "dark" ? "bg-primary text-white shadow-xs" : "text-text-muted hover:text-text-primary"
                }`}
                title="Force Dark"
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                  theme === "system" ? "bg-primary text-white shadow-xs" : "text-text-muted hover:text-text-primary"
                }`}
                title="System Auto"
              >
                <Laptop className="w-4 h-4" />
              </button>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* 1. Centralized Palette Swatches */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-text-primary">
              1. Centralized Design Tokens
            </h2>
            <Badge variant="brand" size="sm">
              Single Source in theme.css
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {swatches.map((s, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-border bg-card shadow-xs flex flex-col justify-between gap-3 group hover:border-border-focus/40 transition-colors"
              >
                <div
                  className="w-full h-14 rounded-lg border border-black/10 dark:border-white/10 shadow-inner flex items-end p-2"
                  style={{ backgroundColor: s.hex }}
                >
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                    {s.hex}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-primary truncate">{s.name}</div>
                  <div className="text-[11px] text-text-muted leading-tight mt-0.5">{s.role}</div>
                  <div className="text-[10px] font-mono text-primary mt-1">{s.varName}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Interactive Component Standards */}
        <section className="space-y-6">
          <h2 className="text-lg font-semibold tracking-tight text-text-primary">
            2. Linear-Standard Component Kit
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buttons Showcase */}
            <Card>
              <CardHeader>
                <CardTitle>Buttons &amp; Micro-Interactions</CardTitle>
                <CardDescription>
                  8px geometry, active spring scale [0.98], subtle hairline borders, zero blur shadows.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Button variant="primary" size="md">
                    Primary Burgundy
                  </Button>
                  <Button variant="secondary" size="md">
                    Secondary Titanium
                  </Button>
                  <Button variant="outline" size="md">
                    Outline Hairline
                  </Button>
                  <Button variant="ghost" size="md">
                    Ghost Subtle
                  </Button>
                  <Button variant="danger" size="md">
                    Destructive
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-border">
                  <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Compact Action
                  </Button>
                  <Button variant="secondary" size="sm" isLoading>
                    Processing
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Disabled State
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Badges & Status Indicators */}
            <Card>
              <CardHeader>
                <CardTitle>Badges &amp; Status Indicators</CardTitle>
                <CardDescription>
                  High-contrast typography with calibrated background tints and status micro-dots.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="brand" dot size="md">
                    Luxury Burgundy
                  </Badge>
                  <Badge variant="success" dot size="md">
                    Verified Active
                  </Badge>
                  <Badge variant="warning" dot size="md">
                    Audit Pending
                  </Badge>
                  <Badge variant="danger" dot size="md">
                    Revoked
                  </Badge>
                  <Badge variant="outline" size="md">
                    Standard Outline
                  </Badge>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-surface-hover/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium text-text-primary">System Theme Sync</span>
                  </div>
                  <span className="font-mono text-[11px] text-text-muted">Active: {theme}</span>
                </div>
              </CardContent>
            </Card>

            {/* Form Inputs Showcase */}
            <Card>
              <CardHeader>
                <CardTitle>Form Controls &amp; Micro-Geometry</CardTitle>
                <CardDescription>
                  Single-pixel focus rings, semantic color validation, and crisp typography.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Search Master Catalog"
                  placeholder="Type an HSN code, manufacturer, or city..."
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-text-muted" />}
                  helperText="Interactive live input bound to centralized theme variables"
                />

                <div className="pt-2">
                  <Checkbox
                    label="Deterministic 1 User = 1 Device Policy"
                    description="Terminates secondary browser sessions when authenticated elsewhere."
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Metric / Stat Card */}
            <Card>
              <CardHeader>
                <CardTitle>Linear Dashboard KPI Cards</CardTitle>
                <CardDescription>
                  Compact padding, stark visual hierarchy, clean micro-borders.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl border border-border bg-surface flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between text-text-muted text-xs font-medium">
                      <span>Total Manufacturers</span>
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold tracking-tight text-text-primary">8,420</div>
                      <div className="text-[11px] text-emerald-600 font-medium mt-0.5">+14.2% MoM</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-border bg-surface flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between text-text-muted text-xs font-medium">
                      <span>PIN Code Coverage</span>
                      <Shield className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold tracking-tight text-text-primary">19,101</div>
                      <div className="text-[11px] text-text-muted font-medium mt-0.5">100% Zero Drift</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
