import type { PostHogConfig } from "posthog-js";
import { posthog } from "../posthog";
import { waitForCookieValue } from "./cookies";
import { establishDataLayer } from "./data-layer";
import { setupTagManager } from "./tag-manager";
import {
  isPosthogEnabled,
  isTesterIdentificationEnabled,
} from "@/application/feature-flags";

export async function setupUserTracking(): Promise<void> {
  const tagMangerSourceUrl = getTagMangerSourceUrl();
  const isMatomoConfigured = !!tagMangerSourceUrl;

  if (isMatomoConfigured && (await isTrackingAllowedByUser())) {
    establishDataLayer();
    setupTagManager(tagMangerSourceUrl);
  }

  if (isPosthogEnabled() && (await isPosthogTrackingAllowedByUser())) {
    const standardConfig: Partial<PostHogConfig> = {
      api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
      capture_pageview: false,
      capture_pageleave: false,
      disable_session_recording: true,
      capture_exceptions: false,
      person_profiles: "never",
      disable_surveys: true,
      autocapture: false,
    };

    // Internal testers can identify themselves so it allows person
    // profiles but keeps the config state in sessionStorage so the
    // identity is not kept longer than the lifecycle of the tab.
    const testingConfig: Partial<PostHogConfig> = {
      ...standardConfig,
      person_profiles: "identified_only",
      persistence: "sessionStorage",
    };

    posthog.init(
      import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN,
      isTesterIdentificationEnabled() ? testingConfig : standardConfig,
    );

    if (isTesterIdentificationEnabled()) {
      const testingIdentifier = getTestingIdentifier();

      if (testingIdentifier) {
        removeTestingIdentifierFromUrl();

        // The only identify in the codebase. Lets the team filter dashboards by
        // colleague while reviewing new insights; real users are never identified.
        posthog.identify(testingIdentifier, { email: testingIdentifier });
      }
    }

    posthog.capture("$pageview");
  }
}

function getTagMangerSourceUrl(): string {
  return import.meta.env.VITE_APP_USER_TRACKING_TAG_MANAGER_SOURCE;
}

const TESTER_PARAM = "tester";

function getTestingIdentifier(): string | undefined {
  const url = new URL(window.location.href);
  return url.searchParams.get(TESTER_PARAM)?.trim().toLowerCase() || undefined;
}

function removeTestingIdentifierFromUrl(): void {
  const url = new URL(window.location.href);

  if (url.searchParams.has(TESTER_PARAM)) {
    url.searchParams.delete(TESTER_PARAM);
    window.history.replaceState({}, "", url);
  }
}

async function isTrackingAllowedByUser(): Promise<boolean> {
  const cookieValue = await waitForCookieValue(
    ALLOW_TRACKING_COOKIE_NAME,
    COOKIE_POLLING_INTERVAL,
  );

  return (
    cookieValue === ALLOW_TRACKING_COOKIE_VALUE_MATOMO_ONLY ||
    cookieValue === ALLOW_TRACKING_COOKIE_VALUE_MATOMO_AND_POSTHOG
  );
}

async function isPosthogTrackingAllowedByUser(): Promise<boolean> {
  const cookieValue = await waitForCookieValue(
    ALLOW_TRACKING_COOKIE_NAME,
    COOKIE_POLLING_INTERVAL,
  );

  return (
    cookieValue === ALLOW_TRACKING_COOKIE_VALUE_POSTHOG_ONLY ||
    cookieValue === ALLOW_TRACKING_COOKIE_VALUE_MATOMO_AND_POSTHOG
  );
}

const ALLOW_TRACKING_COOKIE_NAME = "cookie-allow-tracking"; // set by cookie banner of the Familienportal
const COOKIE_POLLING_INTERVAL = 500;

// TODO: Change the following values once agreed with the hoster
const ALLOW_TRACKING_COOKIE_VALUE_MATOMO_ONLY = "1";
const ALLOW_TRACKING_COOKIE_VALUE_POSTHOG_ONLY = "1";
const ALLOW_TRACKING_COOKIE_VALUE_MATOMO_AND_POSTHOG = "1";

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

    describe("internal tester identification", () => {
      beforeEach(() => {
        vi.stubEnv("VITE_FEATURE_FLAG_POSTHOG", "true");
        vi.stubEnv("VITE_FEATURE_FLAG_TESTER_IDENTIFICATION", "true");

        vi.spyOn(posthog, "init").mockReturnValue(posthog as never);
        vi.spyOn(posthog, "capture").mockReturnValue(undefined);
        vi.spyOn(document, "cookie", "get").mockReturnValue(
          "cookie-allow-tracking=1",
        );
      });

      afterEach(() => {
        window.history.replaceState({}, "", "/");
      });

      it("identifies the tester by the email from the ?tester query param", async () => {
        window.history.replaceState({}, "", "/?tester=Bob@example.de");
        const identify = vi.spyOn(posthog, "identify");

        await setupUserTracking();

        expect(identify).toHaveBeenCalledWith("bob@example.de", {
          email: "bob@example.de",
        });
      });

      it("does not identify anyone when no tester query param is present", async () => {
        const identify = vi.spyOn(posthog, "identify");

        await setupUserTracking();

        expect(identify).not.toHaveBeenCalled();
      });

      it("does not identify outside the preview environment, even with the param", async () => {
        vi.stubEnv("VITE_FEATURE_FLAG_TESTER_IDENTIFICATION", "false");
        window.history.replaceState({}, "", "/?tester=bob@example.de");
        const identify = vi.spyOn(posthog, "identify");

        await setupUserTracking();

        expect(identify).not.toHaveBeenCalled();
      });

      it("strips the tester param from the URL so the email never reaches $current_url", async () => {
        window.history.replaceState({}, "", "/?tester=bob@example.de&foo=bar");

        await setupUserTracking();

        expect(window.location.search).toEqual("?foo=bar");
      });

      it("scopes preview to sessionStorage so a tester's identity resets between sessions", async () => {
        const init = vi
          .spyOn(posthog, "init")
          .mockReturnValue(posthog as never);

        await setupUserTracking();

        expect(init.mock.lastCall?.[1]).toMatchObject({
          person_profiles: "identified_only",
          persistence: "sessionStorage",
        });
      });

      it("never creates person profiles and keeps default storage outside preview", async () => {
        vi.stubEnv("VITE_FEATURE_FLAG_TESTER_IDENTIFICATION", "false");
        const init = vi
          .spyOn(posthog, "init")
          .mockReturnValue(posthog as never);

        await setupUserTracking();

        expect(init.mock.lastCall?.[1]).toMatchObject({
          person_profiles: "never",
        });
        expect(init.mock.lastCall?.[1]?.persistence).toBeUndefined();
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
