"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { OTP_LENGTH } from "@/lib/constants";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Called once every box is filled, so the form can submit without an extra click. */
  onComplete?: (value: string) => void;
  /** Accessible name for the group of boxes. */
  label: string;
  length?: number;
  invalid?: boolean;
  /**
   * Freeze input while a request is in flight. The boxes go read-only rather than disabled
   * so keyboard focus stays where it is and a wrong code can be corrected straight away.
   */
  busy?: boolean;
  autoFocus?: boolean;
}

/** One box per digit, with paste, autofill, arrow-key and backspace handling. */
export default function OtpInput({
  value,
  onChange,
  onComplete,
  label,
  length = OTP_LENGTH,
  invalid = false,
  busy = false,
  autoFocus = false,
}: OtpInputProps) {
  const boxes = useRef<Array<HTMLInputElement | null>>([]);

  const focusBox = (index: number) => {
    const box = boxes.current[Math.max(0, Math.min(length - 1, index))];
    box?.focus();
    box?.select();
  };

  const commit = (next: string, focusIndex: number) => {
    const digits = next.replace(/\D/g, "").slice(0, length);
    onChange(digits);
    focusBox(focusIndex);
    if (digits.length === length && digits !== value) onComplete?.(digits);
  };

  const handleInput = (index: number, raw: string) => {
    if (busy) return;
    let typed = raw.replace(/\D/g, "");
    if (!typed) return;
    // A second keystroke in a filled box arrives as "old + new"; keep only the new digit.
    const current = value[index];
    if (current && typed.length === 2) typed = typed.replace(current, "") || current;
    // Longer input is a paste or an SMS / email autofill dropping the whole code in one box.
    commit(value.slice(0, index) + typed + value.slice(index + typed.length), index + typed.length);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (busy) return;
    if (event.key === "Backspace") {
      event.preventDefault();
      const target = value[index] ? index : index - 1;
      if (target < 0) return;
      commit(value.slice(0, target) + value.slice(target + 1), target);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusBox(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focusBox(Math.min(index + 1, value.length));
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (busy) return;
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasted) commit(pasted, pasted.length);
  };

  return (
    <div
      role="group"
      aria-label={label}
      aria-busy={busy || undefined}
      className={cn("flex justify-between gap-2 sm:gap-3", invalid && "animate-shake")}
    >
      {Array.from({ length }, (_, index) => {
        const digit = value[index] ?? "";
        return (
          <input
            key={index}
            ref={(element) => {
              boxes.current[index] = element;
            }}
            value={digit}
            onChange={(event) => handleInput(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            // Digits fill left to right, so send focus back to the first empty box.
            onFocus={(event) => {
              if (index > value.length) focusBox(value.length);
              else event.target.select();
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            autoFocus={autoFocus && index === 0}
            readOnly={busy}
            aria-label={`Digit ${index + 1} of ${length}`}
            aria-invalid={invalid || undefined}
            className={cn(
              "h-14 w-full min-w-0 max-w-16 rounded-2xl border-[1.5px] bg-white text-center text-2xl font-extrabold text-ink shadow-soft sm:h-16",
              "caret-brand-500 outline-none transition-[border-color,box-shadow,background-color] duration-200",
              "focus:border-brand-500 focus:shadow-[0_0_0_4px_rgb(16_185_129/0.14),var(--shadow-soft)]",
              busy && "opacity-60",
              invalid ? "border-coral-500 bg-coral-50" : digit ? "animate-pop border-brand-400 bg-brand-50" : "border-line",
            )}
          />
        );
      })}
    </div>
  );
}
