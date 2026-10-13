"use client";

import { RotateCw } from "lucide-react";
import Alert from "@/components/ui/Alert";
import OtpInput from "@/components/ui/OtpInput";
import { formatClock } from "@/lib/useCountdown";

interface OtpStepProps {
  email: string;
  code: string;
  onCodeChange: (code: string) => void;
  onComplete?: (code: string) => void;
  /** Error from the last verification attempt; shakes the boxes. */
  error?: string;
  /** Code echoed back by a DEBUG backend, shown so local testing needs no mailbox. */
  debugCode?: string;
  /** Seconds until the code expires and until another one may be requested. */
  expiresIn: number;
  resendIn: number;
  onResend: () => void;
  resending?: boolean;
  /** A verification request is in flight. */
  busy?: boolean;
}

/** The six-digit code entry shared by sign-up and password reset. */
export default function OtpStep({
  email,
  code,
  onCodeChange,
  onComplete,
  error,
  debugCode,
  expiresIn,
  resendIn,
  onResend,
  resending = false,
  busy = false,
}: OtpStepProps) {
  const expired = expiresIn <= 0;

  return (
    <div className="flex flex-col gap-4">
      {debugCode && (
        <Alert tone="dev" title="Dev mode">
          The backend is running with DEBUG on, so the code is filled in for you:{" "}
          <span className="font-mono font-extrabold tracking-widest">{debugCode}</span>
        </Alert>
      )}

      <OtpInput
        label={`Verification code sent to ${email}`}
        value={code}
        onChange={onCodeChange}
        onComplete={onComplete}
        invalid={Boolean(error)}
        busy={busy}
        autoFocus
      />

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm font-medium text-muted">
        <p aria-live="polite">
          {expired ? (
            <span className="font-bold text-coral-700">This code has expired. Request a new one.</span>
          ) : (
            <>
              Expires in <span className="font-bold tabular-nums text-ink">{formatClock(expiresIn)}</span>
            </>
          )}
        </p>
        {resendIn > 0 ? (
          <p>
            Resend in <span className="font-bold tabular-nums text-ink">{formatClock(resendIn)}</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={onResend}
            disabled={resending}
            className="inline-flex items-center gap-1.5 font-bold text-brand-700 hover:text-brand-800 hover:underline disabled:opacity-60"
          >
            <RotateCw className={resending ? "size-4 animate-spin-slow" : "size-4"} aria-hidden="true" />
            {resending ? "Sending…" : "Resend code"}
          </button>
        )}
      </div>
    </div>
  );
}
