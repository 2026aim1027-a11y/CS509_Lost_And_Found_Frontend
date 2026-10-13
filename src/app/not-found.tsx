import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/brand/Logo";
import BackpackScene from "@/components/illustrations/Backpack";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex h-22 w-full max-w-7xl items-center px-4 sm:px-6">
        <Logo tagline size="sm" />
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 pb-24 text-center sm:px-6">
        <BackpackScene className="w-56 animate-scale-in sm:w-64" />
        <p className="stagger mt-8 animate-fade-up rounded-full bg-coral-100 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-coral-700 [--i:1]">
          Error 404
        </p>
        <h1 className="headline stagger mt-5 animate-fade-up text-5xl [--i:2] sm:text-6xl">This page is lost.</h1>
        <p className="stagger mt-4 max-w-md animate-fade-up text-lg font-medium text-muted [--i:3]">
          Even we couldn&apos;t find it. It may have moved, or it may not be built yet.
        </p>
        <ButtonLink href="/" size="lg" className="stagger mt-9 animate-fade-up [--i:4]">
          <ArrowLeft className="size-5 transition-transform group-hover/btn:-translate-x-1" aria-hidden="true" />
          Back to home
        </ButtonLink>
      </main>
    </div>
  );
}
