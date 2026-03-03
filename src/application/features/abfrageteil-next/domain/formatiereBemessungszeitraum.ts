import { Zeitraum } from "@/bemessungszeitraumrechner";

export const formatiereBemessungszeitraum = (
  zeitraeume: Zeitraum[],
): string => {
  return zeitraeume
    .map((time) => {
      const von = time.von
        .toPlainDate({ day: 1 })
        .toLocaleString("de-DE", { month: "long", year: "numeric" });
      const bis = time.bis
        .toPlainDate({ day: 1 })
        .toLocaleString("de-DE", { month: "long", year: "numeric" });

      return von === bis ? von : `${von} – ${bis}`;
    })
    .join(" & ");
};

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("formatiereBemessungszeitraum", async () => {
    const { Temporal } = await import("@js-temporal/polyfill");

    it("returns empty string when zeitraeume is an empty array", () => {
      expect(formatiereBemessungszeitraum([])).toEqual("");
    });

    it("returns string of one von and bis when zeitraeume array has one zeitraum", () => {
      const zeitraeume: Zeitraum[] = [
        {
          von: Temporal.PlainYearMonth.from("2024-11"),
          bis: Temporal.PlainYearMonth.from("2025-10"),
        },
      ];

      expect(formatiereBemessungszeitraum(zeitraeume)).toEqual(
        "November 2024 – Oktober 2025",
      );
    });

    it("returns string of two von and bis separated with & when zeitraeume array has two zeitraum", () => {
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

      expect(formatiereBemessungszeitraum(zeitraeume)).toEqual(
        "November 2024 – Januar 2025 & März 2025 – November 2025",
      );
    });
  });
}
