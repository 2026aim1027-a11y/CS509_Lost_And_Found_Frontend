import type { ReactNode } from "react";
import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";

export type PostType = "LOST" | "FOUND";

/** Pastel backdrops behind item artwork, straight from the design palette. */
export const TILES = {
  mint: "from-[#D9F3E8] to-[#B5E6CF]",
  peach: "from-[#FFE2DC] to-[#FFC4B8]",
  periwinkle: "from-[#E4E8FB] to-[#C5CEF5]",
  amber: "from-[#FFF0CC] to-[#FFE099]",
  lavender: "from-[#E9E1F7] to-[#D2C4EF]",
  sky: "from-[#DDEFF5] to-[#B8DDEA]",
} as const;

export function TypeTag({ type, className }: { type: PostType; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full px-3 text-xs font-extrabold tracking-widest text-white",
        type === "LOST" ? "bg-coral-500" : "bg-brand-500",
        className,
      )}
    >
      {type}
    </span>
  );
}

export function RewardPill({ amount, className }: { amount: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full bg-amber-500 pl-1.5 pr-3 text-xs font-bold text-amber-900",
        className,
      )}
    >
      <span className="flex size-4 items-center justify-center rounded-full bg-[#FFF3CF] text-[9px] font-extrabold" aria-hidden="true">
        ₹
      </span>
      Reward ₹{amount}
    </span>
  );
}

interface ItemCardProps {
  type: PostType;
  title: string;
  place: string;
  time: string;
  reward?: number;
  tile: keyof typeof TILES;
  /** Item illustration, centred on the tile. */
  art: ReactNode;
  className?: string;
}

/** A feed card: big artwork tile, LOST / FOUND tag, reward, title, place and time. */
export default function ItemCard({ type, title, place, time, reward, tile, art, className }: ItemCardProps) {
  return (
    <article
      className={cn(
        "glass group rounded-card p-3 transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-2 hover:shadow-[0_24px_48px_rgb(28_28_30/0.14)]",
        className,
      )}
    >
      <div className={cn("relative flex h-56 items-center justify-center overflow-hidden rounded-[1.375rem] bg-linear-to-br", TILES[tile])}>
        <div className="transition-transform duration-700 ease-out-expo group-hover:scale-110 group-hover:-rotate-3">{art}</div>
        <TypeTag type={type} className="absolute left-4 top-4" />
        {reward !== undefined && <RewardPill amount={reward} className="absolute right-4 top-4" />}
      </div>
      <div className="px-3 pb-3 pt-5">
        <h3 className="truncate text-xl font-bold">{title}</h3>
        <p className="mt-3 flex items-center justify-between gap-3 text-sm font-medium text-muted">
          <span className="flex min-w-0 items-center gap-1.5">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{place}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5">
            <Clock className="size-4" aria-hidden="true" />
            {time}
          </span>
        </p>
      </div>
    </article>
  );
}
