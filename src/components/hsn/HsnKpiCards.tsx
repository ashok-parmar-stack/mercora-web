import React from "react";
import { Hash, Layers } from "lucide-react";
import { HsnCode } from "@mercora/shared-types";

interface HsnKpiCardsProps {
  total: number;
  hsnCodes: HsnCode[];
}

export function HsnKpiCards({ total, hsnCodes }: HsnKpiCardsProps) {
  const chaptersCount = hsnCodes.filter((h) => h.level === "CHAPTER_2").length;
  const headingsCount = hsnCodes.filter((h) => h.level === "HEADING_4").length;
  const subheadingsCount = hsnCodes.filter((h) => h.level === "SUBHEADING_6").length;
  const tariffCount = hsnCodes.filter((h) => h.level === "TARIFF_8").length;
  const visibleTotal = Math.max(1, chaptersCount + headingsCount + subheadingsCount + tariffCount);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface p-4 rounded-xl border border-border shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-text-secondary font-medium">Total HSN Codes</div>
            <div className="text-xl font-black text-text-primary mt-1 font-data">{total}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-info/10 text-info flex items-center justify-center">
            <Hash className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-border shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-text-secondary font-medium">Chapters (2-Digit)</div>
            <div className="text-xl font-black text-primary mt-1 font-data">{chaptersCount}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-border shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-text-secondary font-medium">Headings (4-Digit)</div>
            <div className="text-xl font-black text-warning mt-1 font-data">{headingsCount}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-border shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-text-secondary font-medium">Tariff Items (8-Digit)</div>
            <div className="text-xl font-black text-success mt-1 font-data">{tariffCount}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-success/10 text-success flex items-center justify-center">
            <Hash className="w-5 h-5" />
          </div>
        </div>
      </div>

      {hsnCodes.length > 0 && (
        <div className="bg-surface p-4 rounded-xl border border-border shadow-2xs flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-text-primary">HSN Level Distribution (Loaded Page)</span>
            <span className="text-text-muted font-data">{hsnCodes.length} codes</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-surface-hover overflow-hidden flex">
            {chaptersCount > 0 && (
              <div
                className="bg-primary h-full"
                style={{ width: `${(chaptersCount / visibleTotal) * 100}%` }}
                title={`Chapters (2-Digit): ${chaptersCount}`}
              />
            )}
            {headingsCount > 0 && (
              <div
                className="bg-warning h-full"
                style={{ width: `${(headingsCount / visibleTotal) * 100}%` }}
                title={`Headings (4-Digit): ${headingsCount}`}
              />
            )}
            {subheadingsCount > 0 && (
              <div
                className="bg-info h-full"
                style={{ width: `${(subheadingsCount / visibleTotal) * 100}%` }}
                title={`Subheadings (6-Digit): ${subheadingsCount}`}
              />
            )}
            {tariffCount > 0 && (
              <div
                className="bg-success h-full"
                style={{ width: `${(tariffCount / visibleTotal) * 100}%` }}
                title={`Tariff Items (8-Digit): ${tariffCount}`}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
