"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, Mail, Phone, UserRound } from "lucide-react";
import OtpStep from "@/components/auth/OtpStep";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import SuccessBurst from "@/components/auth/SuccessBurst";
import Alert from "@/components/ui/Alert";
import Button, { ButtonLink } from "@/components/ui/Button";
import PasswordField from "@/components/ui/PasswordField";
import SelectField from "@/components/ui/SelectField";
import Stepper from "@/components/ui/Stepper";
import TextField from "@/components/ui/TextField";
import { useAuth } from "@/context/AuthContext";
import { ApiError, apiClient, errorMessage } from "@/lib/api";
import {
  DEPARTMENTS,
  HOSTEL_SUGGESTIONS,
  OTP_EXPIRY_SECONDS,
  OTP_LENGTH,
  OTP_RESEND_COOLDOWN_SECONDS,
  PROGRAM_YEARS,
} from "@/lib/constants";
import { useCountdown } from "@/lib/useCountdown";
import {
  normaliseEmail,
  registrationNumberFromEmail,
  validateEmail,
  validateFullName,
  validatePassword,
  validatePhone,
  validateRegistrationNumber,
} from "@/lib/validation";
import type { MessageResponse, OtpResponse, RegisterPayload } from "@/types/auth";

const STEPS = ["Email", "Verify", "Profile"] as const;
const EMAIL = 0;
const VERIFY = 1;
const PROFILE = 2;
const DONE = 3;

type ProfileFields = Omit<RegisterPayload, "email">;
type FieldErrors = Partial<Record<keyof RegisterPayload, string>>;

const EMPTY_PROFILE: ProfileFields = {
  full_name: "",
  registration_number: "",
  department: "",
  program_year: "",
  hostel: "",
  phone: "",
  password: "",
};

