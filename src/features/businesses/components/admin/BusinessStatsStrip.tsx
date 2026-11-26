"use client";

import React from "react";
import { Building2, CheckCircle2, Clock, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/common";

export interface BusinessStatsStripProps {
  totalBusinesses: number;
  verifiedCount: number;
  unverifiedCount: number;
  categoriesCount: number;
}

export function BusinessStatsStrip({
  totalBusinesses,
  verifiedCount,
  unverifiedCount,
  categoriesCount,
}: BusinessStatsStripProps) {
  const cards = [
    {
      label: "Total Businesses",
      value: totalBusinesses,
      icon: Building2,
      tone: "text-primary bg-primary/10",
    },
    {
      label: "Verified Businesses",
      value: verifiedCount,
      icon: CheckCircle2,
      tone: "text-emerald-600 bg-emerald-500/10",
    },
    {
      label: "Pending / Unverified",
      value: unverifiedCount,
      icon: Clock,
      tone: "text-amber-600 bg-amber-500/10",
    },
    {
      label: "Active Categories",
      value: categoriesCount,
      icon: Layers,
      tone: "text-indigo-600 bg-indigo-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className="border border-border bg-surface">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-text-secondary">{card.label}</p>
                <p className="text-2xl font-extrabold text-foreground mt-1">
                  {card.value.toLocaleString()}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.tone}`}>
                <Icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
