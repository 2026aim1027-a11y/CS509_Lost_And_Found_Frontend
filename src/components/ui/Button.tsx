import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full font-bold " +
  "whitespace-nowrap select-none transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-out " +
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60 disabled:shadow-none " +
  "aria-disabled:pointer-events-none aria-disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-white shadow-brand hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-brand-lg " +
    // Light sweep across the button on hover.
    "before:absolute before:inset-y-0 before:-left-1/2 before:w-1/2 before:-skew-x-12 before:bg-white/25 before:blur-md " +
    "before:transition-transform before:duration-700 before:ease-out hover:before:translate-x-[320%]",
  secondary:
    "border-[1.5px] border-line bg-white text-ink hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft",
  ghost: "text-ink hover:bg-ink/5",
  inverse: "bg-white text-brand-700 shadow-soft hover:-translate-y-0.5 hover:shadow-card",
  danger: "border-[1.5px] border-coral-200 bg-white text-coral-700 hover:border-coral-500 hover:bg-coral-50",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-8 text-base",
};

interface StyleProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export function buttonClasses({ variant = "primary", size = "md", fullWidth = false }: StyleProps = {}): string {
  return cn(base, variants[variant], sizes[size], fullWidth && "w-full");
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 animate-spin-slow" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

interface ButtonProps extends ComponentProps<"button">, StyleProps {
  /** Shows a spinner and blocks clicks while an action is in flight. */
  loading?: boolean;
}

export default function Button({
  variant,
  size,
  fullWidth,
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonClasses({ variant, size, fullWidth }), className)}
      {...props}
    >
      {loading && <Spinner />}
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

interface ButtonLinkProps extends ComponentProps<typeof Link>, StyleProps {}

export function ButtonLink({ variant, size, fullWidth, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn(buttonClasses({ variant, size, fullWidth }), className)} {...props}>
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </Link>
  );
}
