/** Choices mirror `Department` and `ProgramYear` in the backend's accounts/models.py. */
export const DEPARTMENTS = [
  { value: "CSE", label: "Computer Science & Engineering" },
  { value: "ECE", label: "Electrical & Communication Engineering" },
  { value: "ME", label: "Mechanical Engineering" },
  { value: "CE", label: "Civil Engineering" },
  { value: "MATHS", label: "Mathematics" },
  { value: "PHYSICS", label: "Physics" },
  { value: "CHEMISTRY", label: "Chemistry" },
  { value: "HSS", label: "Humanities & Social Sciences" },
  { value: "OTHER", label: "Other" },
] as const;

export const PROGRAM_YEARS = [
  { value: "BTECH_1", label: "B.Tech 1st Year" },
  { value: "BTECH_2", label: "B.Tech 2nd Year" },
  { value: "BTECH_3", label: "B.Tech 3rd Year" },
  { value: "BTECH_4", label: "B.Tech 4th Year" },
  { value: "MTECH_1", label: "M.Tech 1st Year" },
  { value: "MTECH_2", label: "M.Tech 2nd Year" },
  { value: "PHD", label: "Ph.D" },
  { value: "FACULTY", label: "Faculty / Staff" },
] as const;

/** Suggestions only; the backend stores hostel as free text. */
export const HOSTEL_SUGGESTIONS = ["Satluj", "Beas", "Chenab", "Ravi", "Brahmaputra"] as const;

/** Item categories seeded by the backend's `seed_data` command (non-sensitive ones). */
export const CATEGORIES = [
  "Bicycle",
  "Phone",
  "Laptop",
  "Earbuds",
  "Keys",
  "ID Card",
  "Bottle",
  "Umbrella",
  "Other",
] as const;

export const EMAIL_DOMAIN = "iitrpr.ac.in";

/** Backend OTP settings (OTP_EXPIRY_SECONDS, OTP_RESEND_COOLDOWN_SECONDS). */
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_SECONDS = 300;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;

export const PASSWORD_MIN_LENGTH = 8;

/** Profile photo limits from the backend settings (MAX_IMAGE_SIZE_MB, ALLOWED_IMAGE_TYPES). */
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function labelFor(options: readonly { value: string; label: string }[], value: string | undefined): string {
  return options.find((option) => option.value === value)?.label ?? value ?? "";
}
