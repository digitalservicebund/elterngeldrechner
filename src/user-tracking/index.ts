import { waitForCookieValue } from "./cookies";
import { establishDataLayer } from "./data-layer";
import { setupTagManager } from "./tag-manager";

export { setTrackingVariable } from "./data-layer";
export { trackNutzergruppe } from "./nutzergruppe";
export { trackPartnerschaftlicheVerteilung } from "./partnerschaftlichkeit";

export async function setupUserTracking(): Promise<void> {
  const tagMangerSourceUrl = getTagMangerSourceUrl();
  const isConfigured = !!tagMangerSourceUrl;

  if (isConfigured && (await isTrackingAllowedByUser())) {
    establishDataLayer();
    setupTagManager(tagMangerSourceUrl);
  }
}

function getTagMangerSourceUrl(): string | undefined {
  return process.env.REACT_APP_USER_TRACKING_TAG_MANAGER_SOURCE;
}

async function isTrackingAllowedByUser(): Promise<boolean> {
  const cookieValue = await waitForCookieValue(
    ALLOW_TRACKING_COOKIE_NAME,
    COOKIE_POLLING_INTERVAL,
  );
  return cookieValue === "1";
}

const ALLOW_TRACKING_COOKIE_NAME = "cookie-allow-tracking"; // set by cookie banner of the Familienportal
const COOKIE_POLLING_INTERVAL = 500;
