import { pushTrackingEvent } from "@/application/user-tracking/core";

export function trackUsageOfPlanungshilfen(): void {
  pushTrackingEvent("Planungshilfen-Als-Basis-Verwendet", { unique: true });
}
