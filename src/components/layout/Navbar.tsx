"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, LogOut, Menu, ShieldCheck, UserRound, X } from "lucide-react";
import Logo from "@/components/brand/Logo";
import Avatar from "@/components/ui/Avatar";
import { ButtonLink } from "@/components/ui/Button";
import ScrollLink from "@/components/ui/ScrollLink";
import { useAuth } from "@/context/AuthContext";
import { mediaUrl } from "@/lib/api";
import { cn } from "@/lib/cn";
import { useSignOut } from "@/lib/useSignOut";

const NAV_LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#feed", label: "The feed" },
  { href: "/#safety", label: "Safety" },
];

function AccountMenu() {
  const { user } = useAuth();
  const { signOut, signingOut } = useSignOut();
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  // Routes stay mounted but hidden after navigation; don't come back to an open menu.
  useLayoutEffect(() => () => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!user) return null;
  const firstName = user.full_name?.split(" ")[0] || "Account";

  return (
    <div ref={container} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-full border-[1.5px] border-line bg-white py-1 pl-1 pr-4 text-[15px] font-bold transition-all duration-200 hover:border-brand-300 hover:shadow-soft"
      >
        <Avatar name={user.full_name} src={mediaUrl(user.photo)} className="size-10 text-sm" />
        <span className="max-w-28 truncate">{firstName}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="glass absolute right-0 top-[calc(100%+0.75rem)] w-72 origin-top-right animate-scale-in rounded-3xl bg-white/95 p-2 [animation-duration:0.25s]"
        >
          <div className="flex items-center gap-3 rounded-2xl bg-brand-50 p-3">
            <Avatar name={user.full_name} src={mediaUrl(user.photo)} />
            <div className="min-w-0">
              <p className="truncate font-extrabold">{user.full_name}</p>
              <p className="truncate text-[13px] font-medium text-muted">{user.email}</p>
            </div>
          </div>
          {user.is_staff && (
            <p className="mx-1 mt-2 flex items-center gap-2 rounded-xl bg-ink px-3 py-2 text-xs font-extrabold uppercase tracking-widest text-white">
              <ShieldCheck className="size-4 text-brand-400" aria-hidden="true" />
              Administration
            </p>
          )}
          <Link
            href="/profile"
            role="menuitem"
            onNavigate={() => setOpen(false)}
            className="mt-2 flex items-center gap-3 rounded-2xl px-3 py-3 text-[15px] font-bold transition-colors hover:bg-ink/5"
          >
            <UserRound className="size-5 text-muted" aria-hidden="true" />
            My profile
          </Link>
          <button
            type="button"
            role="menuitem"
            disabled={signingOut}
            onClick={() => void signOut()}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-[15px] font-bold text-coral-700 transition-colors hover:bg-coral-50 disabled:opacity-60"
          >
            <LogOut className="size-5" aria-hidden="true" />
            {signingOut ? "Logging out…" : "Log out"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { user, loading } = useAuth();
  const { signOut } = useSignOut();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useLayoutEffect(() => () => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled || menuOpen
          ? "border-line/70 bg-white/75 shadow-soft backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-22">
        <Logo tagline size="sm" />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <ScrollLink
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-[15px] font-semibold text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
            >
              {link.label}
            </ScrollLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {loading ? (
            <div className="skeleton h-12 w-40 rounded-full" aria-hidden="true" />
          ) : user ? (
            <AccountMenu />
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost" className="max-sm:hidden">
                Log in
              </ButtonLink>
              <ButtonLink href="/register">
                Get started
                <ArrowRight className="size-4.5 transition-transform group-hover/btn:translate-x-0.5" aria-hidden="true" />
              </ButtonLink>
            </>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex size-12 items-center justify-center rounded-full border-[1.5px] border-line bg-white md:hidden"
          >
            {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          aria-label="Mobile"
          className="absolute inset-x-0 top-full animate-fade-in border-y border-line/70 bg-white px-4 pb-5 pt-3 shadow-card md:hidden"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <ScrollLink href={link.href} onClick={closeMenu} className="block rounded-2xl px-4 py-3.5 text-base font-bold hover:bg-ink/5">
                  {link.label}
                </ScrollLink>
              </li>
            ))}
            {!loading && !user && (
              <li>
                <Link href="/login" onClick={closeMenu} className="block rounded-2xl px-4 py-3.5 text-base font-bold hover:bg-ink/5 sm:hidden">
                  Log in
                </Link>
              </li>
            )}
            {user && (
              <li>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="w-full rounded-2xl px-4 py-3.5 text-left text-base font-bold text-coral-700 hover:bg-coral-50"
                >
                  Log out
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
