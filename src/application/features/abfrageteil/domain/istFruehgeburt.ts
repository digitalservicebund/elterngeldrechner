import { Temporal } from "@js-temporal/polyfill";

export function istFruehgeburt(
  geburtsdatum: Temporal.PlainDate,
  errechneterEntbindungstermin: Temporal.PlainDate,
): boolean {
  return geburtsdatum.until(errechneterEntbindungstermin).days > 42;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("istFruehgeburt", () => {
    it("returns true when born more than 6 weeks before due date", () => {
      expect(
        istFruehgeburt(
          Temporal.PlainDate.from("2024-01-01"),
          Temporal.PlainDate.from("2024-03-01"),
        ),
      ).toEqual(true);
    });

    it("returns false when born exactly 6 weeks (42 days) before due date", () => {
      expect(
        istFruehgeburt(
          Temporal.PlainDate.from("2024-01-01"),
          Temporal.PlainDate.from("2024-02-12"),
        ),
      ).toEqual(false);
    });

    it("returns false when born on due date", () => {
      expect(
        istFruehgeburt(
          Temporal.PlainDate.from("2024-06-15"),
          Temporal.PlainDate.from("2024-06-15"),
        ),
      ).toEqual(false);
    });

    it("returns false when born after due date", () => {
      expect(
        istFruehgeburt(
          Temporal.PlainDate.from("2024-03-10"),
          Temporal.PlainDate.from("2024-03-01"),
        ),
      ).toEqual(false);
    });
  });
}
