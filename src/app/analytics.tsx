"use client";

import { useEffect } from "react";

type GtagFn = (...args: unknown[]) => void;

function gtag(...args: unknown[]) {
  const w = window as unknown as { gtag?: GtagFn };
  w.gtag?.(...args);
}

/** Fires GA4 events for the clicks we count as conversions:
 *  - whatsapp_click : any wa.me link (the main contact conversion)
 *  - phone_click    : tel: links
 *  - email_click    : mailto: links
 *  - coupon_copy    : the KISO15 copy button (direct-booking intent)
 *  - ebike_lp_click : outbound clicks to the e-bike LP
 *  One listener covers every current and future element on the site. */
export function ClickTracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const button = target?.closest?.("button.coupon-copy");
      if (button) {
        gtag("event", "coupon_copy", {
          page_path: window.location.pathname,
        });
        return;
      }
      const a = target?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.includes("wa.me/")) {
        gtag("event", "whatsapp_click", {
          page_path: window.location.pathname,
          link_url: href.split("?")[0],
        });
      } else if (href.startsWith("tel:")) {
        gtag("event", "phone_click", { page_path: window.location.pathname });
      } else if (href.startsWith("mailto:")) {
        gtag("event", "email_click", { page_path: window.location.pathname });
      } else if (href.includes("nakasendo-ebike.com") || href.includes("kiso-ebike-lp")) {
        gtag("event", "ebike_lp_click", {
          page_path: window.location.pathname,
        });
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
