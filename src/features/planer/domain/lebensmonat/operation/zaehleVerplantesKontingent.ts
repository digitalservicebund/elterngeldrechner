import { listeMonateAuf } from "./listeMonateAuf";
import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import type { Elternteil } from "@/features/planer/domain/Elternteil";
import { Variante } from "@/features/planer/domain/Variante";
import type { Lebensmonat } from "@/features/planer/domain/lebensmonat/Lebensmonat";
import { zaehleVerplantesKontingent as zaehleVerplantesKontingentInMonat } from "@/features/planer/domain/monat";
import {
  VerplantesKontingent,
  addiere,
} from "@/features/planer/domain/verplantes-kontingent";

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

  const kontingent = addiere(...kontingentProMonat);

  // Bonus is counted special by the whole Lebensmonat counting as zero or one.
  return kontingent[Variante.Bonus] > 0
    ? { ...kontingent, [Variante.Bonus]: 1 }
    : kontingent;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("zähle verplantes Kontingent im Lebensmonat", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { KeinElterngeld } = await import(
      "@/features/planer/domain/Auswahloption"
    );

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

    it("ceils the Partnerschaftsbonus of all Elternteile to one", () => {
      const lebensmonat = {
        [Elternteil.Eins]: monat(Variante.Bonus),
        [Elternteil.Zwei]: monat(Variante.Bonus),
      };

      const kontingent = zaehleVerplantesKontingent(lebensmonat);

      expect(kontingent[Variante.Bonus]).toBe(1);
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
