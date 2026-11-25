"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface SidebarUserFooterProps {
  user?: any;
  isCollapsed: boolean;
  onLogout?: () => void;
}

export function SidebarUserFooter({ isCollapsed }: SidebarUserFooterProps) {
  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center py-2" title="Mercora · System Online">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#2B1220] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 pt-1 pb-0.5 select-none">
      <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
          <span className="text-[11px] font-semibold text-white/90 truncate">
            Enterprise Engine
          </span>
        </div>
        <span className="font-mono text-[10px] text-white/50 flex-shrink-0">
          v2.4 Online
        </span>
      </div>

      <Link
        href="/businesses"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between px-2.5 py-1 text-[11px] font-medium text-white/60 hover:text-white transition-colors"
      >
        <span>Live Directory</span>
        <ExternalLink className="w-3.5 h-3.5 text-white/40" />
      </Link>
    </div>
  );
}

export default SidebarUserFooter;
