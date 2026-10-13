"use client";

import { ArrowRight } from "lucide-react";
import { Keys } from "@/components/illustrations/Backpack";
import { ButtonLink } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { useAuth } from "@/context/AuthContext";

export default function CallToAction() {
  const { user, loading } = useAuth();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
      <Reveal className="relative overflow-hidden rounded-4xl bg-linear-to-br from-brand-500 to-brand-700 px-6 py-14 shadow-brand-lg sm:px-10 lg:rounded-panel lg:px-16 lg:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="absolute -right-16 -top-24 size-80 rounded-full bg-white/10" />
          <span className="absolute -bottom-28 right-40 size-64 rounded-full bg-white/10" />
          <span className="absolute -left-20 top-1/2 size-56 rounded-full bg-white/5" />
          <div className="absolute bottom-10 right-10 hidden w-72 -rotate-12 lg:block">
            <Keys className="w-full animate-sway drop-shadow-[0_14px_18px_rgb(6_78_59/0.45)]" />
          </div>
        </div>

        <div className="relative max-w-2xl">
          <h2 className="headline text-4xl text-white sm:text-5xl lg:text-6xl">
            Lost something?
            <br />
            Found something?
          </h2>
          <p className="mt-5 max-w-xl text-lg font-medium leading-relaxed text-white/85">
            It takes a minute to join with your institute email. The sooner a report is filed, the sooner an item finds
            its way back.
          </p>

          <div className="mt-9 flex min-h-14 flex-wrap gap-3">
            {!loading &&
              (user ? (
                <ButtonLink href="/profile" variant="inverse" size="lg">
                  Open my profile
                  <ArrowRight className="size-5 transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
                </ButtonLink>
              ) : (
                <>
                  <ButtonLink href="/register" variant="inverse" size="lg">
                    Create your account
                    <ArrowRight className="size-5 transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
                  </ButtonLink>
                  <ButtonLink
                    href="/login"
                    size="lg"
                    variant="ghost"
                    className="border-[1.5px] border-white/40 text-white hover:bg-white/15"
                  >
                    Log in
                  </ButtonLink>
                </>
              ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
