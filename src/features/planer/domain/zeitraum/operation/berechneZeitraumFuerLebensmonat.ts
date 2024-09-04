import type { Lebensmonatszahl } from "@/features/planer/domain/Lebensmonatszahl";
import type { Zeitraum } from "@/features/planer/domain/zeitraum/Zeitraum";

export function berechneZeitraumFuerLebensmonat(
  geburtsdatumDesKindes: Date,
  lebensmonatszahl: Lebensmonatszahl,
): Zeitraum {
  const from = copyAndShiftDate(geburtsdatumDesKindes, {
    months: lebensmonatszahl - 1,
  });
  const to = copyAndShiftDate(from, { months: 1, days: -1 });
  return { from, to };
}

function copyAndShiftDate(
  date: Date,
  shiftBy: { months?: number; days?: number },
): Date {
  const copiedDate = new Date(date);
  copiedDate.setMonth(copiedDate.getMonth() + (shiftBy.months ?? 0));
  copiedDate.setDate(copiedDate.getDate() + (shiftBy.days ?? 0));
  return copiedDate;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("berechne Zeitraum für Lebensmonat", () => {
    it("shifts month of the Geburtsdatum by the Lebensmonatszahl within the same year", () => {
      const zeitraum = berechneZeitraumFuerLebensmonat(new Date(2000, 6, 3), 3);

      expect(zeitraum.from.getMonth()).toBe(8);
      expect(zeitraum.from.getFullYear()).toBe(2000);
      expect(zeitraum.to.getMonth()).toBe(9);
      expect(zeitraum.to.getFullYear()).toBe(2000);
    });

    it("shifts the month of the Geburtsdatum by the Lebensmonatszahl to the next year", () => {
      const zeitraum = berechneZeitraumFuerLebensmonat(new Date(2000, 6, 3), 6);

      expect(zeitraum.from.getMonth()).toBe(11);
      expect(zeitraum.from.getFullYear()).toBe(2000);
      expect(zeitraum.to.getMonth()).toBe(0);
      expect(zeitraum.to.getFullYear()).toBe(2001);
    });

    it("ends the Zeitraum one day earlier than a whole month", () => {
      const zeitraum = berechneZeitraumFuerLebensmonat(new Date(2000, 6, 3), 3);

      expect(zeitraum.from.getDate()).toBe(3);
      expect(zeitraum.to.getDate()).toBe(2);
    });
  });
}
