import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface LoginFormAlertsProps {
  isDisplaced: boolean;
  evictionNotice?: string | null;
  verifiedNotice: boolean;
  error?: string | null;
}

export function LoginFormAlerts({
  isDisplaced,
  evictionNotice,
  verifiedNotice,
  error,
}: LoginFormAlertsProps) {
  return (
    <div className="space-y-2 mb-2.5">
      {isDisplaced && (
        <div className="py-1.5 px-2.5 rounded-lg flex items-start gap-2 text-xs leading-snug bg-amber-500/10 border border-amber-500/25 text-amber-900 dark:text-amber-200 animate-in fade-in duration-150">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block text-[11px] text-amber-950 dark:text-amber-100">
              Session Terminated (1 User = 1 Device)
            </strong>
            <span className="text-[11px]">
              {evictionNotice || 'Active session detected on another device.'}
            </span>
          </div>
        </div>
      )}

      {verifiedNotice && (
        <div className="py-1.5 px-2.5 rounded-lg flex items-start gap-2 text-xs leading-snug bg-emerald-500/10 border border-emerald-500/25 text-emerald-900 dark:text-emerald-200 animate-in fade-in duration-150">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-[11px]">
            <strong className="font-semibold block text-[11px] text-emerald-950 dark:text-emerald-100">
              Email Verified!
            </strong>
            Account activated. Please sign in below.
          </div>
        </div>
      )}

      {error && (
        <div className="py-1.5 px-2.5 rounded-lg flex items-center gap-2 text-xs bg-[#B42318]/10 border border-[#B42318]/25 text-[#B42318] animate-in fade-in duration-150">
          <AlertTriangle className="w-3.5 h-3.5 text-[#B42318] shrink-0" />
          <span className="text-[11px] font-medium leading-tight">{error}</span>
        </div>
      )}
    </div>
  );
}
