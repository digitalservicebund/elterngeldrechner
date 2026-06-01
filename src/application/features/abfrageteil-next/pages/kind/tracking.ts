import { Temporal } from "@js-temporal/polyfill";

export function istFruehgeburt(
  geburtsdatum: Temporal.PlainDate,
  errechneterEntbindungstermin: Temporal.PlainDate,
): boolean {
  return (
    Temporal.PlainDate.compare(geburtsdatum, errechneterEntbindungstermin) < 0
  );
}

export function sindMehrlinge(anzahl: number): boolean {
  return anzahl > 1;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("tracking", async () => {
    describe("sindMehrlinge", () => {
      it("returns false for a single child", () => {
        expect(sindMehrlinge(1)).toEqual(false);
      });

      it("returns true for twins", () => {
        expect(sindMehrlinge(2)).toEqual(true);
      });
    });

    describe("istFruehgeburt", () => {
      it("returns true when born before due date", () => {
        expect(
          istFruehgeburt(
            Temporal.PlainDate.from("2024-01-01"),
            Temporal.PlainDate.from("2024-03-01"),
          ),
        ).toEqual(true);
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
  });
}
