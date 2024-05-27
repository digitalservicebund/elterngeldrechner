export function establishDataLayer(): void {
  const timeNow = Date.now();
  window._mtm = window._mtm || [];
  window._mtm[0] = { event: "mtm.Start", "mtm.startTime": timeNow };
}

/**
 * Set a new or updates the value of a tracking variable. The variable will be made
 * available for triggered events by tags of the tag manager.
 */
export function setTrackingVariable(name: string, value: unknown): void {
  if (window._mtm) {
    window._mtm.push({ [name]: value });
  }
}

declare global {
  interface Window {
    _mtm?: Record<string, any>[];
  }
}
