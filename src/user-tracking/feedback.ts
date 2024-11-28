import {
  getTrackingVariable,
  setTrackingVariable,
} from "@/user-tracking/data-layer";

enum Variables {
  Ease = "customer-effort-score-ease",
  Obstacle = "customer-effort-score-obstacle",
}

export function getTrackedEase() {
  return getTrackingVariable<1 | 2 | 3 | 4 | 5>(Variables.Ease) || undefined;
}

export function getTrackedObstacle() {
  return getTrackingVariable<string>(Variables.Obstacle) || undefined;
}

export function trackEase(ease: 1 | 2 | 3 | 4 | 5) {
  setTrackingVariable(Variables.Ease, ease);
}

export function trackObstacle(obstacle: string) {
  setTrackingVariable(Variables.Obstacle, obstacle);
}
