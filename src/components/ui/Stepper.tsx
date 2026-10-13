import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface StepperProps {
  steps: readonly string[];
  /** Zero-based index of the step in progress. */
  current: number;
  className?: string;
}

/** Horizontal progress for multi-step flows: done steps get a check, the line fills as you advance. */
export default function Stepper({ steps, current, className }: StepperProps) {
  return (
    <ol className={cn("flex items-center", className)} aria-label="Progress">
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;

        return (
          <li
            key={step}
            aria-current={active ? "step" : undefined}
            className={cn("flex items-center", index < steps.length - 1 && "flex-1")}
          >
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full text-[15px] font-extrabold transition-all duration-500 ease-out-expo",
                done && "bg-brand-100 text-brand-600",
                active && "scale-105 bg-brand-500 text-white shadow-brand",
                !done && !active && "border-[1.5px] border-line bg-white text-muted",
              )}
            >
              {done ? <Check key="check" className="size-5 animate-scale-in" strokeWidth={3} aria-hidden="true" /> : index + 1}
            </span>
            <span
              className={cn(
                "ml-3 text-[15px] font-bold transition-colors duration-300 max-sm:sr-only",
                done && "text-brand-600",
                active && "text-ink",
                !done && !active && "text-muted",
              )}
            >
              {step}
            </span>
            {index < steps.length - 1 && (
              <span className="mx-3 h-0.5 min-w-6 flex-1 overflow-hidden rounded-full bg-line sm:mx-5" aria-hidden="true">
                <span
                  className={cn(
                    "block h-full origin-left rounded-full bg-brand-500 transition-transform duration-700 ease-out-expo",
                    done ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
