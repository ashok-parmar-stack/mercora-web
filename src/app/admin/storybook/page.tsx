"use client";

import React from "react";
import { StorybookCatalog } from "../../../components/admin/StorybookCatalog";
import { RoleProvider } from "../../../components/ui/RoleContext";

export default function StorybookPage() {
  return (
    <RoleProvider>
      <StorybookCatalog />
    </RoleProvider>
  );
}
