import { Specification } from "@/features/planer/domain/common/specification";
import { MindestensEinElternteilHatEineOptionGewaehlt } from "@/features/planer/domain/lebensmonat/specification/MindestensEinElternteilHatOptionGewaehlt";
import type { LebensmonateMitBeliebigenElternteilen } from "@/features/planer/domain/lebensmonate/Lebensmonate";

export const FortlaufenderBezugNachDemVierzehntenLebensmonat =
  Specification.fromPredicate<LebensmonateMitBeliebigenElternteilen>(
    "Nach dem 14. Lebensmonat muss Elterngeld fortlaufend und ohne Unterbrechung bezogen werden.",
    (lebensmonate) => {
      const lebensmonatszahlen = Object.entries(lebensmonate)
        .filter(([, lebensmonat]) =>
          MindestensEinElternteilHatEineOptionGewaehlt.asPredicate(lebensmonat),
        )
        .map(([lebensmonatszahl]) => Number.parseInt(lebensmonatszahl)) // TODO: use enumeration method in first place
        .filter((lebensmonatszahl) => lebensmonatszahl > 14)
        .sort((left, right) => left - right);

      return (
        lebensmonatszahlen.length === 0 ||
        (lebensmonatszahlen[0] === 15 &&
          isSequenceIncreasingByOne(lebensmonatszahlen))
      );
    },
  );

function isSequenceIncreasingByOne(numbers: number[]): boolean {
  return numbers.every(
    (entry, index) => index === 0 || entry === numbers[index - 1] + 1,
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("fortlaufender Bezug ab dem 12. Lebensmonat", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { KeinElterngeld } = await import(
      "@/features/planer/domain/Auswahloption"
    );

    it("is satisfied if it is not fortlaufend before the 14th Lebensmonat", () => {
      const lebensmonate = {
        1: LEBENSMONAT_MIT_BEZUG,
        2: LEBENSMONAT_OHNE_BEZUG,
        5: LEBENSMONAT_MIT_BEZUG,
      };

      expect(
        FortlaufenderBezugNachDemVierzehntenLebensmonat.asPredicate(
          lebensmonate,
        ),
      ).toBe(true);
    });

    it("is unsatisfied if a Lebensmonat is skipped after the 14th", () => {
      const lebensmonate = {
        15: LEBENSMONAT_MIT_BEZUG,
        17: LEBENSMONAT_MIT_BEZUG,
      };

      expect(
        FortlaufenderBezugNachDemVierzehntenLebensmonat.asPredicate(
          lebensmonate,
        ),
      ).toBe(false);
    });

    it("is satisfied if Bezug is fortlaufend after the 14th Lebensmonat", () => {
      const lebensmonate = {
        15: LEBENSMONAT_MIT_BEZUG,
        16: LEBENSMONAT_MIT_BEZUG,
        17: LEBENSMONAT_MIT_BEZUG,
      };

      expect(
        FortlaufenderBezugNachDemVierzehntenLebensmonat.asPredicate(
          lebensmonate,
        ),
      ).toBe(true);
    });

    it("is unsatisfied if any Lebensmonate after the 14th are without an Option", () => {
      const lebensmonate = {
        15: LEBENSMONAT_MIT_BEZUG,
        16: LEBENSMONAT_OHNE_BEZUG,
        17: LEBENSMONAT_MIT_BEZUG,
      };

      expect(
        FortlaufenderBezugNachDemVierzehntenLebensmonat.asPredicate(
          lebensmonate,
        ),
      ).toBe(false);
    });

    const LEBENSMONAT_OHNE_BEZUG = {
      [Elternteil.Eins]: {
        gewaehlteOption: undefined,
        imMutterschutz: false as const,
      },
      [Elternteil.Zwei]: {
        gewaehlteOption: KeinElterngeld,
        imMutterschutz: false as const,
      },
    };

    const LEBENSMONAT_MIT_BEZUG = {
      [Elternteil.Eins]: {
        gewaehlteOption: Variante.Plus,
        imMutterschutz: false as const,
      },
      [Elternteil.Zwei]: {
        gewaehlteOption: KeinElterngeld,
        imMutterschutz: false as const,
      },
    };
  });
}
