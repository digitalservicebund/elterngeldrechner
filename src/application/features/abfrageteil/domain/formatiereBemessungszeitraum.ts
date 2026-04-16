import { Zeitraum } from "@/bemessungszeitraumrechner";

export const formatiereBemessungszeitraum = (
  zeitraeume: Zeitraum[],
): string[] => {
  return zeitraeume.map(({ von, bis }) => {
    if (von.equals(bis)) {
      return von.toPlainDate({ day: 1 }).toLocaleString("de-DE", {
        month: "long",
        year: "numeric",
      });
    }

    const imGleichenJahr = von.year === bis.year;

    const vonString = von.toPlainDate({ day: 1 }).toLocaleString("de-DE", {
      month: "long",
      year: imGleichenJahr ? undefined : "numeric",
    });

    const bisString = bis.toPlainDate({ day: 1 }).toLocaleString("de-DE", {
      month: "long",
      year: "numeric",
    });

    return `${vonString} bis ${bisString}`;
  });
};

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("formatiereBemessungszeitraum", async () => {
    const { Temporal } = await import("@js-temporal/polyfill");

    it("returns empty array when zeitraeume is an empty array", () => {
      expect(formatiereBemessungszeitraum([])).toEqual([]);
    });

    it("returns array with one string of von and bis when zeitraeume array has one zeitraum", () => {
      const zeitraeume: Zeitraum[] = [
        {
          von: Temporal.PlainYearMonth.from("2024-11"),
          bis: Temporal.PlainYearMonth.from("2025-10"),
        },
      ];

      expect(formatiereBemessungszeitraum(zeitraeume)).toEqual([
        "November 2024 bis Oktober 2025",
      ]);
    });

    it("returns array with two strings of two von and bis when zeitraeume array has two zeitraum", () => {
      const zeitraeume: Zeitraum[] = [
        {
          von: Temporal.PlainYearMonth.from("2024-11"),
          bis: Temporal.PlainYearMonth.from("2025-01"),
        },
        {
          von: Temporal.PlainYearMonth.from("2025-03"),
          bis: Temporal.PlainYearMonth.from("2025-11"),
        },
      ];

      expect(formatiereBemessungszeitraum(zeitraeume)).toEqual([
        "November 2024 bis Januar 2025",
        "März bis November 2025",
      ]);
    });

    it("returns array with one string of only von given one zeitraum is only one month and one of von and bis when zeitraeume array has two zeitraum", () => {
      const zeitraeume: Zeitraum[] = [
        {
          von: Temporal.PlainYearMonth.from("2024-11"),
          bis: Temporal.PlainYearMonth.from("2024-11"),
        },
        {
          von: Temporal.PlainYearMonth.from("2025-01"),
          bis: Temporal.PlainYearMonth.from("2025-11"),
        },
      ];

      expect(formatiereBemessungszeitraum(zeitraeume)).toEqual([
        "November 2024",
        "Januar bis November 2025",
      ]);
    });
  });
}
