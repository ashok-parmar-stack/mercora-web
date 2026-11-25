import React from "react";

interface PasswordStrengthIndicatorProps {
  score: number;
  label: string;
  color: string;
}

export function PasswordStrengthIndicator({ score, label, color }: PasswordStrengthIndicatorProps) {
  return (
    <div className="pt-0.5 space-y-0.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              background: i <= score ? color : "#E5D4DA",
            }}
          />
        ))}
      </div>
      <p className="text-[10px] font-semibold" style={{ color }}>
        {label} password
      </p>
    </div>
  );
}
