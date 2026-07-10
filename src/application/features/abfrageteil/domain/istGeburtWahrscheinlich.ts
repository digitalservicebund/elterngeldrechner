import { Temporal } from "@js-temporal/polyfill";

export function istGeburtWahrscheinlich(
  errechneterEntbindungstermin: Temporal.PlainDate,
  heute: Temporal.PlainDate,
): boolean {
  return (
    Temporal.PlainDate.compare(
      errechneterEntbindungstermin,
      heute.subtract({ days: 16 }),
    ) < 0
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("istGeburtWahrscheinlich", () => {
    const heute = Temporal.PlainDate.from("2024-02-01");

    it("is false when the due date is exactly at the threshold", () => {
      expect(
        istGeburtWahrscheinlich(Temporal.PlainDate.from("2024-01-16"), heute),
      ).toBe(false);
    });

    it("is true when the due date is before the threshold", () => {
      expect(
        istGeburtWahrscheinlich(Temporal.PlainDate.from("2024-01-15"), heute),
      ).toBe(true);
    });

    it("is false when the due date is in the future", () => {
      expect(
        istGeburtWahrscheinlich(Temporal.PlainDate.from("2024-03-01"), heute),
      ).toBe(false);
    });
  });
}
