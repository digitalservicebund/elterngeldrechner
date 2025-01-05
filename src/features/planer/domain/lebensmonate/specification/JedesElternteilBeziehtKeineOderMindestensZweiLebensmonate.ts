import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import type { Elternteil } from "@/features/planer/domain/Elternteil";
import { Variante } from "@/features/planer/domain/Variante";
import { Specification } from "@/features/planer/domain/common/specification";
import { LebensmonateMitBeliebigenElternteilen } from "@/features/planer/domain/lebensmonate/Lebensmonate";
import {
  HatIrgendeineVarianteGewaehlt,
  type Monat,
} from "@/features/planer/domain/monat";

export const JedesElternteilBeziehtKeineOderMindestensZweiLebensmonate =
  Specification.fromPredicate<LebensmonateMitBeliebigenElternteilen>(
    "Bitte beachten Sie: Aktuell ist die Planung nicht vollständig. Nur einen Monat auszuwählen ist nicht zulässig. Der Elternteil, der sich für Elterngeld entscheidet, muss mindestens zwei Monate Elterngeld auswählen.",
    (lebensmonate) => {
      const monateProElternteil = Object.values(lebensmonate)
        .flatMap(
          (lebensmonat) => Object.entries(lebensmonat) as [Elternteil, Monat][],
        )
        .reduce<MonateProElternteil>(
          (monateProElternteil, [elternteil, monat]) => ({
            ...monateProElternteil,
            [elternteil]: [...(monateProElternteil[elternteil] ?? []), monat],
          }),
          {},
        );

      return Object.values(monateProElternteil).every(
        (monate) =>
          monate.filter(HatIrgendeineVarianteGewaehlt.asPredicate).length !== 1,
      );
    },
  );

type MonateProElternteil = Partial<Record<Elternteil, Monat[]>>;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("jedes Elternteil bezieht keine oder mindestens zwei Lebensmonate", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { KeinElterngeld } = await import(
      "@/features/planer/domain/Auswahloption"
    );

    it("is satisfied for empty Lebensmonate", () => {
      const lebensmonate = {};

      expect(
        JedesElternteilBeziehtKeineOderMindestensZweiLebensmonate.asPredicate(
          lebensmonate,
        ),
      ).toBe(true);
    });

    it("is unsatisfied if any of the  Elternteile chose a single Monat only", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Plus),
        },
        5: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
      };

      expect(
        JedesElternteilBeziehtKeineOderMindestensZweiLebensmonate.asPredicate(
          lebensmonate,
        ),
      ).toBe(false);
    });

    it("is unsatisfied if all Elternteile chose a single Monat only", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Plus),
        },
        5: {
          [Elternteil.Eins]: monat(KeinElterngeld),
          [Elternteil.Zwei]: monat(undefined),
        },
      };

      expect(
        JedesElternteilBeziehtKeineOderMindestensZweiLebensmonate.asPredicate(
          lebensmonate,
        ),
      ).toBe(false);
    });

    it("is satisfied if one Elternteil chose at least two Monate and the other none", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(KeinElterngeld),
          [Elternteil.Zwei]: monat(Variante.Basis),
        },
        5: {
          [Elternteil.Eins]: monat(KeinElterngeld),
          [Elternteil.Zwei]: monat(Variante.Basis),
        },
      };

      expect(
        JedesElternteilBeziehtKeineOderMindestensZweiLebensmonate.asPredicate(
          lebensmonate,
        ),
      ).toBe(true);
    });

    it("is satisfied if all Elternteile chose at least two Monate", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Plus),
        },
        5: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
        6: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
      };

      expect(
        JedesElternteilBeziehtKeineOderMindestensZweiLebensmonate.asPredicate(
          lebensmonate,
        ),
      ).toBe(true);
    });

    function monat(gewaehlteOption: Auswahloption | undefined) {
      return { gewaehlteOption, imMutterschutz: false as const };
    }
  });
}
