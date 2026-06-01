import { Temporal } from "@js-temporal/polyfill";

export function istFruehgeburt(
  geburtsdatum: Temporal.PlainDate,
  errechneterEntbindungstermin: Temporal.PlainDate,
): boolean {
  return isBefore(geburtsdatum, errechneterEntbindungstermin);
}

export function sindMehrlinge(anzahl: number): boolean {
  return anzahl > 1;
}

export function bestimmeNutzergruppe(
  today: Temporal.PlainDate,
  birthdate: Temporal.PlainDate,
) {
  const startOfPregnancy = birthdate.subtract({ weeks: 40 });

  if (isBefore(today, startOfPregnancy)) {
    return "Kinderwunsch vor Schwangerschaft";
  } else if (isBefore(today, startOfPregnancy.add({ weeks: 13 }))) {
    return "werdende Eltern (1. Trimester)";
  } else if (isBefore(today, startOfPregnancy.add({ weeks: 27 }))) {
    return "werdende Eltern (2. Trimester)";
  } else if (isBefore(today, birthdate)) {
    return "werdende Eltern (3. Trimester)";
  } else if (isBefore(today, birthdate.add({ months: 3 }))) {
    return "frische Eltern";
  } else {
    return "nachbeantragende Eltern";
  }
}

function isBefore(a: Temporal.PlainDate, b: Temporal.PlainDate): boolean {
  return Temporal.PlainDate.compare(a, b) < 0;
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

    describe("bestimmeNutzergruppe", () => {
      it("returns 'nachbeantragende Eltern' 3 months past the birthdate", () => {
        expect(
          bestimmeNutzergruppe(
            Temporal.PlainDate.from("2024-04-01"),
            Temporal.PlainDate.from("2024-01-01"),
          ),
        ).toEqual("nachbeantragende Eltern");
      });

      it("returns 'frische Eltern' (3 months - 1 day) past the birthdate", () => {
        expect(
          bestimmeNutzergruppe(
            Temporal.PlainDate.from("2024-03-31"),
            Temporal.PlainDate.from("2024-01-01"),
          ),
        ).toEqual("frische Eltern");
      });

      it("returns 'frische Eltern' on the birthdate", () => {
        expect(
          bestimmeNutzergruppe(
            Temporal.PlainDate.from("2024-01-01"),
            Temporal.PlainDate.from("2024-01-01"),
          ),
        ).toEqual("frische Eltern");
      });

      it("returns 'werdende Eltern (3. Trimester)' on the day before the birthdate", () => {
        expect(
          bestimmeNutzergruppe(
            Temporal.PlainDate.from("2024-10-06"),
            Temporal.PlainDate.from("2024-10-07"),
          ),
        ).toEqual("werdende Eltern (3. Trimester)");
      });

      it("returns 'werdende Eltern (3. Trimester)' on the start of the third trimester", () => {
        expect(
          bestimmeNutzergruppe(
            Temporal.PlainDate.from("2024-07-08"),
            Temporal.PlainDate.from("2024-10-07"),
          ),
        ).toEqual("werdende Eltern (3. Trimester)");
      });

      it("returns 'werdende Eltern (2. Trimester)' on the start of the second trimester", () => {
        expect(
          bestimmeNutzergruppe(
            Temporal.PlainDate.from("2024-04-01"),
            Temporal.PlainDate.from("2024-10-07"),
          ),
        ).toEqual("werdende Eltern (2. Trimester)");
      });

      it("returns 'werdende Eltern (1. Trimester)' on the end of the first trimester", () => {
        expect(
          bestimmeNutzergruppe(
            Temporal.PlainDate.from("2024-03-31"),
            Temporal.PlainDate.from("2024-10-07"),
          ),
        ).toEqual("werdende Eltern (1. Trimester)");
      });

      it("returns 'werdende Eltern (1. Trimester)' on the last menstrual period", () => {
        expect(
          bestimmeNutzergruppe(
            Temporal.PlainDate.from("2024-03-27"),
            Temporal.PlainDate.from("2025-01-01"),
          ),
        ).toEqual("werdende Eltern (1. Trimester)");
      });

      it("returns 'Kinderwunsch vor Schwangerschaft' before the pregnancy", () => {
        expect(
          bestimmeNutzergruppe(
            Temporal.PlainDate.from("2024-03-26"),
            Temporal.PlainDate.from("2025-01-01"),
          ),
        ).toEqual("Kinderwunsch vor Schwangerschaft");
      });
    });
  });
}
