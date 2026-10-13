"use client";

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type ChangeEvent } from "react";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  Camera,
  Check,
  GraduationCap,
  Hash,
  Home,
  LockKeyhole,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import Alert from "@/components/ui/Alert";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import SelectField from "@/components/ui/SelectField";
import TextField from "@/components/ui/TextField";
import { toUser, useAuth } from "@/context/AuthContext";
import { ApiError, apiClient, errorMessage, mediaUrl } from "@/lib/api";
import { cn } from "@/lib/cn";
import {
  DEPARTMENTS,
  HOSTEL_SUGGESTIONS,
  PHOTO_MAX_BYTES,
  PHOTO_TYPES,
  PROGRAM_YEARS,
  labelFor,
} from "@/lib/constants";
import { useSignOut } from "@/lib/useSignOut";
import { validateFullName, validatePhone } from "@/lib/validation";
import type { ProfileResponse, ProfileUpdate, User } from "@/types/auth";

type FieldErrors = Partial<Record<keyof ProfileUpdate, string>>;

function editableFields(user: User): ProfileUpdate {
  return {
    full_name: user.full_name ?? "",
    department: user.department ?? "",
    program_year: user.program_year ?? "",
    hostel: user.hostel ?? "",
    phone: user.phone ?? "",
  };
}

