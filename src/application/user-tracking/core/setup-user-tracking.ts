import { waitForCookieValue } from "./cookies";
import { establishDataLayer } from "./data-layer";
import { setupTagManager } from "./tag-manager";

export async function setupUserTracking(): Promise<void> {
  const tagMangerSourceUrl = getTagMangerSourceUrl();
  const isConfigured = !!tagMangerSourceUrl;

  if (isConfigured && (await isTrackingAllowedByUser())) {
    establishDataLayer();
    setupTagManager(tagMangerSourceUrl);
  }
}

function getTagMangerSourceUrl(): string {
  return import.meta.env.VITE_APP_USER_TRACKING_TAG_MANAGER_SOURCE;
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

export { isTrackingAllowedByUser };

if (import.meta.vitest) {
  const { describe, beforeEach, afterEach, it, expect, vi } = import.meta
    .vitest;

  describe("setup user tracking", () => {
    beforeEach(() => {
      // Satisfy assumption for tag manager script injection (necessary?)
      document.body.innerHTML = "<script src='main.js' />";
    });

    const originalCookies = document.cookie;

    afterEach(() => {
      document.cookie = originalCookies;
    });

    describe("check conditions for tracking", () => {
      beforeEach(async () => {
        vi.spyOn(await import("./tag-manager"), "setupTagManager");
        vi.spyOn(await import("./data-layer"), "establishDataLayer");
      });

      it("does not setup the tag manager if no source URL was configured, even user allowed tracking", async () => {
        vi.stubEnv("VITE_APP_USER_TRACKING_TAG_MANAGER_SOURCE", "");
        vi.spyOn(document, "cookie", "get").mockReturnValue(
          COOKIES_WITH_ALLOWANCE,
        );

        await setupUserTracking();

        expect(setupTagManager).not.toHaveBeenCalled();
        expect(establishDataLayer).not.toHaveBeenCalled();
      });

      it("does not check the user allowance if no source URL was configured anyway", async () => {
        vi.stubEnv("VITE_APP_USER_TRACKING_TAG_MANAGER_SOURCE", "");
        const cookieSpy = vi.spyOn(document, "cookie", "get");

        await setupUserTracking();

        expect(cookieSpy).not.toHaveBeenCalled();
      });

      it("does not setup the tag manager if user denied it, even the source URL was configured", async () => {
        vi.stubEnv("VITE_APP_USER_TRACKING_TAG_MANAGER_SOURCE", ANY_SOURCE_URL);
        vi.spyOn(document, "cookie", "get").mockReturnValue(
          "cookie-allow-tracking=0",
        );

        await setupUserTracking();

        expect(setupTagManager).not.toHaveBeenCalled();
        expect(establishDataLayer).not.toHaveBeenCalled();
      });

      it("setups up the tag manager if user allowed it and a source URL was configured", async () => {
        vi.stubEnv("VITE_APP_USER_TRACKING_TAG_MANAGER_SOURCE", "test-url");
        vi.spyOn(document, "cookie", "get").mockReturnValue(
          "cookie-allow-tracking=1;other-cookie=test",
        );

        await setupUserTracking();

        expect(setupTagManager).toHaveBeenCalledTimes(1);
        expect(establishDataLayer).toHaveBeenCalledTimes(1);
      });

      it("continues to poll the cookies until user denied or allowed the user trackinguntil the user denied or allowed the user tracking", async () => {
        vi.stubEnv("VITE_APP_USER_TRACKING_TAG_MANAGER_SOURCE", ANY_SOURCE_URL);
        vi.spyOn(document, "cookie", "get")
          .mockReturnValueOnce("other-cookie=test")
          .mockReturnValueOnce("other-cookie=test")
          .mockReturnValueOnce("cookie-allow-tracking=1;other-cookie=test");

        await setupUserTracking();

        expect(setupTagManager).toHaveBeenCalledTimes(1);
        expect(establishDataLayer).toHaveBeenCalledTimes(1);
      });
    });

    describe("load and configure tag manager", () => {
      it("adds the tag manger as first script to the document", async () => {
        configureTracking("https://test.tld/tag-manager");

        await setupUserTracking();

        const script = document.getElementsByTagName("script").item(0);

        expect(script).toBeDefined();
        expect(script?.src).toEqual("https://test.tld/tag-manager");
        expect(script?.async).toBeTruthy();
      });

      it("does not add the script twice on multiple setups", async () => {
        configureTracking("https://test.tld/tag-manager");

        await setupUserTracking();
        await setupUserTracking();

        const allScripts = Array.from(document.getElementsByTagName("script"));
        const tagMangerScripts = allScripts.filter(
          (script) => script.src === "https://test.tld/tag-manager",
        );

        expect(tagMangerScripts).toHaveLength(1);
      });
    });

    describe("data layer setup", () => {
      beforeEach(configureTracking);

      it("sets up the data layer with the start event", async () => {
        vi.spyOn(Date, "now").mockReturnValue(12345);

        await setupUserTracking();

        expect(window._mtm).toBeDefined();
        expect(window._mtm).toHaveLength(1);
        expect(window._mtm?.[0]).toStrictEqual({
          event: "mtm.Start",
          "mtm.startTime": 12345,
        });
      });
    });

    function configureTracking(tagManagerSource = ANY_SOURCE_URL): void {
      vi.stubEnv("VITE_APP_USER_TRACKING_TAG_MANAGER_SOURCE", tagManagerSource);
      vi.spyOn(document, "cookie", "get").mockReturnValue(
        "cookie-allow-tracking=1",
      );
    }

    const COOKIES_WITH_ALLOWANCE = "cookie-allow-tracking=1";
    const ANY_SOURCE_URL = "test-url";
  });
}
