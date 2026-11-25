import React from "react";
import { CustomerPortalShell } from "@/components/layout/CustomerPortalShell";

export const dynamic = "force-dynamic";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CustomerPortalShell>{children}</CustomerPortalShell>;
}
