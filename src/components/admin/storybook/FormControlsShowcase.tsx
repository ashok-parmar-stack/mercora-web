"use client";

import React, { useState } from "react";
import { CheckSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Select,
} from "@/components/common";

export function FormControlsShowcase() {
  const [inputValue, setInputValue] = useState("admin@mercora.com");
  const [inputError, setInputError] = useState("");
  const [demoRole, setDemoRole] = useState("SUPER_ADMIN");
  const [demoStatus, setDemoStatus] = useState("ACTIVE");
  const [chk1, setChk1] = useState(true);
  const [chk2, setChk2] = useState(false);
  const [chk3, setChk3] = useState(true);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-brand-600" />
          <CardTitle>2. Themed Checkboxes &amp; Form Inputs</CardTitle>
        </div>
        <CardDescription>
          All checkboxes and interactive controls automatically adhere to the Mercora brand accent color.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Themed Checkbox Variants &amp; States
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-3">
              <div className="text-xs font-bold text-[var(--text-primary)]">Interactive Controls</div>
              <Checkbox
                label="Selected State"
                description="Uses theme brand crimson (#ee3135)"
                checked={chk1}
                onChange={(e) => setChk1(e.target.checked)}
              />
              <Checkbox
                label="Unchecked State"
                description="Clean slate border with hover focus"
                checked={chk2}
                onChange={(e) => setChk2(e.target.checked)}
              />
              <Checkbox
                label="Indeterminate State"
                description="Used for parent select-all headers"
                checked={chk3}
                indeterminate={true}
                onChange={(e) => setChk3(e.target.checked)}
              />
            </div>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-3">
              <div className="text-xs font-bold text-[var(--text-primary)]">Disabled Controls</div>
              <Checkbox
                label="Disabled (Checked)"
                description="Locked state for unauthorized actions"
                checked={true}
                disabled
              />
              <Checkbox
                label="Disabled (Unchecked)"
                description="Inactive without interaction"
                checked={false}
                disabled
              />
            </div>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-3">
              <div className="text-xs font-bold text-[var(--text-primary)]">Native Input &amp; Focus Ring</div>
              <label className="flex items-center gap-2.5 text-xs font-semibold text-[var(--text-primary)] cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-gray-300 accent-brand-600 text-brand-600 focus:ring-brand-500 cursor-pointer"
                />
                <span>Native Input with `accent-brand-600`</span>
              </label>
              <label className="flex items-center gap-2.5 text-xs font-semibold text-[var(--text-primary)] cursor-pointer">
                <input
                  type="radio"
                  name="demo-radio"
                  defaultChecked
                  className="w-4 h-4 rounded-full border-gray-300 accent-brand-600 text-brand-600 focus:ring-brand-500 cursor-pointer"
                />
                <span>Native Radio with `accent-brand-600`</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Standard Inputs &amp; Dropdowns
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="User Email Address"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              helperText="We will send an automated invitation to this address."
            />
            <Input
              label="Validation Error State"
              value={inputError}
              onChange={(e) => setInputError(e.target.value)}
              error={!inputError ? "This field cannot be left blank." : undefined}
              placeholder="Type to resolve error..."
            />
            <Select
              label="Role Assignment"
              value={demoRole}
              onChange={(e) => setDemoRole(e.target.value)}
              options={[
                { value: "SUPER_ADMIN", label: "Super Administrator (Master)" },
                { value: "COMPANY_ADMIN", label: "Company Administrator" },
                { value: "BUYER", label: "Standard Buyer" },
                { value: "STAFF", label: "Operations Staff" },
              ]}
            />
            <Select
              label="Status Lifecycle"
              value={demoStatus}
              onChange={(e) => setDemoStatus(e.target.value)}
              options={[
                { value: "ACTIVE", label: "ACTIVE - Fully Verified" },
                { value: "INACTIVE", label: "INACTIVE - Soft Disabled" },
                { value: "PENDING", label: "PENDING - Awaiting Verification" },
              ]}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
