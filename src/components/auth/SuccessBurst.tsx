import type { CSSProperties } from "react";

// Confetti pieces: angle in degrees, travel distance in px, and a palette colour.
const PIECES = [
  { angle: 0, distance: 92, color: "bg-brand-400" },
  { angle: 32, distance: 76, color: "bg-amber-500" },
  { angle: 68, distance: 98, color: "bg-coral-500" },
  { angle: 104, distance: 72, color: "bg-brand-500" },
  { angle: 140, distance: 94, color: "bg-amber-500" },
  { angle: 178, distance: 80, color: "bg-brand-300" },
  { angle: 214, distance: 96, color: "bg-coral-500" },
  { angle: 250, distance: 74, color: "bg-brand-500" },
  { angle: 288, distance: 92, color: "bg-amber-500" },
  { angle: 324, distance: 78, color: "bg-brand-400" },
];

/** An animated check mark with a one-shot confetti burst behind it. */
export default function SuccessBurst() {
  return (
    <div className="relative flex size-28 items-center justify-center">
      {PIECES.map((piece, index) => {
        const radians = (piece.angle * Math.PI) / 180;
        const style = {
          "--dx": `${Math.round(Math.cos(radians) * piece.distance)}px`,
          "--dy": `${Math.round(Math.sin(radians) * piece.distance)}px`,
          animationDelay: `${180 + index * 18}ms`,
        } as CSSProperties;
        return (
          <span
            key={piece.angle}
            aria-hidden="true"
            style={style}
            className={`absolute size-2.5 animate-burst ${index % 2 ? "rounded-full" : "rounded-[3px]"} ${piece.color}`}
          />
        );
      })}

      <span className="absolute inset-0 animate-ring rounded-full border-2 border-brand-300" aria-hidden="true" />
      <span className="flex size-24 animate-scale-in items-center justify-center rounded-full bg-brand-500 shadow-brand-lg">
        <svg viewBox="0 0 48 48" className="size-12" aria-hidden="true">
          <path
            d="M13 25 L21 33 L36 16"
            pathLength={1}
            fill="none"
            stroke="#fff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1"
            className="animate-draw"
          />
        </svg>
      </span>
    </div>
  );
}
