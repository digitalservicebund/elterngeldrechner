import { listeMonateAuf } from "./listeMonateAuf";
import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import type { Elternteil } from "@/monatsplaner/Elternteil";
import type { Lebensmonat } from "@/monatsplaner/Lebensmonat";
import { zaehleVerplantesKontingent as zaehleVerplantesKontingentInMonat } from "@/monatsplaner/Monat";
import {
  VerplantesKontingent,
  addiere,
} from "@/monatsplaner/VerplantesKontingent";

export function zaehleVerplantesKontingent<E extends Elternteil>(
  lebensmonat: Lebensmonat<E>,
  elternteil?: E,
): VerplantesKontingent {
  const kontingentProMonat = listeMonateAuf(lebensmonat)
    .filter(
      ([elternteilOfMonat]) =>
        elternteil === undefined || elternteil === elternteilOfMonat,
    )
    .map(([, monat]) => monat)
    .map(zaehleVerplantesKontingentInMonat);

  return addiere(...kontingentProMonat);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("zähle verplantes Kontingent im Lebensmonat", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");
    const { KeinElterngeld } = await import("@/monatsplaner/Auswahloption");

    it("sums up the Kontingent of all Elternteile", () => {
      const lebensmonat = {
        [Elternteil.Eins]: monat(Variante.Basis),
        [Elternteil.Zwei]: monat(Variante.Plus),
      };

      const kontingent = zaehleVerplantesKontingent(lebensmonat);

      expect(kontingent[Variante.Basis]).toBe(1.5);
      expect(kontingent[Variante.Plus]).toBe(3);
      expect(kontingent[Variante.Bonus]).toBe(0);
      expect(kontingent[KeinElterngeld]).toBe(0);
    });

    it("each month of the Partnerschaftsbonus is counted as one for each Elternteil", () => {
      const lebensmonat = {
        [Elternteil.Eins]: monat(Variante.Bonus),
        [Elternteil.Zwei]: monat(Variante.Bonus),
      };

      const kontingent = zaehleVerplantesKontingent(lebensmonat);

      expect(kontingent[Variante.Bonus]).toBe(2);
    });

    it("sums up only the Kontingent for the given Elternteil", () => {
      const lebensmonat = {
        [Elternteil.Eins]: monat(Variante.Basis),
        [Elternteil.Zwei]: monat(Variante.Basis),
      };

      const kontingent = zaehleVerplantesKontingent(
        lebensmonat,
        Elternteil.Eins,
      );

      expect(kontingent[Variante.Basis]).toBe(1);
      expect(kontingent[Variante.Plus]).toBe(2);
    });

    const monat = function (gewaehlteOption: Auswahloption) {
      return { gewaehlteOption, imMutterschutz: false as const };
    };
  });
}
