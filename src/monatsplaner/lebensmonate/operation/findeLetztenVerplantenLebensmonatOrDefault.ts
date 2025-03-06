import {
  type Auswahloption,
  Elternteil,
  KeinElterngeld,
  LebensmonateMitBeliebigenElternteilen,
  Variante,
} from "@/monatsplaner";
import { isLebensmonatszahl } from "@/monatsplaner/Lebensmonatszahl";
import { getRecordEntriesWithIntegerKeys } from "@/monatsplaner/common/type-safe-records";

export function findeLetztenVerplantenLebensmonatOrDefault(
  lebensmonate: LebensmonateMitBeliebigenElternteilen,
  defaultValue: number = 0,
): number {
  const entriesWithIntegerKeys = getRecordEntriesWithIntegerKeys(
    lebensmonate,
    isLebensmonatszahl,
  );

  const monate = entriesWithIntegerKeys
    .filter(([, monat]) => monat != undefined)
    .map(([monatszahl]) => monatszahl);

  return Math.max(...monate, defaultValue);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeLetztenVerplantenLebensmonatOrDefault", () => {
    it("finds the last month", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Plus),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
      };

      const result = findeLetztenVerplantenLebensmonatOrDefault(lebensmonate);

      expect(result).toEqual(2);
    });

    it("finds the last month even with gaps", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Plus),
        },
        5: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
      };

      const result = findeLetztenVerplantenLebensmonatOrDefault(lebensmonate);

      expect(result).toEqual(5);
    });

    it("uses default value if months are absent", () => {
      const lebensmonate = {};

      const result = findeLetztenVerplantenLebensmonatOrDefault(lebensmonate);

      expect(result).toEqual(0);
    });

    const monat = function (gewaehlteOption: Auswahloption) {
      return { gewaehlteOption, imMutterschutz: false as const };
    };
  });
}
