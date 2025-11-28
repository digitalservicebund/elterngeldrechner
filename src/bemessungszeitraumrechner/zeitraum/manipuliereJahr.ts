export function vorherigesJahr(datum: Date): Date {
  const naechstesDatum = new Date(datum);
  naechstesDatum.setUTCFullYear(naechstesDatum.getUTCFullYear() - 1);
  return naechstesDatum;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("vorherigesJahr", () => {
    it("soll das Datum auf das vorherige Jahr setzen", () => {
      const datum = new Date("2024-03-31T00:00:00.000Z");
      const vorherigesJahrDatum = vorherigesJahr(datum);
      expect(vorherigesJahrDatum.getUTCFullYear()).toBe(2023);
      expect(vorherigesJahrDatum.getUTCMonth()).toBe(2); // March
      expect(vorherigesJahrDatum.getUTCDate()).toBe(31);
    });
  });
}
