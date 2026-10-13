import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import AuthShell from "@/components/layout/AuthShell";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return (
    <AuthShell
      headline="Welcome back."
      accent="Let's find it."
      tagline="Your reports, your profile and every update on your items, in one place."
      badge="Every handover is verified by the administration"
    >
      {/* LoginForm reads the query string, which is only known in the browser. */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
