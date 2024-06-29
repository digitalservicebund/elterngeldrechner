import * as tagManagerModule from "./tag-manager";
import { setupTagManager } from "./tag-manager";
import * as dataLayerModule from "./data-layer";
import { establishDataLayer } from "./data-layer";
import { setupUserTracking } from "./index";

describe("user tracking", () => {
  beforeEach(() => {
    // Satisfy assumption for tag manager script injection (necessary?)
    document.body.innerHTML = "<script src='main.js' />";
  });

  const originalCookies = document.cookie;
  const originalEnv = process.env;

  afterEach(() => {
    document.cookie = originalCookies;
    process.env = originalEnv;
  });

  describe("check conditions for tracking", () => {
    beforeEach(() => {
      vi.spyOn(tagManagerModule, "setupTagManager");
      vi.spyOn(dataLayerModule, "establishDataLayer");
    });

    it("does not setup the tag manager if no source URL was configured, even user allowed tracking", async () => {
      delete process.env.REACT_APP_USER_TRACKING_TAG_MANAGER_SOURCE;
      vi.spyOn(document, "cookie", "get").mockReturnValue(
        COOKIES_WITH_ALLOWANCE,
      );

      await setupUserTracking();

      expect(setupTagManager).not.toHaveBeenCalled();
      expect(establishDataLayer).not.toHaveBeenCalled();
    });

    it("does not check the user allowance if no source URL was configured anyway", async () => {
      delete process.env.REACT_APP_USER_TRACKING_TAG_MANAGER_SOURCE;
      const cookieSpy = vi.spyOn(document, "cookie", "get");

      await setupUserTracking();

      expect(cookieSpy).not.toHaveBeenCalled();
    });

    it("does not setup the tag manager if user denied it, even the source URL was configured", async () => {
      process.env.REACT_APP_USER_TRACKING_TAG_MANAGER_SOURCE = ANY_SOURCE_URL;
      vi.spyOn(document, "cookie", "get").mockReturnValue(
        "cookie-allow-tracking=0",
      );

      await setupUserTracking();

      expect(setupTagManager).not.toHaveBeenCalled();
      expect(establishDataLayer).not.toHaveBeenCalled();
    });

    it("setups up the tag manager if user allowed it and a source URL was configured", async () => {
      process.env.REACT_APP_USER_TRACKING_TAG_MANAGER_SOURCE = "test-url";
      vi.spyOn(document, "cookie", "get").mockReturnValue(
        "cookie-allow-tracking=1;other-cookie=test",
      );

      await setupUserTracking();

      expect(setupTagManager).toHaveBeenCalledTimes(1);
      expect(establishDataLayer).toHaveBeenCalledTimes(1);
    });

    it("continues to poll the cookies until user denied or allowed the user trackinguntil the user denied or allowed the user tracking", async () => {
      process.env.REACT_APP_USER_TRACKING_TAG_MANAGER_SOURCE = ANY_SOURCE_URL;
      vi.spyOn(document, "cookie", "get")
        .mockReturnValueOnce("other-cookie=test")
        .mockReturnValueOnce("other-cookie=test")
        .mockReturnValueOnce("cookie-allow-tracking=1;other-cookie=test");

      await setupUserTracking();

      expect(setupTagManager).toHaveBeenCalledTimes(1);
    });
  });

  describe("load and configure tag manager", () => {
    beforeEach(() => {
      document.body.innerHTML = "<script src='main.js' />";
      jest
        .mocked(setupTagManager)
        .mockImplementation(
          jest.requireActual("./tag-manager.ts").setupTagManager,
        );
    });

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
});

function configureTracking(tagManagerSource = ANY_SOURCE_URL): void {
  process.env.REACT_APP_USER_TRACKING_TAG_MANAGER_SOURCE = tagManagerSource;
  vi.spyOn(document, "cookie", "get").mockReturnValue(
    "cookie-allow-tracking=1",
  );
}

const COOKIES_WITH_ALLOWANCE = "cookie-allow-tracking=1";
const ANY_SOURCE_URL = "test-url";
