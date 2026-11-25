import React from "react";
import { Select } from "@/components/ui/Select";

interface HsnFilterSlotProps {
  selectedLevel: string;
  onLevelChange: (level: string) => void;
  selectedSource: string;
  onSourceChange: (source: string) => void;
}

export function HsnFilterSlot({
  selectedLevel,
  onLevelChange,
  selectedSource,
  onSourceChange,
}: HsnFilterSlotProps) {
  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      <div className="w-40">
        <Select
          value={selectedLevel}
          onChange={(e) => onLevelChange(e.target.value)}
          dropdownPosition="bottom"
          aria-label="Filter by level"
        >
          <option value="ALL">All Levels</option>
          <option value="CHAPTER_2">2-Digit Chapter</option>
          <option value="HEADING_4">4-Digit Heading</option>
          <option value="SUBHEADING_6">6-Digit Subheading</option>
          <option value="TARIFF_ITEM_8">8-Digit Tariff Item</option>
        </Select>
      </div>

      <div className="w-36">
        <Select
          value={selectedSource}
          onChange={(e) => onSourceChange(e.target.value)}
          dropdownPosition="bottom"
          aria-label="Filter by source"
        >
          <option value="ALL">All Sources</option>
          <option value="ICEGATE">ICEGATE</option>
          <option value="MANUAL">Manual</option>
        </Select>
      </div>
    </div>
  );
}
