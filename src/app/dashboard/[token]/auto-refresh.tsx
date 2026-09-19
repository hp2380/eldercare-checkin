"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Renders nothing. It exists only to re-fetch the dashboard on a timer.
//
// router.refresh() re-runs the server component and patches in the new data,
// so the page updates without a full reload and without flicker.

const INTERVAL_MS = 60_000;

export default function AutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    // Don't poll while the tab is in the background - a dashboard left open
    // all day would otherwise keep hitting the database for nobody.
    const tick = () => {
      if (document.visibilityState === "visible") router.refresh();
    };

    const id = setInterval(tick, INTERVAL_MS);

    // Coming back to the tab should show fresh data straight away rather
    // than whatever was on screen up to a minute ago.
    document.addEventListener("visibilitychange", tick);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [router]);

  return null;
}
