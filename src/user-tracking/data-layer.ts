export function establishDataLayer(): void {
  const timeNow = Date.now();
  window._mtm = window._mtm || [];
  window._mtm[0] = { event: "mtm.Start", "mtm.startTime": timeNow };
}

/**
 * Set a new or updates the value of a tracking variable. The variable will be made
 * available for triggered events by tags of the tag manager.
 */
export function setTrackingVariable(name: string, value?: unknown): void {
  if (window._mtm) {
    window._mtm.push({ [name]: value });
  }
}

export function getTrackingVariable<T>(name: string): T | null {
  if (window._mtm) {
    return getTrackingVariableFrom(window._mtm, name);
  } else {
    return null;
  }
}

export function getTrackingVariableFrom<T>(
  dataLayer: Record<string, unknown>[],
  name: string,
): T | null {
  const lastElement = dataLayer.findLast((it) => it[name] !== undefined);
  const lastElementsProperty = lastElement?.[name];

  return lastElementsProperty ? (lastElementsProperty as T) : null;
}

declare global {
  interface Window {
    _mtm?: Record<string, unknown>[];
  }
}
