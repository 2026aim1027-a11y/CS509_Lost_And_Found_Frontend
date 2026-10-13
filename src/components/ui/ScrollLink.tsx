"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

/**
 * Makes a link scroll even when it points at the address we are already on.
 *
 * Next.js treats a navigation to the current URL as nothing to do, so once "/#how-it-works"
 * is in the address bar a second click on that link would leave the page where it is. In that
 * one case, scroll to the section (or to the top, for a link without a hash) ourselves.
 * Every real navigation is left to Next.js.
 */
export function scrollOnSamePage(event: MouseEvent<HTMLAnchorElement>) {
  // Leave new-tab / new-window clicks and already-handled events alone.
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const target = new URL(event.currentTarget.href);
  const { origin, pathname, search, hash } = window.location;
  if (target.origin !== origin || target.pathname !== pathname || target.search !== search || target.hash !== hash) {
    return;
  }

  // No `behavior` option on either call, so they follow the page's CSS: smooth, unless the
  // user has asked for reduced motion.
  if (!target.hash) {
    event.preventDefault();
    window.scrollTo({ top: 0 });
    return;
  }

  const section = document.getElementById(decodeURIComponent(target.hash.slice(1)));
  if (!section) return;
  event.preventDefault();
  section.scrollIntoView();
}

/** A `next/link` for in-page targets such as "/#how-it-works" or the logo's "/". */
export default function ScrollLink({ onClick, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        onClick?.(event);
        scrollOnSamePage(event);
      }}
    />
  );
}
