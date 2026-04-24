"use client";

import { useEffect, useState } from "react";
import { DevDebugPanel } from "@/components/dev/DevDebugPanel";
import { ReadOnlyAdDebugPanel } from "@/components/dev/ReadOnlyAdDebugPanel";

const READ_ONLY_AD_DEBUG_QUERY_PARAM = "ad_debug";

function shouldShowReadOnlyAdDebugPanel() {
  if (typeof window === "undefined") return false;
  return (
    new URLSearchParams(window.location.search).get(
      READ_ONLY_AD_DEBUG_QUERY_PARAM,
    ) === "1"
  );
}

export default function Template({ children }: { children: React.ReactNode }) {
  const fullDebugEnabled = process.env.NODE_ENV !== "production";
  const [showReadOnlyAdDebugPanel, setShowReadOnlyAdDebugPanel] = useState(false);

  useEffect(() => {
    if (fullDebugEnabled) return;
    setShowReadOnlyAdDebugPanel(shouldShowReadOnlyAdDebugPanel());
  }, [fullDebugEnabled]);

  return (
    <div className="min-h-[100dvh] w-full">
      {children}
      {fullDebugEnabled ? <DevDebugPanel /> : null}
      {!fullDebugEnabled && showReadOnlyAdDebugPanel ? (
        <ReadOnlyAdDebugPanel />
      ) : null}
    </div>
  );
}
