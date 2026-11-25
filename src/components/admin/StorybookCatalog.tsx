"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { ColorTokensSection } from "./storybook/ColorTokensSection";
import { FormControlsShowcase } from "./storybook/FormControlsShowcase";
import { DataTableShowcase } from "./storybook/DataTableShowcase";
import { FeedbackAndRolesShowcase } from "./storybook/FeedbackAndRolesShowcase";

export const StorybookCatalog: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 pb-16">
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-brand-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-800">
        <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-widest mb-2">
          <Sparkles className="w-4 h-4 text-brand-400" />
          Component Design System &amp; Theme Catalog
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Mercora Admin Design System
        </h2>
        <p className="text-gray-300 text-sm mt-2 max-w-3xl leading-relaxed">
          Consistent, theme-aware UI tokens, branded checkboxes, interactive multi-select tables,
          confirmation dialogs, and global notification toasts.
        </p>
      </div>

      <ColorTokensSection />
      <FormControlsShowcase />
      <DataTableShowcase onOpenSampleDelete={() => {}} />
      <FeedbackAndRolesShowcase />
    </div>
  );
};
