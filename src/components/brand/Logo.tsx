import Link from "next/link";
import { cn } from "@/lib/cn";

interface LogoMarkProps {
  className?: string;
}

/** The FindIt mark: a magnifier on an emerald tile. */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 48 48" className={cn("size-12", className)} aria-hidden="true">
      <rect width="48" height="48" rx="14" className="fill-brand-500" />
      <circle cx="22" cy="22" r="9" fill="none" stroke="#fff" strokeWidth="3" />
      <path d="M29 29 L36 36" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  /** Show the "IIT Ropar" caption under the wordmark. */
  tagline?: boolean;
  size?: "sm" | "md";
}

export default function Logo({ className, tagline = false, size = "md" }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="FindIt home"
      className={cn("group inline-flex items-center gap-3 rounded-2xl", className)}
    >
      <LogoMark
        className={cn(
          "transition-transform duration-300 ease-spring group-hover:-rotate-6 group-hover:scale-105",
          size === "sm" ? "size-10" : "size-12",
        )}
      />
      <span className="flex flex-col leading-none">
        <span className={cn("font-extrabold tracking-tight text-ink", size === "sm" ? "text-[22px]" : "text-[26px]")}>
          FindIt
        </span>
        {tagline && (
          <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">IIT Ropar</span>
        )}
      </span>
    </Link>
  );
}
