import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import AuthShell from "@/components/layout/AuthShell";

export const metadata: Metadata = {
  title: "Create your account",
};

export default function RegisterPage() {
  return (
    <AuthShell
      headline="Lose less."
      accent="Find more."
      tagline="Join your campus network and help lost things find their way home."
      badge="Only @iitrpr.ac.in accounts can join"
    >
      <RegisterForm />
    </AuthShell>
  );
}