export default function RegisterForm() {
  const router = useRouter();
  const { user, loading: authLoading, login } = useAuth();

  const [step, setStep] = useState(EMAIL);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [debugCode, setDebugCode] = useState("");
  const [profile, setProfile] = useState<ProfileFields>(EMPTY_PROFILE);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  // After the account exists we sign the user in for them; "manual" means that failed.
  const [session, setSession] = useState<"pending" | "ready" | "manual">("pending");

  const expiry = useCountdown();
  const cooldown = useCountdown();
  const finished = useRef(false);

  // Signed-in users have no business here, except on the welcome screen they just reached.
  useEffect(() => {
    if (!authLoading && user && step !== DONE) router.replace("/");
  }, [authLoading, user, step, router]);

  // The route stays mounted while hidden, so a half-filled sign-up survives a detour to
  // another page. A completed one must not: start clean on the next visit.
  useLayoutEffect(
    () => () => {
      if (!finished.current) return;
      finished.current = false;
      setStep(EMAIL);
      setEmail("");
      setCode("");
      setDebugCode("");
      setProfile(EMPTY_PROFILE);
      setError("");
    },
    [],
  );

  const setField = <K extends keyof ProfileFields>(field: K, value: ProfileFields[K]) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const requestOtp = async () => {
    setError("");
    const invalid = validateEmail(email);
    setFieldErrors({ email: invalid });
    if (invalid) return;

    const address = normaliseEmail(email);
    setLoading(true);
    try {
      const res = await apiClient<OtpResponse>("/auth/request-otp/", {
        method: "POST",
        data: { email: address, purpose: "registration" },
        auth: false,
      });
      setEmail(address);
      setDebugCode(res.debug_otp ?? "");
      setCode(res.debug_otp ?? "");
      setOtpError("");
      expiry.start(OTP_EXPIRY_SECONDS);
      cooldown.start(OTP_RESEND_COOLDOWN_SECONDS);
      setStep(VERIFY);
    } catch (err) {
      const emailError = err instanceof ApiError ? err.field("email") : undefined;
      if (emailError) setFieldErrors({ email: emailError });
      else setError(errorMessage(err, "Could not send the verification code. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setResending(true);
    await requestOtp();
    setResending(false);
  };

  const verifyOtp = async (submitted: string = code) => {
    if (submitted.length !== OTP_LENGTH || loading) return;
    setOtpError("");
    setLoading(true);
    try {
      await apiClient<MessageResponse>("/auth/verify-otp/", {
        method: "POST",
        data: { email, code: submitted, purpose: "registration" },
        auth: false,
      });
      setProfile((current) => ({
        ...current,
        registration_number: current.registration_number || registrationNumberFromEmail(email),
      }));
      setStep(PROFILE);
    } catch (err) {
      setOtpError(errorMessage(err, "That code didn't work. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
    setError("");
    const errors: FieldErrors = {
      full_name: validateFullName(profile.full_name),
      registration_number: validateRegistrationNumber(profile.registration_number),
      program_year: profile.program_year ? undefined : "Select your program and year.",
      department: profile.department ? undefined : "Select your department.",
      phone: validatePhone(profile.phone),
      password: validatePassword(profile.password),
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    const payload: RegisterPayload = {
      email,
      ...profile,
      full_name: profile.full_name.trim(),
      registration_number: profile.registration_number.trim().toUpperCase(),
      hostel: profile.hostel.trim(),
      phone: profile.phone.trim(),
    };

    setLoading(true);
    try {
      await apiClient("/auth/register/", { method: "POST", data: payload, auth: false });
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fieldErrors).length > 0) {
        const fromServer: FieldErrors = {};
        for (const [field, messages] of Object.entries(err.fieldErrors)) {
          fromServer[field as keyof RegisterPayload] = messages[0];
        }
        setFieldErrors(fromServer);
        // The email field isn't on this step, so surface its error at the top.
        setError(fromServer.email ?? "");
      } else {
        setError(errorMessage(err, "Could not create your account. Please try again."));
      }
      setLoading(false);
      return;
    }

    // Show the welcome screen first: once `user` is set, the redirect effect would fire.
    finished.current = true;
    setSession("pending");
    setStep(DONE);
    setLoading(false);
    setProfile((current) => ({ ...current, password: "" }));
    try {
      await login(payload.email, payload.password);
      setSession("ready");
    } catch {
      setSession("manual");
    }
  };

  const changeEmail = () => {
    setStep(EMAIL);
    setCode("");
    setDebugCode("");
    setOtpError("");
    setError("");
  };

  const firstName = profile.full_name.trim().split(/\s+/)[0];

  return (
    <div className="flex flex-col">
      <Stepper steps={STEPS} current={step} className="mb-10" />

      {step === EMAIL && (
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
            <h1 className="text-4xl font-extrabold sm:text-[2.5rem]">Create your account</h1>
            <p className="mt-3 font-medium text-muted">
              Start with your IIT Ropar email. We&apos;ll send a 6-digit code to confirm it&apos;s yours.
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
              setFieldErrors({});
            }}
            error={fieldErrors.email}
            hint="Only @iitrpr.ac.in addresses can join."
            required
          />

          <Button type="submit" size="lg" fullWidth loading={loading} disabled={!email}>
            {loading ? "Sending code…" : "Send verification code"}
            {!loading && <ArrowRight className="size-5 transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />}
          </Button>
        </form>
      )}

      {step === VERIFY && (
        <form
          key="verify"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void verifyOtp();
          }}
          className="flex animate-step-in flex-col gap-5"
        >
          <header>
            <h1 className="text-4xl font-extrabold sm:text-[2.5rem]">Check your inbox</h1>
            <p className="mt-3 font-medium text-muted">
              Enter the 6-digit code we sent to <span className="font-bold text-ink">{email}</span>.
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
            onComplete={(value) => void verifyOtp(value)}
            error={otpError}
            debugCode={debugCode}
            expiresIn={expiry.secondsLeft}
            resendIn={cooldown.secondsLeft}
            onResend={() => void resendOtp()}
            resending={resending}
            busy={loading}
          />

          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={loading && !resending}
            disabled={resending || code.length !== OTP_LENGTH || expiry.secondsLeft <= 0}
          >
            {loading && !resending ? "Verifying…" : "Verify code"}
          </Button>

          <button
            type="button"
            onClick={changeEmail}
            className="inline-flex items-center gap-2 self-start text-[15px] font-bold text-muted hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Use a different email
          </button>
        </form>
      )}

      {step === PROFILE && (
        <form
          key="profile"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void register();
          }}
          className="flex animate-step-in flex-col gap-5"
        >
          <header>
            <h1 className="text-4xl font-extrabold sm:text-[2.5rem]">Tell us about you</h1>
            <p className="mt-3 font-medium text-muted">
              Last step. This helps the administration and finders recognise you.
            </p>
          </header>

          {error && <Alert tone="error">{error}</Alert>}

          <TextField
            label="Full name"
            name="full_name"
            autoComplete="name"
            autoFocus
            placeholder="e.g. Aarav Sharma"
            icon={<UserRound aria-hidden="true" />}
            maxLength={150}
            value={profile.full_name}
            onChange={(e) => setField("full_name", e.target.value)}
            error={fieldErrors.full_name}
            required
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Registration number"
              name="registration_number"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="e.g. 2024CSM1001"
              maxLength={11}
              className="uppercase placeholder:normal-case"
              value={profile.registration_number}
              onChange={(e) => setField("registration_number", e.target.value.toUpperCase())}
              error={fieldErrors.registration_number}
              required
            />
            <SelectField
              label="Program & year"
              name="program_year"
              placeholder="Select year"
              options={PROGRAM_YEARS}
              value={profile.program_year}
              onChange={(e) => setField("program_year", e.target.value)}
              error={fieldErrors.program_year}
              required
            />
          </div>

          <SelectField
            label="Department"
            name="department"
            placeholder="Select department"
            options={DEPARTMENTS}
            value={profile.department}
            onChange={(e) => setField("department", e.target.value)}
            error={fieldErrors.department}
            required
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Hostel"
              note="optional"
              name="hostel"
              list="hostel-suggestions"
              placeholder="e.g. Satluj"
              maxLength={100}
              value={profile.hostel}
              onChange={(e) => setField("hostel", e.target.value)}
              error={fieldErrors.hostel}
            />
            <datalist id="hostel-suggestions">
              {HOSTEL_SUGGESTIONS.map((hostel) => (
                <option key={hostel} value={hostel} />
              ))}
            </datalist>
            <TextField
              label="Phone"
              note="optional"
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              placeholder="e.g. 9876543210"
              icon={<Phone aria-hidden="true" />}
              maxLength={15}
              value={profile.phone}
              onChange={(e) => setField("phone", e.target.value)}
              error={fieldErrors.phone}
            />
          </div>

          <div className="flex flex-col gap-3">
            <PasswordField
              label="Create a password"
              name="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={profile.password}
              onChange={(e) => setField("password", e.target.value)}
              error={fieldErrors.password}
              required
            />
            <PasswordStrengthMeter password={profile.password} />
          </div>

          <Button type="submit" size="lg" fullWidth loading={loading} className="mt-1">
            {loading ? "Creating your account…" : "Create account"}
            {!loading && <ArrowRight className="size-5 transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />}
          </Button>

          <button
            type="button"
            onClick={changeEmail}
            className="inline-flex items-center gap-2 self-start text-[15px] font-bold text-muted hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Use a different email
          </button>
        </form>
      )}

      {step === DONE && (
        <div key="done" className="flex animate-step-in flex-col items-center py-4 text-center">
          <SuccessBurst />
          <h1 className="mt-8 text-4xl font-extrabold sm:text-[2.5rem]">
            You&apos;re in{firstName ? `, ${firstName}` : ""}!
          </h1>
          <p className="mt-3 max-w-sm font-medium text-muted">
            Your FindIt account is ready and your institute email is verified.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-2 text-sm font-bold text-brand-800">
            <BadgeCheck className="size-4.5" aria-hidden="true" />
            {email}
          </p>

          <div className="mt-9 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            {session === "manual" ? (
              <ButtonLink href="/login?registered=true" size="lg">
                Log in to continue
                <ArrowRight className="size-5" aria-hidden="true" />
              </ButtonLink>
            ) : (
              <>
                <Button size="lg" loading={session === "pending"} onClick={() => router.push("/")}>
                  {session === "pending" ? "Signing you in…" : "Go to home"}
                </Button>
                {session === "ready" && (
                  <ButtonLink href="/profile" variant="secondary" size="lg">
                    View my profile
                  </ButtonLink>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {step !== DONE && (
        <p className="pt-8 text-center text-[15px] font-medium text-muted">
          Already registered?{" "}
          <Link href="/login" className="font-bold text-brand-700 hover:text-brand-800 hover:underline">
            Log in
          </Link>
        </p>
      )}
    </div>
  );
}
