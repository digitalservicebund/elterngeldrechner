import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import { Specification } from "@/features/planer/domain/common/specification";
import { LebensmonateMitBeliebigenElternteilen } from "@/features/planer/domain/lebensmonate/Lebensmonate";
import { HatIrgendeineVarianteGewaehlt } from "@/features/planer/domain/monat";

export const MindestensEinMonatWurdeGewaehlt =
  Specification.fromPredicate<LebensmonateMitBeliebigenElternteilen>(
    "Bitte beachten Sie: Aktuell ist im Planer keine Auswahl getroffen. Bitte wählen Sie zunächst Ihre Monate mit Elterngeld aus, bevor Sie zur Zusammenfassung fortfahren.",
    (lebensmonate) =>
      Object.values(lebensmonate)
        .flatMap(Object.values)
        .some(HatIrgendeineVarianteGewaehlt.asPredicate),
  );

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("mindestens ein Monat wurde gewählt", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { KeinElterngeld } = await import(
      "@/features/planer/domain/Auswahloption"
    );
    const { MONAT_MIT_MUTTERSCHUTZ } = await import(
      "@/features/planer/domain/monat/Monat"
    );

    it("is unsatisfied for empty Lebensmonate", () => {
      const lebensmonate = {};

      expect(MindestensEinMonatWurdeGewaehlt.asPredicate(lebensmonate)).toBe(
        false,
      );
    });

    it("is unsatisfied if Lebensmonate only have no selection or Kein Elterngeld", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(undefined),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
      };

      expect(MindestensEinMonatWurdeGewaehlt.asPredicate(lebensmonate)).toBe(
        false,
      );
    });

    it("is satisfied if any Lebensmonat has an Option chosen", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Plus),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
      };

      expect(MindestensEinMonatWurdeGewaehlt.asPredicate(lebensmonate)).toBe(
        true,
      );
    });

    it("is satisfied if an Elternteil has Monat mit Mutterschutz", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(undefined),
          [Elternteil.Zwei]: MONAT_MIT_MUTTERSCHUTZ,
        },
      };

      expect(MindestensEinMonatWurdeGewaehlt.asPredicate(lebensmonate)).toBe(
        true,
      );
    });

    function monat(gewaehlteOption: Auswahloption | undefined) {
      return { gewaehlteOption, imMutterschutz: false as const };
    }
  });
}
