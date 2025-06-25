import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import { LebensmonateMitBeliebigenElternteilen } from "@/monatsplaner/Lebensmonate";
import { HatIrgendeineVarianteGewaehlt } from "@/monatsplaner/Monat";
import { Specification } from "@/monatsplaner/common/specification";

export const MindestensEinMonatWurdeGewaehlt =
  Specification.fromPredicate<LebensmonateMitBeliebigenElternteilen>(
    "Aktuell ist im Planer keine Auswahl getroffen. Bitte wählen Sie zunächst Ihre Monate mit Elterngeld aus, bevor Sie zur Datenübernahme Antrag fortfahren.",
    (lebensmonate) =>
      Object.values(lebensmonate)
        .flatMap(Object.values)
        .some(HatIrgendeineVarianteGewaehlt.asPredicate),
  );

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("mindestens ein Monat wurde gewählt", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");
    const { KeinElterngeld } = await import("@/monatsplaner/Auswahloption");
    const { MONAT_MIT_MUTTERSCHUTZ } = await import("@/monatsplaner/Monat");

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
