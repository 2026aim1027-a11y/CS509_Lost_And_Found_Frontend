import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  /** Use on dark panels. */
  inverse?: boolean;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  inverse = false,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal className={cn("flex max-w-2xl flex-col", align === "center" && "mx-auto items-center text-center", className)}>
      <p
        className={cn(
          "rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em]",
          inverse ? "bg-white/10 text-brand-300" : "bg-brand-100 text-brand-800",
          align === "left" && "self-start",
        )}
      >
        {eyebrow}
      </p>
      <h2 className={cn("headline mt-5 text-4xl sm:text-5xl", inverse && "text-white")}>{title}</h2>
      <p className={cn("mt-4 text-lg font-medium leading-relaxed", inverse ? "text-white/70" : "text-muted")}>
        {description}
      </p>
    </Reveal>
  );
}
