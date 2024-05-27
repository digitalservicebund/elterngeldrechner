import { ElterngeldType } from "./elternteile-types";
import { calculatePartnerschaftlichkeiteVerteilung } from "./partnerschaftlichkeit";

describe("partnerschaftlichkeit", () => {
  it("should calculate a quotient of zero if no parent takes any month", () => {
    const quotient = calculatePartnerschaftlichkeiteVerteilung([], []);

    expect(quotient).toEqual(0);
  });

  it.each<{
    monthsET1: ElterngeldType[];
    monthsET2: ElterngeldType[];
    expectedQuotient: number;
  }>([
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
      const quotient = calculatePartnerschaftlichkeiteVerteilung(
        monthsET1,
        monthsET2,
      );

      expect(quotient).toEqual(expectedQuotient);
    },
  );
});
