import type { ReactNode } from "react";
import { Check } from "lucide-react";
import Logo from "@/components/brand/Logo";
import BackpackScene, { Backpack } from "@/components/illustrations/Backpack";

interface AuthShellProps {
  /** First line of the panel headline. */
  headline: string;
  /** Second line, set in emerald. */
  accent: string;
  tagline: string;
  /** Short reassurance shown in the pill at the bottom of the panel. */
  badge: string;
  children: ReactNode;
}

/**
 * Two-column frame for the auth screens: illustration panel on the left, form card on the right.
 * On large screens the panel is pinned to the viewport while a tall form scrolls beside it;
 * on small screens it collapses to a slim header.
 */
export default function AuthShell({ headline, accent, tagline, badge, children }: AuthShellProps) {
  return (
    <div className="mx-auto grid min-h-dvh w-full max-w-480 grid-rows-[auto_1fr] gap-4 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:grid-rows-1 lg:gap-8 lg:p-8 xl:gap-14 xl:p-12">
      <aside className="relative flex items-center justify-between overflow-hidden rounded-4xl bg-linear-to-br from-brand-100 to-brand-200 px-6 py-4 lg:sticky lg:top-8 lg:h-[calc(100dvh-4rem)] lg:flex-col lg:items-stretch lg:justify-start lg:self-start lg:rounded-panel lg:p-10 xl:top-12 xl:h-[calc(100dvh-6rem)]">
        <Logo className="relative z-10 self-start" />
        <Backpack className="w-14 lg:hidden" />

        <div className="hidden min-h-0 lg:flex lg:flex-1 lg:flex-col">
          <p className="headline mt-8 animate-fade-up text-[2.6rem] xl:text-[3.5rem] [@media(min-height:860px)]:mt-16">
            <span className="block">{headline}</span>
            <span className="block text-brand-500">{accent}</span>
          </p>
          {/* On short laptop screens the tagline gives its room to the illustration. */}
          <p className="stagger mt-5 max-w-md animate-fade-up text-[17px] font-medium leading-relaxed text-muted [--i:1] [@media(max-height:760px)]:hidden">
            {tagline}
          </p>

          <div className="flex min-h-0 flex-1 items-center justify-center py-6">
            <BackpackScene className="stagger h-full max-h-128 max-w-full animate-scale-in [--i:2]" />
          </div>

          <p className="stagger inline-flex h-14 shrink-0 animate-fade-up items-center gap-3 self-start rounded-full bg-white px-5 text-[15px] font-bold shadow-soft [--i:4]">
            <span className="flex size-6 items-center justify-center rounded-full bg-brand-100 text-brand-500">
              <Check className="size-3.5" strokeWidth={3.5} aria-hidden="true" />
            </span>
            {badge}
          </p>
        </div>
      </aside>

      <main className="glass flex flex-col rounded-4xl lg:rounded-panel">
        <div className="mx-auto flex w-full max-w-152 flex-1 flex-col px-5 py-9 sm:px-10 sm:py-12 lg:justify-center">
          {children}
        </div>
      </main>
    </div>
  );
}
