import { useId, type ComponentProps, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { FieldFrame, describedBy, fieldControlClasses } from "@/components/ui/TextField";

interface SelectFieldProps extends Omit<ComponentProps<"select">, "id"> {
  label: string;
  note?: string;
  hint?: ReactNode;
  error?: string;
  options: readonly { value: string; label: string }[];
  /** Shown as a disabled first option when nothing is selected. */
  placeholder?: string;
  wrapperClassName?: string;
}

export default function SelectField({
  label,
  note,
  hint,
  error,
  options,
  placeholder,
  className,
  wrapperClassName,
  ...props
}: SelectFieldProps) {
  const id = useId();

  return (
    <FieldFrame id={id} label={label} note={note} hint={hint} error={error} className={wrapperClassName}>
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(fieldControlClasses, "appearance-none truncate pr-12", className)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-5 top-1/2 size-5 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
      </div>
    </FieldFrame>
  );
}
