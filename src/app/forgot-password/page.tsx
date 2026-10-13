import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import AuthShell from "@/components/layout/AuthShell";

export const metadata: Metadata = {
  title: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      headline="Locked out?"
      accent="Back in a minute."
      tagline="Verify your institute email with a one-time code and choose a new password."
      badge="Codes expire after 5 minutes"
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
