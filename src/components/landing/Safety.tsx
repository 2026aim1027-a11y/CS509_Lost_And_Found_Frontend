import { EyeOff, GraduationCap, ScrollText, ShieldCheck, type LucideIcon } from "lucide-react";
import SectionHeading from "@/components/landing/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const RULES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: EyeOff,
    title: "Hidden by default",
    description: "Serial numbers, identifying marks and exact spots never reach the public feed.",
  },
  {
    icon: ShieldCheck,
    title: "One authority",
    description: "Only the administration verifies owners and supervises handovers.",
  },
  {
    icon: GraduationCap,
    title: "Campus-only accounts",
    description: "Signing up needs an @iitrpr.ac.in email, confirmed with a one-time code.",
  },
  {
    icon: ScrollText,
    title: "Everything is logged",
    description: "Every review, match and handover leaves an audit trail for the administration.",
  },
];

export default function Safety() {
  return (
    <section id="safety" className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div className="relative overflow-hidden rounded-4xl bg-ink px-6 py-14 sm:px-10 lg:rounded-panel lg:px-16 lg:py-20">
        {/* Emerald and coral glows, plus a faint dot grid, on the dark panel. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-40 size-136 rounded-full bg-[radial-gradient(closest-side,rgb(16_185_129/0.35),transparent)]" />
          <div className="absolute -bottom-52 -left-32 size-120 rounded-full bg-[radial-gradient(closest-side,rgb(255_107_87/0.2),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)] bg-[size:22px_22px]" />
        </div>

        <div className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
          <SectionHeading
            inverse
            align="left"
            eyebrow="Safety"
            title="Private by default. Verified by people."
            description="A lost and found only works if the right person walks away with the item. These rules are built into the portal, not left to chance."
          />

          <ul className="grid gap-4 sm:grid-cols-2">
            {RULES.map(({ icon: Icon, title, description }, index) => (
              <Reveal
                as="li"
                key={title}
                index={index}
                className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm transition-colors duration-300 hover:border-brand-400/50 hover:bg-white/10"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-300">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-white">{title}</h3>
                <p className="mt-2 text-[15px] font-medium leading-relaxed text-white/65">{description}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
