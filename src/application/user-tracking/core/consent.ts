export type TrackingConsent = {
  matomo: boolean;
  posthog: boolean;
};

/**
 * Parses the decoded consent value set by the Familienportal cookie banner.
 *
 * Two formats coexist during the migration to per-tool consent: single-number
 * in the legacy cookies and a semicolon-separated list in the updated format.
 *
 * Unknown or malformed input grants nothing, so consent fails closed.
 */
export function parseTrackingConsent(value: string): TrackingConsent {
  if (isPerToolFormat(value)) {
    return parsePerToolGrants(value);
  } else {
    return parseMatomoFlag(value);
  }
}

function isPerToolFormat(value: string): boolean {
  return value.includes("=");
}

function parsePerToolGrants(value: string): TrackingConsent {
  const grants = new Map(
    value.split(",").map((pair): [string, string] => {
      const [tool, grant] = pair.split("=");

      return [tool?.trim() ?? "", grant?.trim() ?? ""];
    }),
  );

  return {
    matomo: grants.get("matomo") === CONSENT_GRANTED,
    posthog: grants.get("posthog") === CONSENT_GRANTED,
  };
}

// Posthog stays off for the legacy format: that banner predates posthog and
// never asked the user about it, so we may not enable it without consent.
function parseMatomoFlag(value: string): TrackingConsent {
  return { matomo: value === CONSENT_GRANTED, posthog: false };
}

// The value the banner stores for a tool the user consented to.
const CONSENT_GRANTED = "1";

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("parse tracking consent", () => {
    describe("legacy single-number format", () => {
      it("grants only Matomo when the user allowed tracking", () => {
        expect(parseTrackingConsent("1")).toEqual({
          matomo: true,
          posthog: false,
        });
      });

      it("grants nothing when the user denied tracking", () => {
        expect(parseTrackingConsent("0")).toEqual({
          matomo: false,
          posthog: false,
        });
      });
    });

    describe("per-tool format", () => {
      it("grants each tool the value it received", () => {
        expect(parseTrackingConsent("matomo=1,posthog=0")).toEqual({
          matomo: true,
          posthog: false,
        });
        expect(parseTrackingConsent("matomo=0,posthog=1")).toEqual({
          matomo: false,
          posthog: true,
        });
        expect(parseTrackingConsent("matomo=1,posthog=1")).toEqual({
          matomo: true,
          posthog: true,
        });
        expect(parseTrackingConsent("matomo=0,posthog=0")).toEqual({
          matomo: false,
          posthog: false,
        });
      });

      it("does not grant a tool that is absent from the value", () => {
        expect(parseTrackingConsent("matomo=1")).toEqual({
          matomo: true,
          posthog: false,
        });
      });

      it("tolerates whitespace around tools and grants", () => {
        expect(parseTrackingConsent("matomo=1, posthog=1")).toEqual({
          matomo: true,
          posthog: true,
        });
      });
    });
  });
}
