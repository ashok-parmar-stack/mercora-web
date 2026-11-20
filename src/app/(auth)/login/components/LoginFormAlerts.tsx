import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

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
    <>
      {isDisplaced && (
        <div
          className="mb-3 p-2.5 rounded-xl flex items-start gap-2.5 text-xs leading-relaxed font-rethink"
          style={{
            background: 'var(--theme-warning-bg)',
            border: '1px solid var(--theme-warning-border)',
            color: 'var(--theme-warning)',
          }}
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block mb-0.5">Session Terminated</strong>
            {evictionNotice || 'You were logged out because a newer login was detected on another device.'}
          </div>
        </div>
      )}

      {verifiedNotice && (
        <div
          className="mb-3 p-2.5 rounded-xl flex items-start gap-2.5 text-xs leading-relaxed font-rethink"
          style={{
            background: 'var(--theme-success-bg)',
            border: '1px solid var(--theme-success-border)',
            color: 'var(--theme-success)',
          }}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block mb-0.5">Email Verified!</strong>
            Your account is fully activated. You can now sign in below.
          </div>
        </div>
      )}

      {error && (
        <div
          className="mb-3 p-2.5 rounded-xl flex items-start gap-2.5 text-xs leading-relaxed font-rethink animate-in fade-in duration-200"
          style={{
            background: 'var(--theme-error-bg)',
            border: '1px solid var(--theme-error-border)',
            color: 'var(--theme-error)',
          }}
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}
    </>
  );
}
