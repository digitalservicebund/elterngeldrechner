import { addMonths, subWeeks } from "date-fns";
import type { Arbitrary } from "fast-check";
import { setTrackingVariable } from "@/application/user-tracking/core";

export function trackNutzergruppe(birthdate: Date): void {
  const nutzergruppe = mapBirthdateToNutzergruppe(birthdate);
  setTrackingVariable("nutzergruppe", nutzergruppe);
}

function mapBirthdateToNutzergruppe(birthdate: Date): Nutzergruppe {
  const today = new Date();
  const tenWeeksBeforeBeforeBirth = subWeeks(birthdate, 10);
  const threeMonthsAfterBirth = addMonths(birthdate, 3);

  if (today < tenWeeksBeforeBeforeBirth) {
    return Nutzergruppe.WerdendeElternPhase1;
  } else if (today < birthdate) {
    return Nutzergruppe.WerdendeElternPhase2;
  } else if (today < threeMonthsAfterBirth) {
    return Nutzergruppe.JungeEltern;
  } else {
    return Nutzergruppe.NachbeantragendeEltern;
  }
}

enum Nutzergruppe {
  WerdendeElternPhase1 = "werdende Eltern (Phase 1)",
  WerdendeElternPhase2 = "werdende Eltern (Phase 2)",
  JungeEltern = "junge Eltern",
  NachbeantragendeEltern = "nachbeantragende Eltern",
}

if (import.meta.vitest) {
  const { describe, beforeEach, afterEach, it, expect, vi } = import.meta
    .vitest;

  describe("track Nutzergruppe", async () => {
    const { subDays } = await import("date-fns");
    const {
      assert,
      property,
      date: arbitraryDate,
    } = await import("fast-check");

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

    it("sets the tracking variable 'nutzergruppe'", () => {
      assert(
        property(arbitraryBirthdate(), (birthdate) => {
          vi.mocked(setTrackingVariable).mockReset();

          trackNutzergruppe(birthdate);

          expect(setTrackingVariable).toHaveBeenCalledTimes(1);
          expect(setTrackingVariable).toHaveBeenLastCalledWith(
            "nutzergruppe",
            expect.anything(),
          );
        }),
      );
    });

    it("Nutzergruppe is 'werdende Eltern (Phase 1)' if today is earlier than 10 weeks before the birthdate", () => {
      assert(
        property(
          arbitraryParameters(
            arbitraryBirthdate(),
            arbitraryToday({
              max: (birthdate) => subDays(subWeeks(birthdate, 10), 1),
            }),
          ),
          ({ birthdate, today }) => {
            vi.mocked(setTrackingVariable).mockReset();
            vi.setSystemTime(today);

            trackNutzergruppe(birthdate);

            expect(setTrackingVariable).toHaveBeenCalledWith(
              expect.anything(),
              "werdende Eltern (Phase 1)",
            );
          },
        ),
      );
    });

    it("Nutzergruppe is 'werdende Eltern (Phase 2)' if today is between the 31st week of pregnancy and date of birth", () => {
      assert(
        property(
          arbitraryParameters(
            arbitraryBirthdate(),
            arbitraryToday({
              min: (birthdate) => subWeeks(birthdate, 10),
              max: (birthdate) => subDays(birthdate, 1),
            }),
          ),
          ({ birthdate, today }) => {
            vi.mocked(setTrackingVariable).mockReset();
            vi.setSystemTime(today);

            trackNutzergruppe(birthdate);

            expect(setTrackingVariable).toHaveBeenCalledWith(
              expect.anything(),
              "werdende Eltern (Phase 2)",
            );
          },
        ),
      );
    });

    it("Nutzergruppe is 'junge Eltern' if today is between the date of birth and three months after", () => {
      assert(
        property(
          arbitraryParameters(
            arbitraryBirthdate(),
            arbitraryToday({
              min: (birthdate) => birthdate,
              max: (birthdate) => subDays(addMonths(birthdate, 3), 1),
            }),
          ),
          ({ birthdate, today }) => {
            vi.mocked(setTrackingVariable).mockReset();
            vi.setSystemTime(today);

            trackNutzergruppe(birthdate);

            expect(setTrackingVariable).toHaveBeenCalledWith(
              expect.anything(),
              "junge Eltern",
            );
          },
        ),
      );
    });

    it("Nutzergruppe is 'nachbeantragende Eltern' if today is later than three months after birth", () => {
      assert(
        property(
          arbitraryParameters(
            arbitraryBirthdate(),
            arbitraryToday({
              min: (birthdate) => addMonths(birthdate, 3),
            }),
          ),
          ({ birthdate, today }) => {
            vi.mocked(setTrackingVariable).mockReset();
            vi.setSystemTime(today);

            trackNutzergruppe(birthdate);

            expect(setTrackingVariable).toHaveBeenCalledWith(
              expect.anything(),
              "nachbeantragende Eltern",
            );
          },
        ),
      );
    });

    /**
     * Produce arbitrary test parameters by providing a readable interface that
     * supports multiple parameter to depend on each other. I.e. the arbitrarily
     * sample birth date is passed into the generation of the date for today.
     */
    function arbitraryParameters(
      birthdate: Arbitrary<Date>,
      today: ArbitraryRelativeDate,
    ): Arbitrary<{ birthdate: Date; today: Date }> {
      return birthdate.chain((birthdate) =>
        today(birthdate).map((today) => ({ birthdate, today })),
      );
    }

    function arbitraryToday(constraints?: {
      min?: (birthdate: Date) => Date;
      max?: (birthdate: Date) => Date;
    }): ArbitraryRelativeDate {
      return (birthdate: Date) =>
        arbitraryDate({
          min: constraints?.min?.(birthdate),
          max: constraints?.max?.(birthdate),
        });
    }

    type ArbitraryRelativeDate = (date: Date) => Arbitrary<Date>;

    /**
     * Wrapper around {@link arbitraryDate} to ensure usable dates are produced.
     * Like no invalid dates and dates in a range that allow arithmetic
     * operations. For example if the latest date technically representable is
     * generated, it would no more be possible to subtract any time span from
     * it.
     */
    function arbitraryBirthdate(constraints?: { min?: Date; max?: Date }) {
      return arbitraryDate({
        min: constraints?.min ?? new Date("2020-01-01"),
        max: constraints?.max ?? new Date("2050-01-01"),
        noInvalidDate: true,
      });
    }
  });
}
