import { Temporal } from "@js-temporal/polyfill";
import { v1, v2, v3 } from "./configurations";

type Validity = {
  readonly version: number;
  readonly startFrom: Temporal.PlainDate;
};

const initialVersion = { version: 1 as const };

// Ordered chronologically. Each node becomes active on its startFrom date.
// initialVersion is valid from the beginning of time, the last node forever.
const versionTimeline = [
  {
    version: 2 as const,
    startFrom: Temporal.PlainDate.from("2024-04-01"),
  },
  {
    version: 3 as const,
    startFrom: Temporal.PlainDate.from("2025-04-01"),
  },
] satisfies Validity[];

export type PdfVersionNumber =
  | typeof initialVersion.version
  | (typeof versionTimeline)[number]["version"];

export const versionedConfigurations = {
  1: v1,
  2: v2,
  3: v3,
} as const satisfies Record<PdfVersionNumber, object>;

export function findPdfVersion(date: Temporal.PlainDate): PdfVersionNumber {
  return versionTimeline.reduce<PdfVersionNumber>((match, node) => {
    return Temporal.PlainDate.compare(date, node.startFrom) >= 0
      ? node.version
      : match;
  }, initialVersion.version);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findPdfVersion", () => {
    it("returns the first version for a date before any boundary", () => {
      expect(findPdfVersion(Temporal.PlainDate.from("2020-01-01"))).toBe(1);
    });

    it("returns the previous version on the day before a boundary", () => {
      expect(findPdfVersion(Temporal.PlainDate.from("2024-03-31"))).toBe(1);
      expect(findPdfVersion(Temporal.PlainDate.from("2025-03-31"))).toBe(2);
    });

    it("returns the next version on the startFrom date", () => {
      expect(findPdfVersion(Temporal.PlainDate.from("2024-04-01"))).toBe(2);
      expect(findPdfVersion(Temporal.PlainDate.from("2025-04-01"))).toBe(3);
    });

    it("returns the last version for a date far in the future", () => {
      expect(findPdfVersion(Temporal.PlainDate.from("2099-12-31"))).toBe(3);
    });
  });
}
