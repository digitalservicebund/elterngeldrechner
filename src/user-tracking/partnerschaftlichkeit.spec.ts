import { setTrackingVariable } from "./data-layer";
import { trackPartnerschaftlicheVerteilung } from "./partnerschaftlichkeit";
import { ElterngeldType } from "@/monatsplaner";

vi.mock("./data-layer.ts");

describe("partnerschaftlichkeit", () => {
  it("sets the tracking variable 'partnerschaftlicheverteilung'", () => {
    trackPartnerschaftlicheVerteilung(ANY_MONTHS, ANY_MONTHS, false);

    expect(setTrackingVariable).toHaveBeenCalledTimes(1);
    expect(setTrackingVariable).toHaveBeenLastCalledWith(
      "partnerschaftlicheverteilung",
      expect.anything(),
    );
  });

  it("should not track anything if there are no two parents", () => {
    trackPartnerschaftlicheVerteilung(ANY_MONTHS, ANY_MONTHS, true);

    expect(setTrackingVariable).not.toHaveBeenCalled();
  });

  it.each<{
    monthsET1: ElterngeldType[];
    monthsET2: ElterngeldType[];
    expectedQuotient: number;
  }>([
    {
      monthsET1: [],
      monthsET2: [],
      expectedQuotient: 0,
    },
    {
      monthsET1: ["None"],
      monthsET2: ["BEG"],
      expectedQuotient: 0,
    },
    {
      monthsET1: ["EG+", "EG+"],
      monthsET2: ["None"],
      expectedQuotient: 0,
    },
    {
      monthsET1: ["BEG"],
      monthsET2: ["BEG"],
      expectedQuotient: 1,
    },
    {
      monthsET1: ["EG+"],
      monthsET2: ["EG+"],
      expectedQuotient: 1,
    },
    {
      monthsET1: ["BEG"],
      monthsET2: ["EG+"],
      expectedQuotient: 0.5,
    },
    {
      monthsET1: ["EG+"],
      monthsET2: ["BEG"],
      expectedQuotient: 0.5,
    },
    {
      monthsET1: ["BEG"],
      monthsET2: ["EG+", "EG+"],
      expectedQuotient: 1,
    },
    {
      monthsET1: ["BEG", "EG+", "EG+"],
      monthsET2: ["EG+", "EG+", "EG+"],
      expectedQuotient: 0.75,
    },
    {
      monthsET1: ["BEG", "PSB", "PSB", "PSB"],
      monthsET2: ["None", "PSB", "PSB", "PSB"],
      expectedQuotient: 0.6,
    },
    {
      monthsET1: Array(12).fill("BEG"),
      monthsET2: Array(12).fill("None"),
      expectedQuotient: 0,
    },
    {
      monthsET1: Array(12).fill("BEG"),
      monthsET2: [...Array(12).fill("None"), "BEG", "BEG"],
      expectedQuotient: 2 / 12,
    },
  ])(
    "should calculate the correct factor (#$#)",
    ({ monthsET1, monthsET2, expectedQuotient }) => {
      trackPartnerschaftlicheVerteilung(monthsET1, monthsET2, false);

      expect(setTrackingVariable).toHaveBeenCalledWith(
        expect.anything(),
        expectedQuotient,
      );
    },
  );
});

const ANY_MONTHS: ElterngeldType[] = ["BEG"];
