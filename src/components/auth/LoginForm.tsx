"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { ArrowRight, Check, Mail } from "lucide-react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import PasswordField from "@/components/ui/PasswordField";
import TextField from "@/components/ui/TextField";
import { useAuth } from "@/context/AuthContext";
import { ApiError, errorMessage } from "@/lib/api";
import { normaliseEmail, safeNextPath, validateEmail } from "@/lib/validation";

const NOTICES: Record<string, string> = {
  registered: "Your account is ready. Log in to continue.",
  reset: "Password updated. Log in with your new password.",
  session: "Please log in to continue.",
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const next = safeNextPath(searchParams.get("next"));
  const notice = searchParams.get("registered")
    ? NOTICES.registered
    : searchParams.get("reset")
      ? NOTICES.reset
      : searchParams.get("next")
        ? NOTICES.session
        : "";

  // Already signed in (or just signed in): leave the login screen.
  useEffect(() => {
    if (!authLoading && user) router.replace(next);
  }, [authLoading, user, next, router]);

  // The route stays mounted while hidden; never keep a typed password or a stale error around.
  useLayoutEffect(
    () => () => {
      setPassword("");
      setError("");
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const invalidEmail = validateEmail(email);
    setEmailError(invalidEmail ?? "");
    if (invalidEmail) return;

    setSubmitting(true);
    try {
      // Setting the user triggers the redirect effect above.
      await login(normaliseEmail(email), password, remember);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(
        err instanceof ApiError && err.code === "no_active_account"
          ? "Incorrect email or password. Check them and try again."
          : errorMessage(err, "Could not log you in. Please try again."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="animate-fade-up text-4xl font-extrabold sm:text-[2.5rem]">Log in to FindIt</h1>
      <p className="stagger mt-3 animate-fade-up font-medium text-muted [--i:1]">
        Use your IIT Ropar email to continue.
      </p>

      <div className="mt-8 flex flex-col gap-5">
        {notice && !error && <Alert tone="success">{notice}</Alert>}
        {error && <Alert tone="error">{error}</Alert>}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <TextField
            label="Institute email"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder="2024csm1001@iitrpr.ac.in"
            icon={<Mail aria-hidden="true" />}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            error={emailError}
            wrapperClassName="stagger animate-fade-up [--i:2]"
            required
          />

          <PasswordField
            label="Password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            wrapperClassName="stagger animate-fade-up [--i:3]"
            required
          />

          <div className="stagger flex animate-fade-up items-center justify-between gap-4 [--i:4]">
            <label className="group flex cursor-pointer items-center gap-3 text-[15px] font-medium text-muted">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="peer sr-only"
              />
              <span className="flex size-6 items-center justify-center rounded-lg border-2 border-line bg-white text-transparent transition-all duration-200 group-hover:border-brand-400 peer-checked:border-brand-500 peer-checked:bg-brand-500 peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500">
                <Check className="size-4" strokeWidth={3.5} aria-hidden="true" />
              </span>
              Remember me
            </label>
            <Link href="/forgot-password" className="text-[15px] font-bold text-brand-700 hover:text-brand-800 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={submitting}
            disabled={!email || !password}
            className="stagger mt-1 animate-fade-up [--i:5]"
          >
            {submitting ? "Logging in…" : "Log in"}
            {!submitting && (
              <ArrowRight className="size-5 transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
            )}
          </Button>
        </form>

        <p className="stagger animate-fade-up pt-3 text-center text-[15px] font-medium text-muted [--i:6]">
          New to FindIt?{" "}
          <Link href="/register" className="font-bold text-brand-700 hover:text-brand-800 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
