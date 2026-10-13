import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, FlaskConical, Info } from "lucide-react";
import { cn } from "@/lib/cn";

type Tone = "error" | "success" | "info" | "dev";

const tones: Record<Tone, { box: string; icon: ReactNode }> = {
  error: {
    box: "border-coral-200 bg-coral-50 text-coral-700",
    icon: <CircleAlert aria-hidden="true" />,
  },
  success: {
    box: "border-brand-200 bg-brand-50 text-brand-800",
    icon: <CircleCheck aria-hidden="true" />,
  },
  info: {
    box: "border-amber-300 bg-amber-50 text-amber-900",
    icon: <Info aria-hidden="true" />,
  },
  dev: {
    box: "border-dashed border-amber-500 bg-amber-50 text-amber-900",
    icon: <FlaskConical aria-hidden="true" />,
  },
};

interface AlertProps {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Alert({ tone = "info", title, children, className }: AlertProps) {
  const { box, icon } = tones[tone];

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex animate-fade-up items-start gap-3 rounded-2xl border-[1.5px] px-4 py-3.5 text-sm font-semibold [animation-duration:0.4s]",
        box,
        className,
      )}
    >
      <span className="mt-0.5 shrink-0 [&>svg]:size-4.5">{icon}</span>
      <div className="min-w-0 leading-relaxed">
        {title && <p className="font-extrabold">{title}</p>}
        <div className={cn(title && "font-medium")}>{children}</div>
      </div>
    </div>
  );
}
