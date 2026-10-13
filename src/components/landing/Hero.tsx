"use client";

import { useRef, type CSSProperties, type PointerEvent } from "react";
import { ArrowRight, BadgeCheck, EyeOff, MapPin, ShieldCheck } from "lucide-react";
import BackpackScene from "@/components/illustrations/Backpack";
import { Bicycle, Phone } from "@/components/illustrations/Items";
import { RewardPill, TILES, TypeTag } from "@/components/landing/ItemCard";
import { ButtonLink } from "@/components/ui/Button";
import { scrollOnSamePage } from "@/components/ui/ScrollLink";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/cn";

const TRUST_POINTS = [
  { icon: ShieldCheck, label: "@iitrpr.ac.in accounts only" },
  { icon: BadgeCheck, label: "Admin-verified handovers" },
  { icon: EyeOff, label: "Private details stay hidden" },
];

const depth = (px: number) => ({ "--depth": `${px}px` }) as CSSProperties;

/** Small illustrative feed card that floats over the hero scene. */
function FloatingCard({
  type,
  title,
  place,
  tile,
  reward,
  children,
}: {
  type: "LOST" | "FOUND";
  title: string;
  place: string;
  tile: keyof typeof TILES;
  reward?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-3xl bg-white/85 p-2.5">
      <div className={cn("relative flex aspect-5/3 items-center justify-center rounded-2xl bg-linear-to-br", TILES[tile])}>
        <div className="flex w-full translate-y-[14%] items-center justify-center">{children}</div>
        <TypeTag type={type} className="absolute left-2.5 top-2.5 h-6 px-2.5 text-[10px]" />
        {reward !== undefined && <RewardPill amount={reward} className="absolute right-2.5 top-2.5 h-6 text-[10px] max-sm:hidden" />}
      </div>
      <p className="mt-2.5 truncate px-1.5 text-sm font-bold">{title}</p>
      <p className="flex items-center gap-1 px-1.5 pb-1 text-xs font-medium text-muted">
        <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="truncate">{place}</span>
      </p>
    </div>
  );
}

export default function Hero() {
  const { user, loading } = useAuth();
  const stage = useRef<HTMLDivElement>(null);

  // Written straight to CSS variables so pointer movement never re-renders React.
  const tilt = (x: number, y: number) => {
    stage.current?.style.setProperty("--px", x.toFixed(3));
    stage.current?.style.setProperty("--py", y.toFixed(3));
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    tilt((event.clientX - box.left) / box.width - 0.5, (event.clientY - box.top) / box.height - 0.5);
  };

  const firstName = user?.full_name?.split(" ")[0];

  return (
    <section
      onPointerMove={handlePointerMove}
      onPointerLeave={() => tilt(0, 0)}
      className="mx-auto grid w-full max-w-7xl items-center gap-14 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-10 lg:pb-24 lg:pt-14"
    >
      <div className="flex flex-col items-start">
        <p className="inline-flex animate-fade-up items-center gap-2.5 rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-bold shadow-soft">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-brand-500" />
          </span>
          {firstName ? `Welcome back, ${firstName}` : "Built for the IIT Ropar campus"}
        </p>

        <h1 className="headline stagger mt-7 animate-fade-up text-[3.25rem] [--i:1] sm:text-7xl xl:text-[5.25rem]">
          <span className="block">Lose less.</span>
          <span className="text-gradient-brand block pb-2">Find more.</span>
        </h1>

        <p className="stagger mt-6 max-w-xl animate-fade-up text-lg font-medium leading-relaxed text-muted [--i:2]">
          FindIt is the lost and found for IIT Ropar. Report what you lost, post what you found, and let the
          administration verify every handover, so things get back to the right person.
        </p>

        <div className="stagger mt-9 flex min-h-14 animate-fade-up flex-wrap items-center gap-3 [--i:3]">
          {!loading &&
            (user ? (
              <ButtonLink href="/profile" size="lg" className="max-sm:w-full">
                Open my profile
                <ArrowRight className="size-5 transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
              </ButtonLink>
            ) : (
              <ButtonLink href="/register" size="lg" className="max-sm:w-full">
                Get started
                <ArrowRight className="size-5 transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
              </ButtonLink>
            ))}
          <ButtonLink href="/#how-it-works" variant="secondary" size="lg" className="max-sm:w-full" onClick={scrollOnSamePage}>
            See how it works
          </ButtonLink>
        </div>

        <ul className="stagger mt-10 flex animate-fade-up flex-wrap gap-x-6 gap-y-3 [--i:4]">
          {TRUST_POINTS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
              <Icon className="size-4.5 text-brand-600" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div ref={stage} aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-136 animate-scale-in [animation-delay:0.15s]">
        <div className="absolute inset-[5%] rotate-3 rounded-[3.5rem] bg-linear-to-br from-brand-100 to-brand-200" />

        <div className="parallax absolute inset-[16%]" style={depth(12)}>
          <BackpackScene className="w-full" />
        </div>

        <div className="parallax absolute -left-[2%] top-0 w-[40%]" style={depth(34)}>
          <div className="animate-float">
            <FloatingCard type="LOST" title="Black Hero Sprint bicycle" place="Library, Gate 2" tile="mint" reward={500}>
              <Bicycle className="w-[62%]" />
            </FloatingCard>
          </div>
        </div>

        <div className="parallax absolute -right-[3%] top-[27%] w-[33%]" style={depth(46)}>
          <div className="animate-float-slow [animation-delay:1.4s]">
            <FloatingCard type="FOUND" title="Blue phone, cracked case" place="Cafeteria" tile="periwinkle">
              <Phone className="w-[30%]" />
            </FloatingCard>
          </div>
        </div>

        <div className="parallax absolute bottom-[3%] left-[5%]" style={depth(24)}>
          <p className="glass flex animate-float items-center gap-3 rounded-full bg-white/90 py-2.5 pl-2.5 pr-5 text-sm font-bold [animation-delay:0.7s]">
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-500 text-white">
              <BadgeCheck className="size-5" />
            </span>
            Owner verified · Handed over
          </p>
        </div>
      </div>
    </section>
  );
}
