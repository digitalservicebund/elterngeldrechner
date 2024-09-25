import { Specification } from "@/features/planer/domain/common/specification";
import { MindestensEinElternteilHatEineOptionGewaehlt } from "@/features/planer/domain/lebensmonat/specification/MindestensEinElternteilHatOptionGewaehlt";
import type { LebensmonateMitBeliebigenElternteilen } from "@/features/planer/domain/lebensmonate/Lebensmonate";

export const FortlaufenderBezugAbDemZwoelftenLebensmonat =
  Specification.fromPredicate<LebensmonateMitBeliebigenElternteilen>(
    "Elterngeld muss ab dem 12. Lebensmonat fortlaufend bezogen werden.",
    (lebensmonate) => {
      const lebensmonatszahlen = Object.entries(lebensmonate)
        .filter(([, lebensmonat]) =>
          MindestensEinElternteilHatEineOptionGewaehlt.asPredicate(lebensmonat),
        )
        .map(([lebensmonatszahl]) => Number.parseInt(lebensmonatszahl)) // TODO: use enumeration method in first place
        .filter((lebensmonatszahl) => lebensmonatszahl > 12)
        .sort((left, right) => left - right);

      return (
        lebensmonatszahlen.length === 0 ||
        (lebensmonatszahlen[0] === 13 &&
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

    it("is satisfied if it is not fortlaufend before the 12. Lebensmonat", () => {
      const lebensmonate = {
        1: LEBENSMONAT_MIT_BEZUG,
        2: LEBENSMONAT_OHNE_BEZUG,
        5: LEBENSMONAT_MIT_BEZUG,
      };

      expect(
        FortlaufenderBezugAbDemZwoelftenLebensmonat.asPredicate(lebensmonate),
      ).toBe(true);
    });

    it("is unsatisfied if a Lebensmonat is skipped after the 12th", () => {
      const lebensmonate = {
        12: LEBENSMONAT_MIT_BEZUG,
        13: LEBENSMONAT_MIT_BEZUG,
        15: LEBENSMONAT_MIT_BEZUG,
      };

      expect(
        FortlaufenderBezugAbDemZwoelftenLebensmonat.asPredicate(lebensmonate),
      ).toBe(false);
    });

    it("is satisfied if Bezug is fortlaufend after 12. Lebensmonat", () => {
      const lebensmonate = {
        12: LEBENSMONAT_MIT_BEZUG,
        13: LEBENSMONAT_MIT_BEZUG,
        14: LEBENSMONAT_MIT_BEZUG,
        15: LEBENSMONAT_MIT_BEZUG,
      };

      expect(
        FortlaufenderBezugAbDemZwoelftenLebensmonat.asPredicate(lebensmonate),
      ).toBe(true);
    });

    it("is unsatisfied if the first Lebensmonate after the 12th are skipped", () => {
      const lebensmonate = {
        13: LEBENSMONAT_OHNE_BEZUG,
        16: LEBENSMONAT_MIT_BEZUG,
        17: LEBENSMONAT_MIT_BEZUG,
      };

      expect(
        FortlaufenderBezugAbDemZwoelftenLebensmonat.asPredicate(lebensmonate),
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
        gewaehlteOption: Variante.Basis,
        imMutterschutz: false as const,
      },
      [Elternteil.Zwei]: {
        gewaehlteOption: KeinElterngeld,
        imMutterschutz: false as const,
      },
    };
  });
}
