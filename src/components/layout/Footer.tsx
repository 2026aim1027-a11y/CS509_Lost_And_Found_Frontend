import Logo from "@/components/brand/Logo";
import ScrollLink from "@/components/ui/ScrollLink";

const LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#feed", label: "The feed" },
  { href: "/#safety", label: "Safety" },
  { href: "/login", label: "Log in" },
  { href: "/register", label: "Create account" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line/70 bg-white/50">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo tagline size="sm" />
          <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-muted">
            The campus lost and found for IIT Ropar. Every handover is verified by the administration.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {LINKS.map((link) => (
              <li key={link.href}>
                <ScrollLink href={link.href} className="text-sm font-bold text-ink-soft transition-colors hover:text-brand-700">
                  {link.label}
                </ScrollLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-line/70">
        <p className="mx-auto max-w-7xl px-4 py-5 text-[13px] font-medium text-muted sm:px-6">
          © 2026 FindIt · A CS509 PG Software Lab project at IIT Ropar
        </p>
      </div>
    </footer>
  );
}