function memberSince(dateJoined: string | undefined): string {
  if (!dateJoined) return "";
  const date = new Date(dateJoined);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

/* ─── Photo ─────────────────────────────────────────────────────────────────── */

function PhotoControl({ user, onError }: { user: User; onError: (message: string) => void }) {
  const { setUser } = useAuth();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const save = async (request: Promise<ProfileResponse>) => {
    onError("");
    setBusy(true);
    try {
      const res = await request;
      setUser(toUser(res.data));
    } catch (err) {
      const photoError = err instanceof ApiError ? err.field("photo") : undefined;
      onError(photoError ?? errorMessage(err, "Could not update your photo. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!PHOTO_TYPES.includes(file.type)) return onError("Choose a JPG, PNG or WebP image.");
    if (file.size > PHOTO_MAX_BYTES) return onError("That image is larger than 5 MB. Choose a smaller one.");

    const body = new FormData();
    body.append("photo", file);
    void save(apiClient<ProfileResponse>("/users/me/", { method: "PATCH", data: body }));
  };

  const remove = () => void save(apiClient<ProfileResponse>("/users/me/", { method: "PATCH", data: { photo: null } }));

  return (
    <div className="relative">
      <div className={cn("rounded-full bg-white p-1.5 shadow-card transition-opacity", busy && "opacity-60")}>
        <Avatar name={user.full_name} src={mediaUrl(user.photo)} className="size-28 text-4xl" />
      </div>
      {busy && (
        <span className="absolute inset-0 flex items-center justify-center" role="status" aria-label="Updating photo">
          <span className="size-8 animate-spin-slow rounded-full border-[3px] border-brand-500 border-t-transparent" />
        </span>
      )}

      <input ref={input} type="file" accept={PHOTO_TYPES.join(",")} onChange={handleFile} className="sr-only" tabIndex={-1} aria-hidden="true" />
      <button
        type="button"
        disabled={busy}
        onClick={() => input.current?.click()}
        aria-label={user.photo ? "Change profile photo" : "Add a profile photo"}
        className="absolute bottom-0 right-0 flex size-10 items-center justify-center rounded-full bg-ink text-white shadow-soft transition-transform duration-200 hover:scale-110 disabled:opacity-60"
      >
        <Camera className="size-4.5" aria-hidden="true" />
      </button>
      {user.photo && (
        <button
          type="button"
          disabled={busy}
          onClick={remove}
          aria-label="Remove profile photo"
          className="absolute bottom-0 left-0 flex size-10 items-center justify-center rounded-full border-[1.5px] border-line bg-white text-coral-700 shadow-soft transition-transform duration-200 hover:scale-110 disabled:opacity-60"
        >
          <Trash2 className="size-4.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/* ─── Identity card ─────────────────────────────────────────────────────────── */

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line/80 py-3.5 last:border-b-0">
      <dt className="flex shrink-0 items-center gap-2.5 text-sm font-medium text-muted [&>svg]:size-4">
        {icon}
        {label}
      </dt>
      <dd className={cn("min-w-0 text-right text-sm font-bold text-balance break-words", !value && "font-medium text-muted/70")}>
        {value || "Not added"}
      </dd>
    </div>
  );
}

function IdentityCard({ user }: { user: User }) {
  const [photoError, setPhotoError] = useState("");
  const joined = memberSince(user.date_joined);

  return (
    <aside className="glass animate-fade-up overflow-hidden rounded-card lg:sticky lg:top-28 lg:self-start">
      <div className="relative h-28 overflow-hidden bg-linear-to-br from-brand-400 to-brand-700">
        <span className="absolute -right-8 -top-10 size-36 rounded-full bg-white/15" aria-hidden="true" />
        <span className="absolute -bottom-12 left-10 size-28 rounded-full bg-white/10" aria-hidden="true" />
      </div>

      <div className="-mt-16 flex flex-col items-center px-6 pb-6 text-center">
        <PhotoControl user={user} onError={setPhotoError} />
        <h2 className="mt-4 text-2xl font-extrabold">{user.full_name}</h2>
        <p className="mt-1 font-mono text-sm font-bold tracking-wider text-muted">{user.registration_number}</p>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-bold text-brand-800">
            <BadgeCheck className="size-4" aria-hidden="true" />
            Verified institute email
          </span>
          {user.is_staff && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-bold text-white">
              <ShieldCheck className="size-4 text-brand-400" aria-hidden="true" />
              Administration
            </span>
          )}
        </div>

        {photoError && (
          <Alert tone="error" className="mt-4 w-full text-left">
            {photoError}
          </Alert>
        )}
      </div>

      <dl className="border-t border-line/80 px-6 py-2">
        <DetailRow icon={<Building2 aria-hidden="true" />} label="Department" value={labelFor(DEPARTMENTS, user.department)} />
        <DetailRow icon={<GraduationCap aria-hidden="true" />} label="Program" value={labelFor(PROGRAM_YEARS, user.program_year)} />
        <DetailRow icon={<Home aria-hidden="true" />} label="Hostel" value={user.hostel ?? ""} />
        <DetailRow icon={<Phone aria-hidden="true" />} label="Phone" value={user.phone ?? ""} />
        {joined && <DetailRow icon={<CalendarDays aria-hidden="true" />} label="Member since" value={joined} />}
      </dl>
    </aside>
  );
}

/* ─── Edit form ─────────────────────────────────────────────────────────────── */

function ProfileForm({ user }: { user: User }) {
  const { setUser } = useAuth();
  const saved = editableFields(user);

  const [form, setForm] = useState<ProfileUpdate>(saved);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Don't greet a returning visitor with a stale "saved" confirmation.
  useLayoutEffect(() => () => setJustSaved(false), []);

  const dirty = (Object.keys(saved) as Array<keyof ProfileUpdate>).some((key) => form[key].trim() !== saved[key]);

  const setField = (field: keyof ProfileUpdate, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setJustSaved(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const errors: FieldErrors = {
      full_name: validateFullName(form.full_name),
      phone: validatePhone(form.phone),
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    const payload: ProfileUpdate = {
      ...form,
      full_name: form.full_name.trim(),
      hostel: form.hostel.trim(),
      phone: form.phone.trim(),
    };

    setSaving(true);
    try {
      const res = await apiClient<ProfileResponse>("/users/me/", { method: "PATCH", data: payload });
      const updated = toUser(res.data);
      setUser(updated);
      setForm(editableFields(updated));
      setJustSaved(true);
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fieldErrors).length > 0) {
        const fromServer: FieldErrors = {};
        for (const [field, messages] of Object.entries(err.fieldErrors)) {
          fromServer[field as keyof ProfileUpdate] = messages[0];
        }
        setFieldErrors(fromServer);
      } else {
        setError(errorMessage(err, "Could not save your profile. Please try again."));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} noValidate className="glass stagger animate-fade-up rounded-card p-6 [--i:1] sm:p-8">
      <h2 className="text-2xl font-extrabold">Personal details</h2>
      <p className="mt-1.5 text-[15px] font-medium text-muted">
        Shown to the administration when they verify a handover.
      </p>

      <div className="mt-7 flex flex-col gap-5">
        {error && <Alert tone="error">{error}</Alert>}

        <TextField
          label="Full name"
          name="full_name"
          autoComplete="name"
          icon={<UserRound aria-hidden="true" />}
          maxLength={150}
          value={form.full_name}
          onChange={(e) => setField("full_name", e.target.value)}
          error={fieldErrors.full_name}
          required
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            label="Department"
            name="department"
            options={DEPARTMENTS}
            value={form.department}
            onChange={(e) => setField("department", e.target.value)}
            error={fieldErrors.department}
          />
          <SelectField
            label="Program & year"
            name="program_year"
            options={PROGRAM_YEARS}
            value={form.program_year}
            onChange={(e) => setField("program_year", e.target.value)}
            error={fieldErrors.program_year}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Hostel"
            note="optional"
            name="hostel"
            list="profile-hostel-suggestions"
            placeholder="e.g. Satluj"
            icon={<Home aria-hidden="true" />}
            maxLength={100}
            value={form.hostel}
            onChange={(e) => setField("hostel", e.target.value)}
            error={fieldErrors.hostel}
          />
          <datalist id="profile-hostel-suggestions">
            {HOSTEL_SUGGESTIONS.map((hostel) => (
              <option key={hostel} value={hostel} />
            ))}
          </datalist>
          <TextField
            label="Phone"
            note="optional"
            type="tel"
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            placeholder="e.g. 9876543210"
            icon={<Phone aria-hidden="true" />}
            maxLength={15}
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            error={fieldErrors.phone}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line/80 pt-6">
        <p className="flex items-center gap-2 text-sm font-semibold" aria-live="polite">
          {justSaved ? (
            <span className="inline-flex animate-fade-in items-center gap-2 text-brand-800">
              <span className="flex size-5 items-center justify-center rounded-full bg-brand-500 text-white">
                <Check className="size-3" strokeWidth={4} aria-hidden="true" />
              </span>
              Profile saved
            </span>
          ) : (
            <span className="text-muted">{dirty ? "You have unsaved changes" : "Everything is up to date"}</span>
          )}
        </p>
        <div className="flex gap-3">
          {dirty && !saving && (
            <Button
              variant="ghost"
              onClick={() => {
                setForm(saved);
                setFieldErrors({});
                setError("");
              }}
            >
              Discard
            </Button>
          )}
          <Button type="submit" loading={saving} disabled={!dirty}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}

/* ─── Locked identity + session ─────────────────────────────────────────────── */

function LockedIdentity({ user }: { user: User }) {
  return (
    <section className="stagger animate-fade-up rounded-card border-[1.5px] border-amber-300 bg-amber-50 p-6 [--i:2] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 text-lg font-extrabold text-amber-900">
          <LockKeyhole className="size-5" aria-hidden="true" />
          Locked identity
        </h2>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-amber-900">Can&apos;t be edited</span>
      </div>
      <p className="mt-2 text-sm font-medium leading-relaxed text-amber-900/80">
        Your institute email and registration number identify you on campus, so they are fixed once the account is
        created. If either is wrong, contact the administration.
      </p>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4">
          <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
            <Mail className="size-3.5" aria-hidden="true" />
            Institute email
          </dt>
          <dd className="mt-1.5 truncate font-bold">{user.email}</dd>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
            <Hash className="size-3.5" aria-hidden="true" />
            Registration number
          </dt>
          <dd className="mt-1.5 truncate font-mono font-bold tracking-wider">{user.registration_number}</dd>
        </div>
      </dl>
    </section>
  );
}

function SessionCard() {
  const { signOut, signingOut } = useSignOut();

  return (
    <section className="glass stagger flex animate-fade-up flex-wrap items-center justify-between gap-4 rounded-card p-6 [--i:3] sm:px-8">
      <div>
        <h2 className="text-lg font-extrabold">Log out of FindIt</h2>
        <p className="mt-1 text-sm font-medium text-muted">You&apos;ll need your password to get back in on this device.</p>
      </div>
      <Button variant="danger" loading={signingOut} onClick={() => void signOut()}>
        {!signingOut && <LogOut className="size-4.5" aria-hidden="true" />}
        {signingOut ? "Logging out…" : "Log out"}
      </Button>
    </section>
  );
}

/* ─── Page body ─────────────────────────────────────────────────────────────── */

function ProfileSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]" aria-busy="true" aria-label="Loading your profile">
      <div className="skeleton h-120 rounded-card" />
      <div className="flex flex-col gap-6">
        <div className="skeleton h-96 rounded-card" />
        <div className="skeleton h-44 rounded-card" />
      </div>
    </div>
  );
}

export default function ProfileView() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login?next=/profile");
  }, [user, loading, router]);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-20 pt-8 sm:px-6 lg:pt-12">
      <header className="mb-8 animate-fade-up">
        <h1 className="headline text-4xl sm:text-5xl">My profile</h1>
        <p className="mt-3 max-w-xl font-medium text-muted">
          Keep your details current so the administration can reach you quickly when one of your items turns up.
        </p>
      </header>

      {loading || !user ? (
        <ProfileSkeleton />
      ) : (
        // Keyed by account so one user's unsaved edits can never show up for another.
        <div key={user.id} className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
          <IdentityCard user={user} />
          <div className="flex min-w-0 flex-col gap-6">
            <ProfileForm user={user} />
            <LockedIdentity user={user} />
            <SessionCard />
          </div>
        </div>
      )}
    </main>
  );
}
