import { cn } from "@/lib/cn";

interface SvgProps {
  className?: string;
}

/** The FindIt mascot backpack. */
export function Backpack({ className }: SvgProps) {
  return (
    <svg viewBox="-180 -200 360 380" className={className} aria-hidden="true">
      <path d="M-60 -150 Q0 -230 60 -150" fill="none" stroke="#1C1C1E" strokeWidth="10" strokeLinecap="round" />
      <rect x="-150" y="-160" width="300" height="330" rx="90" fill="#0E9F6E" />
      <rect x="-150" y="-160" width="300" height="120" rx="90" fill="#10B981" />
      <rect x="-150" y="-90" width="300" height="50" fill="#10B981" />
      <rect x="-100" y="20" width="200" height="120" rx="36" fill="#34D399" />
      <path d="M-100 70 H100" fill="none" stroke="#0B8F66" strokeWidth="5" strokeLinecap="round" />
      <rect x="-14" y="58" width="28" height="26" rx="8" fill="#F5B93A" />
      <rect x="-62" y="-96" width="124" height="36" rx="18" fill="#0B8F66" />
      <path d="M-150 -20 Q-190 40 -150 110" fill="none" stroke="#0B8F66" strokeWidth="14" strokeLinecap="round" />
      <path d="M150 -20 Q190 40 150 110" fill="none" stroke="#0B8F66" strokeWidth="14" strokeLinecap="round" />
      <circle cx="-96" cy="-120" r="10" fill="#FF6B57" />
    </svg>
  );
}

/** A key ring with two keys and a coral tag. The ring sits at 28.6% / 33.3% of the box. */
export function Keys({ className }: SvgProps) {
  return (
    <svg viewBox="-60 -45 210 135" className={className} aria-hidden="true">
      <circle cx="0" cy="0" r="34" fill="none" stroke="#F5B93A" strokeWidth="9" />
      <rect x="24" y="-9" width="120" height="18" rx="8" fill="#F5B93A" />
      <rect x="104" y="9" width="10" height="22" rx="3" fill="#F5B93A" />
      <rect x="124" y="9" width="10" height="16" rx="3" fill="#F5B93A" />
      <g transform="rotate(34)">
        <rect x="24" y="-9" width="100" height="18" rx="8" fill="#D99A1B" />
        <rect x="88" y="9" width="10" height="20" rx="3" fill="#D99A1B" />
        <rect x="106" y="9" width="10" height="14" rx="3" fill="#D99A1B" />
      </g>
      <rect x="-52" y="-10" width="16" height="20" rx="5" fill="#FF6B57" />
    </svg>
  );
}

interface BackpackSceneProps {
  className?: string;
}

/**
 * Backpack and keys floating over soft concentric rings.
 * Always square; give it a width or a height. Everything inside is positioned in percentages.
 */
export default function BackpackScene({ className }: BackpackSceneProps) {
  return (
    <div className={cn("relative aspect-square", className)} aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-white/50" />
      <div className="absolute inset-[13%] rounded-full bg-white/50" />
      <div className="absolute inset-[4%] animate-ring rounded-full border-2 border-white" />
      <div className="absolute inset-[4%] animate-ring rounded-full border-2 border-white [animation-delay:1.6s]" />

      <span className="absolute left-[12%] top-[20%] size-3 animate-float-slow rounded-full bg-amber-500" />
      <span className="absolute right-[14%] top-[14%] size-2 animate-float rounded-full bg-coral-500 [animation-delay:1.2s]" />
      <span className="absolute bottom-[16%] left-[9%] size-2.5 animate-float rounded-full bg-brand-400 [animation-delay:0.6s]" />

      <div className="absolute left-[9.6%] top-[13%] w-[66.7%] animate-float">
        <Backpack className="w-full drop-shadow-[0_18px_24px_rgb(11_143_102/0.28)]" />
      </div>

      {/* Static tilt on the wrapper, gentle sway around the key ring inside it. */}
      <div className="absolute left-[61.5%] top-[75%] w-[38.9%] origin-[28.6%_33.3%] -rotate-[18deg]">
        <div className="origin-[28.6%_33.3%] animate-sway">
          <Keys className="w-full drop-shadow-[0_8px_10px_rgb(217_154_27/0.3)]" />
        </div>
      </div>
    </div>
  );
}
