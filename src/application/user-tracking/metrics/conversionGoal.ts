import { pushTrackingEvent } from "@/application/user-tracking/core";

export function trackReachedConversionGoal(): void {
  pushTrackingEvent("Conversion-Goal-erreicht", { unique: true });
}
