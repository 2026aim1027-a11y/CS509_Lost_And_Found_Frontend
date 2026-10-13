import {
  Bike,
  GlassWater,
  Headphones,
  IdCard,
  KeyRound,
  Laptop,
  Package,
  Smartphone,
  Umbrella,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

const ICONS: Record<(typeof CATEGORIES)[number], LucideIcon> = {
  Bicycle: Bike,
  Phone: Smartphone,
  Laptop: Laptop,
  Earbuds: Headphones,
  Keys: KeyRound,
  "ID Card": IdCard,
  Bottle: GlassWater,
  Umbrella: Umbrella,
  Other: Package,
};

function Track({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-4 pr-4" aria-hidden={hidden || undefined}>
      {CATEGORIES.map((category) => {
        const Icon = ICONS[category];
        return (
          <li
            key={category}
            className="flex items-center gap-3 rounded-full border border-line bg-white/80 py-2.5 pl-2.5 pr-6 text-[15px] font-bold shadow-soft"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            {category}
          </li>
        );
      })}
    </ul>
  );
}

/** Endless strip of the item categories the portal tracks. Pauses on hover. */
export default function CategoryMarquee() {
  return (
    <section aria-label="Item categories" className="marquee-mask overflow-hidden py-4">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        <Track />
        <Track hidden />
      </div>
    </section>
  );
}
