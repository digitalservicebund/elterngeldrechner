import { describe, expect, it, vi } from "vitest";
import {
  type Auswahl,
  trackPartnerschaftlicheVerteilung,
} from "./partnerschaftlichkeit";
import { setTrackingVariable } from "@/application/user-tracking/core";

vi.mock(import("@/application/user-tracking/core/data-layer"));

describe("partnerschaftlichkeit", () => {
  it("sets the tracking variable 'partnerschaftlicheverteilung'", () => {
    trackPartnerschaftlicheVerteilung([[], []]);

    expect(setTrackingVariable).toHaveBeenCalledTimes(1);
    expect(setTrackingVariable).toHaveBeenLastCalledWith(
      "partnerschaftlicheverteilung",
      expect.anything(),
    );
  });

  it("should not track anything if there is only one Elternteil", () => {
    trackPartnerschaftlicheVerteilung([[]]);

    expect(setTrackingVariable).not.toHaveBeenCalled();
  });

  it.each<{
    auswahlProMonatProElternteil: [Auswahl[], Auswahl[]];
    expectedQuotient: number;
  }>([
    {
      auswahlProMonatProElternteil: [[], []],
      expectedQuotient: 0,
    },
    {
      auswahlProMonatProElternteil: [[null], ["Basis"]],
      expectedQuotient: 0,
    },
    {
      auswahlProMonatProElternteil: [
        ["Plus", "Plus"],
        [null, null],
      ],
      expectedQuotient: 0,
    },
    {
      auswahlProMonatProElternteil: [["Basis"], ["Basis"]],
      expectedQuotient: 1,
    },
    {
      auswahlProMonatProElternteil: [["Plus"], ["Plus"]],
      expectedQuotient: 1,
    },
    {
      auswahlProMonatProElternteil: [["Basis"], ["Plus"]],
      expectedQuotient: 0.5,
    },
    {
      auswahlProMonatProElternteil: [["Plus"], ["Basis"]],
      expectedQuotient: 0.5,
    },
    {
      auswahlProMonatProElternteil: [
        ["Basis", null],
        ["Plus", "Plus"],
      ],
      expectedQuotient: 1,
    },
    {
      auswahlProMonatProElternteil: [
        ["Basis", "Plus", "Plus"],
        ["Plus", "Plus", "Plus"],
      ],
      expectedQuotient: 0.75,
    },
    {
      auswahlProMonatProElternteil: [
        ["Basis", "Bonus", "Bonus", "Bonus"],
        [null, "Bonus", "Bonus", "Bonus"],
      ],
      expectedQuotient: 0.6,
    },
    {
      auswahlProMonatProElternteil: [
        Array<"Basis">(12).fill("Basis"),
        Array<null>(12).fill(null),
      ],
      expectedQuotient: 0,
    },
    {
      auswahlProMonatProElternteil: [
        [...Array<"Basis">(12).fill("Basis"), null, null],
        [...Array<null>(12).fill(null), "Basis", "Basis"],
      ],
      expectedQuotient: 2 / 12,
    },
  ])(
    "should calculate the correct quotient (case #%#)",
    ({ auswahlProMonatProElternteil, expectedQuotient }) => {
      trackPartnerschaftlicheVerteilung(auswahlProMonatProElternteil);

      expect(setTrackingVariable).toHaveBeenCalledWith(
        expect.anything(),
        expectedQuotient,
      );
    },
  );
});
