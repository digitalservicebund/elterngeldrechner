import { listeLebensmonateAuf } from "./listeLebensmonateAuf";
import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import type { Elternteil } from "@/monatsplaner/Elternteil";
import { zaehleVerplantesKontingent as zaehleVerplantesKontingentImLebensmonat } from "@/monatsplaner/lebensmonat";
import type { Lebensmonate } from "@/monatsplaner/lebensmonate/Lebensmonate";
import {
  VerplantesKontingent,
  addiere,
} from "@/monatsplaner/verplantes-kontingent";

export function zaehleVerplantesKontingent<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
  elternteil?: E,
): VerplantesKontingent {
  return addiere(
    ...listeLebensmonateAuf(lebensmonate)
      .map(([, lebensmonat]) => lebensmonat)
      .map((lebensmonat) =>
        zaehleVerplantesKontingentImLebensmonat(lebensmonat, elternteil),
      ),
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("zähle verplantes Kontingent in allen Lebensmonaten", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");
    const { KeinElterngeld } = await import("@/monatsplaner/Auswahloption");

    it("sums up the Kontingent of all Lebensmonate", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Plus),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        3: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
        4: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
      };

      const kontingent = zaehleVerplantesKontingent(lebensmonate);

      expect(kontingent[Variante.Basis]).toBe(2.5);
      expect(kontingent[Variante.Plus]).toBe(5);
      expect(kontingent[Variante.Bonus]).toBe(2);
      expect(kontingent[KeinElterngeld]).toBe(1);
    });

    it("sums up the Kontingent for given Elternteil only", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Plus),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        3: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
        4: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
      };

      const kontingent = zaehleVerplantesKontingent(
        lebensmonate,
        Elternteil.Zwei,
      );

      expect(kontingent[Variante.Basis]).toBe(0.5);
      expect(kontingent[Variante.Plus]).toBe(1);
      expect(kontingent[Variante.Bonus]).toBe(2);
      expect(kontingent[KeinElterngeld]).toBe(1);
    });

    const monat = function (gewaehlteOption: Auswahloption) {
      return { gewaehlteOption, imMutterschutz: false as const };
    };
  });
}
