import { EMAIL_DOMAIN, PASSWORD_MIN_LENGTH } from "@/lib/constants";

// Same patterns the backend enforces in accounts/models.py.
const IITRPR_EMAIL_RE = /^[a-z0-9._%+-]+@iitrpr\.ac\.in$/;
const REGISTRATION_NUMBER_RE = /^\d{4}[A-Z]{2,3}\d{4}$/;
const PHONE_RE = /^\+?[0-9][0-9\s-]{6,13}$/;

export function normaliseEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function validateEmail(value: string): string | undefined {
  const email = normaliseEmail(value);
  if (!email) return "Enter your institute email.";
  if (!IITRPR_EMAIL_RE.test(email)) return `Use your @${EMAIL_DOMAIN} email address.`;
  return undefined;
}

export function validateRegistrationNumber(value: string): string | undefined {
  const registration = value.trim().toUpperCase();
  if (!registration) return "Enter your registration number.";
  if (!REGISTRATION_NUMBER_RE.test(registration)) return "Use the format 2024CSM1001.";
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) return "Enter a password.";
  if (value.length < PASSWORD_MIN_LENGTH) return `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
  return undefined;
}

export function validateFullName(value: string): string | undefined {
  const name = value.trim();
  if (!name) return "Enter your full name.";
  if (name.length > 150) return "Keep your name under 150 characters.";
  return undefined;
}

/** Phone is optional; the backend caps it at 15 characters. */
export function validatePhone(value: string): string | undefined {
  const phone = value.trim();
  if (!phone) return undefined;
  if (phone.length > 15 || !PHONE_RE.test(phone)) return "Enter a valid phone number.";
  return undefined;
}

/**
 * Institute emails are usually the registration number itself
 * (2024csm1001@iitrpr.ac.in), so the profile step can prefill it.
 */
export function registrationNumberFromEmail(email: string): string {
  const local = normaliseEmail(email).split("@")[0]?.toUpperCase() ?? "";
  return REGISTRATION_NUMBER_RE.test(local) ? local : "";
}

export interface PasswordStrength {
  /** 0 (empty) to 4 (strong). */
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
}

export function passwordStrength(value: string): PasswordStrength {
  if (!value) return { score: 0, label: "" };
  if (value.length < PASSWORD_MIN_LENGTH) return { score: 1, label: "Too short" };

  let variety = 0;
  if (/[a-z]/.test(value)) variety += 1;
  if (/[A-Z]/.test(value)) variety += 1;
  if (/\d/.test(value)) variety += 1;
  if (/[^A-Za-z0-9]/.test(value)) variety += 1;

  if (variety <= 1) return { score: 2, label: "Weak" };
  if (variety === 2 || value.length < 12) return { score: 3, label: "Good" };
  return { score: 4, label: "Strong" };
}

/** Only allow same-site relative paths in `?next=` redirects. */
export function safeNextPath(next: string | null | undefined, fallback = "/"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
