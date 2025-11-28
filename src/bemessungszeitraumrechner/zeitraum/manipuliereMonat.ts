export function naechsterMonat(datum: Date): Date {
  const naechstesDatum = new Date(datum);
  naechstesDatum.setUTCMonth(naechstesDatum.getUTCMonth() + 1);
  return naechstesDatum;
}

export function vorherigerMonat(datum: Date): Date {
  const naechstesDatum = new Date(datum);
  naechstesDatum.setUTCMonth(naechstesDatum.getUTCMonth() - 1);
  return naechstesDatum;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("naechsterMonat", () => {
    it("soll das Datum auf den nächsten Monat setzen (Normalfall)", () => {
      const datum = new Date("2024-03-15T00:00:00.000Z");
      const naechsterMonatDatum = naechsterMonat(datum);
      expect(naechsterMonatDatum.getUTCFullYear()).toBe(2024);
      expect(naechsterMonatDatum.getUTCMonth()).toBe(3);
      expect(naechsterMonatDatum.getUTCDate()).toBe(15);
    });

    it("soll das Datum auf den nächsten Monat setzen (Monat mit weniger Tagen - Roll Over)", () => {
      const datum = new Date("2024-03-31T00:00:00.000Z");
      const naechsterMonatDatum = naechsterMonat(datum);
      expect(naechsterMonatDatum.getUTCFullYear()).toBe(2024);
      expect(naechsterMonatDatum.getUTCMonth()).toBe(4);
      expect(naechsterMonatDatum.getUTCDate()).toBe(1);
    });

    it("soll das Datum auf den nächsten Monat setzen (Jahreswechsel)", () => {
      const datum = new Date("2023-12-10T00:00:00.000Z");
      const naechsterMonatDatum = naechsterMonat(datum);
      expect(naechsterMonatDatum.getUTCFullYear()).toBe(2024);
      expect(naechsterMonatDatum.getUTCMonth()).toBe(0);
      expect(naechsterMonatDatum.getUTCDate()).toBe(10);
    });

    it("soll das Datum auf den nächsten Monat setzen (Jahreswechsel, Monat mit weniger Tagen - Roll Over)", () => {
      const datum = new Date("2023-12-31T00:00:00.000Z");
      const naechsterMonatDatum = naechsterMonat(datum);
      expect(naechsterMonatDatum.getUTCFullYear()).toBe(2024);
      expect(naechsterMonatDatum.getUTCMonth()).toBe(0);
      expect(naechsterMonatDatum.getUTCDate()).toBe(31);
    });
  });

  describe("vorherigerMonat", () => {
    it("soll das Datum auf den vorherigen Monat setzen (Normalfall)", () => {
      const datum = new Date("2024-03-15T00:00:00.000Z");
      const vorherigerMonatDatum = vorherigerMonat(datum);
      expect(vorherigerMonatDatum.getUTCFullYear()).toBe(2024);
      expect(vorherigerMonatDatum.getUTCMonth()).toBe(1);
      expect(vorherigerMonatDatum.getUTCDate()).toBe(15);
    });

    it("soll das Datum auf den vorherigen Monat setzen (Monat mit weniger Tagen - Roll Over)", () => {
      const datum = new Date("2024-03-31T00:00:00.000Z");
      const vorherigerMonatDatum = vorherigerMonat(datum);
      expect(vorherigerMonatDatum.getUTCFullYear()).toBe(2024);
      expect(vorherigerMonatDatum.getUTCMonth()).toBe(2);
      expect(vorherigerMonatDatum.getUTCDate()).toBe(2);
    });

    it("soll das Datum auf den vorherigen Monat setzen (Jahreswechsel)", () => {
      const datum = new Date("2024-01-10T00:00:00.000Z");
      const vorherigerMonatDatum = vorherigerMonat(datum);
      expect(vorherigerMonatDatum.getUTCFullYear()).toBe(2023);
      expect(vorherigerMonatDatum.getUTCMonth()).toBe(11);
      expect(vorherigerMonatDatum.getUTCDate()).toBe(10);
    });

    it("soll das Datum auf den vorherigen Monat setzen (Jahreswechsel, Monat mit weniger Tagen - Roll Over)", () => {
      const datum = new Date("2024-01-31T00:00:00.000Z");
      const vorherigerMonatDatum = vorherigerMonat(datum);
      expect(vorherigerMonatDatum.getUTCFullYear()).toBe(2023);
      expect(vorherigerMonatDatum.getUTCMonth()).toBe(11);
      expect(vorherigerMonatDatum.getUTCDate()).toBe(31);
    });
  });
}
