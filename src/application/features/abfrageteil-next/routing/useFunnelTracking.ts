import { useEffect } from "react";
import { NavigationType, useLocation, useNavigationType } from "react-router";
import { pushTrackingEvent } from "@/application/user-tracking/core/data-layer";

export function useFunnelTracking() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === NavigationType.Push) {
      pushTrackingEvent("neuer-funnel-schritt", {
        data: { "funnel-schritt": location.pathname },
      });
    }
  }, [location, navigationType]);
}
