"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "../service/api";

export default function TrackerProvider() {
  const pathname = usePathname();

  // ✅ Page tracking
  useEffect(() => {
    trackEvent({
      event_type: "visit",
      page: pathname,
    });
  }, [pathname]);

  // ✅ Global click tracking
  useEffect(() => {
    const handler = (e) => {
      const el = e.target.closest("[data-track]");
      if (!el) return;

      try {
        const event = JSON.parse(el.dataset.track);
        trackEvent(event);
      } catch (err) {
        console.error("Invalid data-track JSON", err);
      }
    };

    document.addEventListener("click", handler);

    return () => document.removeEventListener("click", handler);
  }, []);

  return null;
}