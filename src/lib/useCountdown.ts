"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Seconds remaining until a deadline. It tracks an absolute time rather than
 * decrementing a counter, so it stays correct when the tab is throttled or the
 * page is hidden and shown again.
 */
export function useCountdown() {
  const [deadline, setDeadline] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (deadline === null) return;
    const tick = () => setSecondsLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    const timer = window.setInterval(tick, 250);
    return () => window.clearInterval(timer);
  }, [deadline]);

  const start = useCallback((seconds: number) => {
    setDeadline(Date.now() + seconds * 1000);
    setSecondsLeft(seconds);
  }, []);

  const reset = useCallback(() => {
    setDeadline(null);
    setSecondsLeft(0);
  }, []);

  return { secondsLeft, start, reset };
}

/** 125 -> "2:05" */
export function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
