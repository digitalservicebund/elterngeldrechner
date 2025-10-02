import { addMonths, addWeeks, isBefore, subWeeks } from "date-fns";
import { setTrackingVariable } from "@/application/user-tracking/core";

export function trackNutzergruppe(birthdate: Date): void {
  const nutzergruppe = determineNutzergruppe(new Date(), birthdate);

  setTrackingVariable("nutzergruppe", nutzergruppe);
}

function determineNutzergruppe(today: Date, birthdate: Date) {
  const startOfPregnancy = subWeeks(birthdate, 40);

  if (isBefore(today, startOfPregnancy)) {
    return "Kinderwunsch vor Schwangerschaft";
  } else if (isBefore(today, addWeeks(startOfPregnancy, 13))) {
    return "werdende Eltern (1. Trimester)";
  } else if (isBefore(today, addWeeks(startOfPregnancy, 27))) {
    return "werdende Eltern (2. Trimester)";
  } else if (isBefore(today, birthdate)) {
    return "werdende Eltern (3. Trimester)";
  } else if (isBefore(today, addMonths(birthdate, 3))) {
    return "frische Eltern";
  } else {
    return "nachbeantragende Eltern";
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("determineNutzergruppe", () => {
    it("returns 'nachbeantragende Eltern' 3 months past the birthdate", () => {
      const birthdate = new Date("2024-01-01");
      const today = new Date("2024-04-01");

      const nutzergruppe = determineNutzergruppe(today, birthdate);

      expect(nutzergruppe).toEqual("nachbeantragende Eltern");
    });

    it("returns 'frische Eltern' (3 months - 1 day) past the birthdate", () => {
      const birthdate = new Date("2024-01-01");
      const today = new Date("2024-03-31");

      const nutzergruppe = determineNutzergruppe(today, birthdate);

      expect(nutzergruppe).toEqual("frische Eltern");
    });

    it("returns 'frische Eltern' on the birthdate", () => {
      const birthdate = new Date("2024-01-01");
      const today = new Date("2024-01-01");

      const nutzergruppe = determineNutzergruppe(today, birthdate);

      expect(nutzergruppe).toEqual("frische Eltern");
    });

    it("returns 'werdende Eltern (3. Trimester)' on the day before the birthdate", () => {
      const birthdate = new Date("2024-10-07");
      const today = new Date("2024-10-06");

      const nutzergruppe = determineNutzergruppe(today, birthdate);

      expect(nutzergruppe).toEqual("werdende Eltern (3. Trimester)");
    });

    it("returns 'werdende Eltern (3. Trimester)' on the start of the third trimester", () => {
      const birthdate = new Date("2024-10-07");
      const today = new Date("2024-07-08");

      const nutzergruppe = determineNutzergruppe(today, birthdate);

      expect(nutzergruppe).toEqual("werdende Eltern (3. Trimester)");
    });

    it("returns 'werdende Eltern (2. Trimester)' on the start of the second trimester", () => {
      const birthdate = new Date("2024-10-07");
      const today = new Date("2024-04-01");

      const nutzergruppe = determineNutzergruppe(today, birthdate);

      expect(nutzergruppe).toEqual("werdende Eltern (2. Trimester)");
    });

    it("returns 'werdende Eltern (1. Trimester)' on the end of the first trimester", () => {
      const birthdate = new Date("2024-10-07");
      const today = new Date("2024-03-31");

      const nutzergruppe = determineNutzergruppe(today, birthdate);

      expect(nutzergruppe).toEqual("werdende Eltern (1. Trimester)");
    });

    it("returns 'werdende Eltern (1. Trimester)' on the last menstrual period", () => {
      const birthdate = new Date("2025-01-01");
      const today = new Date("2024-03-27");

      const nutzergruppe = determineNutzergruppe(today, birthdate);

      expect(nutzergruppe).toEqual("werdende Eltern (1. Trimester)");
    });

    it("returns 'Kinderwunsch vor Schwangerschaft' before the pregnancy", () => {
      const birthdate = new Date("2025-01-01");
      const today = new Date("2024-03-26");

      const nutzergruppe = determineNutzergruppe(today, birthdate);

      expect(nutzergruppe).toEqual("Kinderwunsch vor Schwangerschaft");
    });
  });
}
