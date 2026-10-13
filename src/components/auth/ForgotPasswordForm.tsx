"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import OtpStep from "@/components/auth/OtpStep";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import PasswordField from "@/components/ui/PasswordField";
import Stepper from "@/components/ui/Stepper";
import TextField from "@/components/ui/TextField";
import { ApiError, apiClient, errorMessage } from "@/lib/api";
import { OTP_EXPIRY_SECONDS, OTP_LENGTH, OTP_RESEND_COOLDOWN_SECONDS } from "@/lib/constants";
import { useCountdown } from "@/lib/useCountdown";
import { normaliseEmail, validateEmail, validatePassword } from "@/lib/validation";
import type { MessageResponse, OtpResponse } from "@/types/auth";

const STEPS = ["Email", "New password"] as const;

export default function ForgotPasswordForm() {
  const router = useRouter();

  const [step, setStep] = useState<0 | 1>(0);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [debugCode, setDebugCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const expiry = useCountdown();
  const cooldown = useCountdown();

  const requestOtp = async () => {
    setError("");
    const invalid = validateEmail(email);
    setEmailError(invalid ?? "");
    if (invalid) return;

    const address = normaliseEmail(email);
    setLoading(true);
    try {
      const res = await apiClient<OtpResponse>("/auth/request-otp/", {
        method: "POST",
        data: { email: address, purpose: "password_reset" },
        auth: false,
      });
      setEmail(address);
      setDebugCode(res.debug_otp ?? "");
      setCode(res.debug_otp ?? "");
      setOtpError("");
      expiry.start(OTP_EXPIRY_SECONDS);
      cooldown.start(OTP_RESEND_COOLDOWN_SECONDS);
      setStep(1);
    } catch (err) {
      const fieldError = err instanceof ApiError ? err.field("email") : undefined;
      if (fieldError) setEmailError(fieldError);
      else setError(errorMessage(err, "Could not send the reset code. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setResending(true);
    await requestOtp();
    setResending(false);
  };

  const resetPassword = async () => {
    setError("");
    setOtpError("");
    const invalid = validatePassword(newPassword);
    setPasswordError(invalid ?? "");
    if (invalid || code.length !== OTP_LENGTH) return;

    setLoading(true);
    try {
      await apiClient<MessageResponse>("/auth/password-reset-confirm/", {
        method: "POST",
        data: { email, code, new_password: newPassword },
        auth: false,
      });
      // Leave nothing behind in this (still mounted) route before moving on.
      setStep(0);
      setEmail("");
      setCode("");
      setDebugCode("");
      setNewPassword("");
      router.replace("/login?reset=success");
    } catch (err) {
      if (err instanceof ApiError && err.code === "invalid_otp") {
        setOtpError(err.message);
      } else if (err instanceof ApiError && err.field("new_password")) {
        setPasswordError(err.field("new_password") ?? "");
      } else {
        setError(errorMessage(err, "Could not reset your password. Please try again."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <Stepper steps={STEPS} current={step} className="mb-10" />

      {step === 0 ? (
        <form
          key="email"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void requestOtp();
          }}
          className="flex animate-step-in flex-col gap-5"
        >
          <header>
            <h1 className="text-4xl font-extrabold sm:text-[2.5rem]">Forgot your password?</h1>
            <p className="mt-3 font-medium text-muted">
              Enter the email you registered with and we&apos;ll send a 6-digit code to reset it.
            </p>
          </header>

          {error && <Alert tone="error">{error}</Alert>}

          <TextField
            label="Institute email"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            autoFocus
            placeholder="2024csm1001@iitrpr.ac.in"
            icon={<Mail aria-hidden="true" />}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            error={emailError}
            required
          />

          <Button type="submit" size="lg" fullWidth loading={loading} disabled={!email}>
            {loading ? "Sending code…" : "Send reset code"}
            {!loading && <ArrowRight className="size-5 transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />}
          </Button>
        </form>
      ) : (
        <form
          key="reset"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void resetPassword();
          }}
          className="flex animate-step-in flex-col gap-5"
        >
          <header>
            <h1 className="text-4xl font-extrabold sm:text-[2.5rem]">Set a new password</h1>
            <p className="mt-3 font-medium text-muted">
              Enter the code we sent to <span className="font-bold text-ink">{email}</span> and choose a new password.
            </p>
          </header>

          {(otpError || error) && <Alert tone="error">{otpError || error}</Alert>}

          <OtpStep
            email={email}
            code={code}
            onCodeChange={(value) => {
              setCode(value);
              setOtpError("");
            }}
            error={otpError}
            debugCode={debugCode}
            expiresIn={expiry.secondsLeft}
            resendIn={cooldown.secondsLeft}
            onResend={() => void resendOtp()}
            resending={resending}
            busy={loading}
          />

          <div className="flex flex-col gap-3">
            <PasswordField
              label="New password"
              name="new_password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordError("");
              }}
              error={passwordError}
              required
            />
            <PasswordStrengthMeter password={newPassword} />
          </div>

          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={loading && !resending}
            disabled={resending || code.length !== OTP_LENGTH || !newPassword || expiry.secondsLeft <= 0}
          >
            {loading && !resending ? "Updating password…" : "Update password"}
          </Button>

          <button
            type="button"
            onClick={() => {
              setStep(0);
              setCode("");
              setDebugCode("");
              setOtpError("");
              setError("");
            }}
            className="inline-flex items-center gap-2 self-start text-[15px] font-bold text-muted hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Use a different email
          </button>
        </form>
      )}

      <p className="pt-8 text-center text-[15px] font-medium text-muted">
        Remembered it?{" "}
        <Link href="/login" className="font-bold text-brand-700 hover:text-brand-800 hover:underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
