import { useId, type ComponentProps, type ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

export const fieldControlClasses =
  "h-14 w-full rounded-field border-[1.5px] border-line bg-white px-5 text-[15px] font-medium text-ink shadow-soft " +
  "outline-none transition-[border-color,box-shadow] duration-200 placeholder:font-medium placeholder:text-muted/60 " +
  "hover:border-brand-300 focus:border-brand-500 focus:shadow-[0_0_0_4px_rgb(16_185_129/0.14),var(--shadow-soft)] " +
  "aria-invalid:border-coral-500 aria-invalid:focus:shadow-[0_0_0_4px_rgb(255_107_87/0.16),var(--shadow-soft)] " +
  "disabled:cursor-not-allowed disabled:bg-sand/60 disabled:text-muted";

interface FieldFrameProps {
  id: string;
  label: string;
  /** Small note after the label, e.g. "optional". */
  note?: string;
  hint?: ReactNode;
  error?: string;
  /** Element rendered on the right of the label row (e.g. a "Forgot password?" link). */
  labelAction?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Label, control slot, and hint / error line shared by every form field. */
export function FieldFrame({ id, label, note, hint, error, labelAction, className, children }: FieldFrameProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-bold text-ink">
          {label}
          {note && <span className="ml-2 text-xs font-medium text-muted">{note}</span>}
        </label>
        {labelAction}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="flex animate-fade-in items-center gap-1.5 text-[13px] font-semibold text-coral-700">
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-[13px] font-medium text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export function describedBy(id: string, error?: string, hint?: ReactNode): string | undefined {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

interface TextFieldProps extends Omit<ComponentProps<"input">, "id"> {
  label: string;
  note?: string;
  hint?: ReactNode;
  error?: string;
  labelAction?: ReactNode;
  /** Icon shown inside the field on the left. */
  icon?: ReactNode;
  /** Control shown inside the field on the right (e.g. a show-password toggle). */
  trailing?: ReactNode;
  wrapperClassName?: string;
}

export default function TextField({
  label,
  note,
  hint,
  error,
  labelAction,
  icon,
  trailing,
  className,
  wrapperClassName,
  ...props
}: TextFieldProps) {
  const id = useId();

  return (
    <FieldFrame id={id} label={label} note={note} hint={hint} error={error} labelAction={labelAction} className={wrapperClassName}>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-muted [&>svg]:size-4.5">
            {icon}
          </span>
        )}
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(fieldControlClasses, Boolean(icon) && "pl-13", Boolean(trailing) && "pr-14", className)}
          {...props}
        />
        {trailing && <span className="absolute inset-y-0 right-2 flex items-center">{trailing}</span>}
      </div>
    </FieldFrame>
  );
}
