import { listeLebensmonateAuf } from "./listeLebensmonateAuf";
import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import type { Elternteil } from "@/features/planer/domain/Elternteil";
import type { Lebensmonate } from "@/features/planer/domain/lebensmonate/Lebensmonate";
import { zaehleVerplantesKontingent as zaehleVerplantesKontingentImLebensmonat } from "@/features/planer/domain/lebensmonat";
import {
  VerplantesKontingent,
  addiere,
} from "@/features/planer/domain/verplantes-kontingent";

export function zaehleVerplantesKontingent<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
): VerplantesKontingent {
  return addiere(
    ...listeLebensmonateAuf(lebensmonate)
      .map(([, lebensmonat]) => lebensmonat)
      .map(zaehleVerplantesKontingentImLebensmonat),
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("zähle verplantes Kontingent in allen Lebensmonaten", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { KeinElterngeld } = await import(
      "@/features/planer/domain/Auswahloption"
    );

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

    const monat = function (gewaehlteOption: Auswahloption) {
      return { gewaehlteOption, imMutterschutz: false as const };
    };
  });
}
