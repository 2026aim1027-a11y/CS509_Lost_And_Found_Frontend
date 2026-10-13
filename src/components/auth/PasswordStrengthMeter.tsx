import { cn } from "@/lib/cn";
import { passwordStrength } from "@/lib/validation";

const FILL = ["", "bg-coral-500", "bg-amber-500", "bg-brand-400", "bg-brand-600"];
const TEXT = ["", "text-coral-700", "text-amber-900", "text-brand-700", "text-brand-800"];

/** Four bars that fill as the password gets longer and more varied. */
export default function PasswordStrengthMeter({ password }: { password: string }) {
  const { score, label } = passwordStrength(password);

  return (
    <div className="flex items-center gap-3" aria-live="polite">
      <div className="flex flex-1 gap-1.5" aria-hidden="true">
        {[1, 2, 3, 4].map((bar) => (
          <span key={bar} className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
            <span
              className={cn(
                "block h-full origin-left rounded-full transition-transform duration-500 ease-out-expo",
                FILL[score],
                bar <= score ? "scale-x-100" : "scale-x-0",
              )}
            />
          </span>
        ))}
      </div>
      <span className={cn("w-20 text-right text-xs font-bold", TEXT[score])}>
        {label || <span className="font-medium text-muted">Strength</span>}
      </span>
    </div>
  );
}
