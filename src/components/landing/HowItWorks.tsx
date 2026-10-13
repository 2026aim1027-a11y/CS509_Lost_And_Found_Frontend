import SectionHeading from "@/components/landing/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

type Role = "Student" | "System" | "Administration";

const ROLE_STYLES: Record<Role, string> = {
  Student: "bg-brand-100 text-brand-800",
  System: "bg-amber-100 text-amber-900",
  Administration: "bg-coral-100 text-coral-700",
};

const STEPS: { role: Role; title: string; description: string }[] = [
  {
    role: "Student",
    title: "File a report",
    description:
      "Owners post what they lost, finders post what they found. Photos, place and time go on the report; identifying marks stay private.",
  },
  {
    role: "Administration",
    title: "Reviewed before it goes live",
    description:
      "The administration checks every post first, so the feed stays clean and sensitive items like wallets and cash are never shown publicly.",
  },
  {
    role: "Student",
    title: "Keep it safe",
    description:
      "The finder holds on to the item, or leaves it at the admin or security office where it is logged against the report.",
  },
  {
    role: "System",
    title: "Matched automatically",
    description:
      "Lost and found reports are compared on category, place, time and description. Likely pairs are queued for the administration.",
  },
  {
    role: "Administration",
    title: "Owner verified",
    description:
      "The owner answers questions only they could know: the colour, a scratch, the wallpaper, a serial number.",
  },
  {
    role: "Administration",
    title: "Handed over and closed",
    description:
      "A one-time handover code completes the return, any promised reward is settled, and the case is closed.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
      <SectionHeading
        eyebrow="How it works"
        title="From lost to returned in six steps"
        description="One rule holds it together: nothing is handed over until the administration has verified the owner."
      />

      <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step, index) => (
          <Reveal
            as="li"
            key={step.title}
            index={index % 3}
            className="glass group relative overflow-hidden rounded-card p-7 transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-1.5 hover:shadow-[0_22px_44px_rgb(28_28_30/0.12)]"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-9 -right-1 select-none text-[9rem] font-extrabold leading-none text-brand-500/[0.07] transition-colors duration-500 group-hover:text-brand-500/15"
            >
              {index + 1}
            </span>
            <div className="flex items-center justify-between gap-3">
              <span className="flex size-12 items-center justify-center rounded-full bg-brand-500 text-lg font-extrabold text-white shadow-brand transition-transform duration-500 ease-spring group-hover:scale-110">
                {index + 1}
              </span>
              <span className={cn("rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-widest", ROLE_STYLES[step.role])}>
                {step.role}
              </span>
            </div>
            <h3 className="mt-6 text-[22px] font-extrabold">{step.title}</h3>
            <p className="relative mt-2.5 text-[15px] font-medium leading-relaxed text-muted">{step.description}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
