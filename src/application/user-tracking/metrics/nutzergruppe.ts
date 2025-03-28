import { setTrackingVariable } from "@/application/user-tracking/core";

enum Nutzergruppe {
  WERDENDE_ELTERN = "werdende Eltern",
  JUNGE_ELTERN = "junge Eltern",
  NACHBEANTRAGENDE_ELTERN = "nachbeantragende Eltern",
}

export function trackNutzergruppe(birthdate: Date): void {
  const nutzergruppe = mapDateToNutzergruppe(birthdate);
  setTrackingVariable(TRACKING_VARIABLE_NAME, nutzergruppe);
}

function mapDateToNutzergruppe(birthdate: Date): Nutzergruppe {
  const today = new Date();
  const dayThreeMonthsAgo = new Date(new Date().setMonth(today.getMonth() - 3));

  const isInFuture = birthdate > today;
  const wasWithinLastThreeMonths =
    dayThreeMonthsAgo <= birthdate && birthdate <= today;

  if (isInFuture) {
    return Nutzergruppe.WERDENDE_ELTERN;
  } else {
    return wasWithinLastThreeMonths
      ? Nutzergruppe.JUNGE_ELTERN
      : Nutzergruppe.NACHBEANTRAGENDE_ELTERN;
  }
}

const TRACKING_VARIABLE_NAME = "nutzergruppe";

if (import.meta.vitest) {
  const { describe, beforeEach, afterEach, it, expect, vi } = import.meta
    .vitest;

  describe("trackNutzergruppe()", () => {
    beforeEach(async () => {
      vi.useFakeTimers();

      vi.spyOn(
        await import("@/application/user-tracking/core"),
        "setTrackingVariable",
      );
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("sets the tracking variabe 'nutzergruppe'", () => {
      trackNutzergruppe(ANY_BIRTHDATE);

      expect(setTrackingVariable).toHaveBeenCalledTimes(1);
      expect(setTrackingVariable).toHaveBeenLastCalledWith(
        "nutzergruppe",
        expect.anything(),
      );
    });

    it.each([
      new Date(2024, 6, 3),
      new Date(2024, 12, 31),
      new Date(2025, 6, 2),
      new Date(2026, 1, 1),
    ])(
      "sets the variable to 'werdene Eltern' if the birthdate is in the future (case #$#)",
      (birthdate) => {
        vi.setSystemTime(new Date(2024, 6, 2));

        trackNutzergruppe(birthdate);

        expect(setTrackingVariable).toHaveBeenCalledWith(
          expect.anything(),
          "werdende Eltern",
        );
      },
    );

    it.each([
      new Date(2024, 6, 2),
      new Date(2024, 6, 1),
      new Date(2024, 4, 5),
      new Date(2024, 3, 3),
      new Date(2024, 3, 2),
    ])(
      "sets the variable to 'junge Eltern' if the birthdate was within the last three months (case #$#)",
      (birthdate: Date) => {
        vi.setSystemTime(new Date(2024, 6, 2));

        trackNutzergruppe(birthdate);

        expect(setTrackingVariable).toHaveBeenCalledWith(
          expect.anything(),
          "junge Eltern",
        );
      },
    );

    it.each([
      new Date(2024, 3, 1),
      new Date(2024, 2, 28),
      new Date(2024, 1, 1),
      new Date(2023, 12, 31),
    ])(
      "sets the variable to 'nachbeantragende Eltern' if the birthdate was in the past longer than three months ago (case #$#)",
      (birthdate: Date) => {
        vi.setSystemTime(new Date(2024, 6, 2));

        trackNutzergruppe(birthdate);

        expect(setTrackingVariable).toHaveBeenCalledWith(
          expect.anything(),
          "nachbeantragende Eltern",
        );
      },
    );
  });

  const ANY_BIRTHDATE = new Date();
}
