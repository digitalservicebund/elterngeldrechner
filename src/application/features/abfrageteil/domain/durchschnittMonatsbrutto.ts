export function durchschnittMonatsbrutto(monatsbrutto: number[]): number {
  return monatsbrutto.reduce((acc, val) => acc + val, 0) / 12;
}

// basis-eg-algorithmus.ts rekonstruiert die Gesamtsumme je Tätigkeit als
// bruttoEinkommenDurchschnitt * anzahlBemessungszeitraumMonate (Anzahl der
// true-Einträge in bemessungsZeitraumMonate). Damit das die tatsächlich
// verdiente Summe ergibt, muss der Durchschnitt über die aktiven Monate
// gebildet werden, nicht über die festen 12 Monate des Bemessungszeitraums.
export function berechneDurchschnittMonatsbruttoProAktivemMonat(
  monatsbrutto: number[],
): number {
  const aktiveMonate = monatsbrutto.filter((brutto) => brutto > 0).length;

  if (aktiveMonate === 0) {
    return 0;
  }

  const summe = monatsbrutto.reduce((acc, brutto) => acc + brutto, 0);

  return summe / aktiveMonate;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("durchschnittMonatsbrutto", () => {
    it("berechnet den 12-Monats-Durchschnitt", () => {
      const monatsbrutto = [
        2000, 2000, 2000, 2000, 2000, 2000, 4000, 4000, 4000, 4000, 4000, 4000,
      ];

      expect(durchschnittMonatsbrutto(monatsbrutto)).toBe(3000);
    });
  });

  describe("berechneDurchschnittMonatsbruttoProAktivemMonat", () => {
    it("berechnet den Durchschnitt nur über die Monate mit Einkommen", () => {
      const monatsbrutto = [3000, 3000, 3000, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      expect(
        berechneDurchschnittMonatsbruttoProAktivemMonat(monatsbrutto),
      ).toBe(3000);
    });

    it("gibt 0 zurück, wenn kein Monat aktiv ist", () => {
      const monatsbrutto = new Array<number>(12).fill(0);

      expect(
        berechneDurchschnittMonatsbruttoProAktivemMonat(monatsbrutto),
      ).toBe(0);
    });
  });
}
