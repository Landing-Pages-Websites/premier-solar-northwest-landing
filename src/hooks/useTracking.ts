"use client";

import { useEffect } from "react";

interface TrackingConfig {
  siteKey?: string;
  gtmId?: string;
  gaId?: string;
  pixelId?: string;
}

declare global {
  interface Window {
    MEGA_TAG_CONFIG?: TrackingConfig;
    API_ENDPOINT?: string;
    TRACKING_API_ENDPOINT?: string;
  }
}

/**
 * useTracking — backup / belt-and-suspenders layer. The primary MegaTag
 * config + optimizer script are in layout.tsx <head>; this hook ensures
 * config is present if the head script was stripped (e.g. by CSP proxies).
 */
export function useTracking(config: TrackingConfig) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (config.siteKey) {
      window.MEGA_TAG_CONFIG = {
        siteKey: config.siteKey,
        gtmId: config.gtmId,
        gaId: config.gaId,
        pixelId: config.pixelId,
      };
    }
    window.API_ENDPOINT = "https://optimizer.gomega.ai";
    window.TRACKING_API_ENDPOINT = "https://events-api.gomega.ai";

    if (document.getElementById("optimizer-script")) return;
    const script = document.createElement("script");
    script.id = "optimizer-script";
    script.src = "https://cdn.gomega.ai/scripts/optimizer.min.js";
    script.async = true;
    document.head.appendChild(script);
  }, [config]);
}

export default useTracking;
