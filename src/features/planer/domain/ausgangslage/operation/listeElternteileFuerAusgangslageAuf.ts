import { Elternteil } from "@/features/planer/domain/Elternteil";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/features/planer/domain/ausgangslage/Ausgangslage";

export function listeElternteileFuerAusgangslageAuf<A extends Ausgangslage>(
  ausgangslage: A,
): ElternteileByAusgangslage<A>[] {
  switch (ausgangslage.anzahlElternteile) {
    case 1:
      return [Elternteil.Eins] as ElternteileByAusgangslage<A>[];
    case 2:
      return [
        Elternteil.Eins,
        Elternteil.Zwei,
      ] as ElternteileByAusgangslage<A>[];
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("liste Elternteil für Ausgangslage auf", () => {
    it("lists only Elternteil 1 for Ausgangslage with one Elternteil", () => {
      const ausgangslage = {
        anzahlElternteile: 1 as const,
        geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
      };

      const elternteile = listeElternteileFuerAusgangslageAuf(ausgangslage);

      expect(elternteile).toStrictEqual([Elternteil.Eins]);
    });

    it("lists Elternteil 1 and 2 in correct order for Ausgangslage with two Elternteile", () => {
      const ausgangslage = {
        anzahlElternteile: 2 as const,
        pseudonymeDerElternteile: ANY_PSEUDONYME_FOR_TWO_ELTERNTEILE,
        geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
      };

      const elternteile = listeElternteileFuerAusgangslageAuf(ausgangslage);

      expect(elternteile).toStrictEqual([Elternteil.Eins, Elternteil.Zwei]);
    });

    const ANY_GEBURTSDATUM_DES_KINDES = new Date();
    const ANY_PSEUDONYME_FOR_TWO_ELTERNTEILE = {
      [Elternteil.Eins]: "Jane",
      [Elternteil.Zwei]: "John",
    };
  });
}
