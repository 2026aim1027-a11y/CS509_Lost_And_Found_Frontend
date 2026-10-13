import { cn } from "@/lib/cn";

export function initialsOf(name: string | undefined): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

interface AvatarProps {
  name: string | undefined;
  /** Absolute URL of the profile photo, when the user has one. */
  src?: string | null;
  className?: string;
}

/** Profile photo, or the user's initials on the brand gradient. */
export default function Avatar({ name, src, className }: AvatarProps) {
  return (
    <span
      className={cn(
        "relative inline-flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full",
        "bg-linear-to-br from-brand-400 to-brand-600 font-extrabold text-white",
        className,
      )}
    >
      {src ? (
        // Photos are served by the Django backend (or its S3 / Cloudinary storage), whose host
        // is only known at runtime, so next/image's remotePatterns allow-list doesn't fit here.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        <span aria-hidden="true">{initialsOf(name)}</span>
      )}
    </span>
  );
}
