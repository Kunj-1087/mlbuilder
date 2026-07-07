"use client";

import { useEffect } from "react";
import ErrorPageLayout from "@/components/errors/ErrorPageLayout";
import { track, EVENTS } from "@/lib/analytics/track";

export default function NotFoundPage() {
  useEffect(() => {
    track(EVENTS.ERROR_PAGE_VIEWED, { error_code: "404", path: window.location.pathname });
  }, []);

  return (
    <ErrorPageLayout
      errorCode="404"
      titleSegments={[
        { text: "THIS PAGE", color: "black" },
        { text: "DOESN'T", color: "orange" },
        { text: "EXIST.", color: "black" },
      ]}
      script="Either the link is wrong, the page moved, or it never existed in the first place."
      description="Sometimes I rename pages while building. Sometimes Instagram links go stale. Sometimes a typo is a typo. Whatever happened — here's how to get somewhere useful."
      ctas={[
        { label: "Take Me Home →", href: "/", variant: "primary" },
        { label: "Browse Blog", href: "/blog", variant: "secondary" },
        { label: "Free Resources", href: "/free", variant: "secondary" },
      ]}
      showSearchSuggestions
    />
  );
}
