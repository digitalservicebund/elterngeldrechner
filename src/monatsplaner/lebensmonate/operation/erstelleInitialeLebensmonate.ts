import { Lebensmonatszahlen } from "@/monatsplaner/Lebensmonatszahl";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/monatsplaner/ausgangslage";
import { erstelleInitialenLebensmonat } from "@/monatsplaner/lebensmonat";
import type { Lebensmonate } from "@/monatsplaner/lebensmonate/Lebensmonate";

export function erstelleInitialeLebensmonate<A extends Ausgangslage>(
  ausgangslage: A,
): Lebensmonate<ElternteileByAusgangslage<A>> {
  const letzterLebensmonatMitSchutz =
    ausgangslage.informationenZumMutterschutz?.letzterLebensmonatMitSchutz ?? 0;

  const lebensmonatszahlenMitMutterschutz = Lebensmonatszahlen.filter(
    (lebensmonatszahl) => lebensmonatszahl <= letzterLebensmonatMitSchutz,
  );

  return Object.fromEntries(
    lebensmonatszahlenMitMutterschutz.map((lebensmonatszahl) => [
      lebensmonatszahl,
      erstelleInitialenLebensmonat(ausgangslage, lebensmonatszahl),
    ]),
  ) as Lebensmonate<ElternteileByAusgangslage<A>>;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("erstelle initiale Lebensmonate", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");

    it("creates no Lebensmonate if no Informationen zum Mutterschutz are configured", () => {
      const lebensmonate = erstelleInitialeLebensmonate({
        informationenZumMutterschutz: undefined,
        anzahlElternteile: 1,
        geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
      });

      expect(Object.entries(lebensmonate)).toHaveLength(0);
    });

    it("creates as many Lebensmonate as number of configured Mutterschutz Monate", () => {
      const lebensmonate = erstelleInitialeLebensmonate({
        informationenZumMutterschutz: {
          letzterLebensmonatMitSchutz: 3,
          empfaenger: Elternteil.Eins,
        },
        anzahlElternteile: 1,
        geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
      });

      expect(Object.entries(lebensmonate)).toHaveLength(3);
      // TODO: Resolve type issues of Object.keys (this should be numbers).
      expect(Object.keys(lebensmonate).sort()).toEqual(["1", "2", "3"].sort());
    });

    const ANY_GEBURTSDATUM_DES_KINDES = new Date();
  });
}
