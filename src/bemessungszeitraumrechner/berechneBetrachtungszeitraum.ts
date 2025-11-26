import { Betrachtungszeitraum } from "./Betrachtungszeitraum";

/**
 * Berechnet die Teile des Betrachtungszeitraums welche relevant sind um, anhand der Erwerbstaetugkeit
 * und der Ausklammerungen, den genauen Bemessungszeitraum zu bestimmen.
 *
 * @param {Date} geburtsdatum Das Geburtsdatum des Kindes.
 * @returns {Betrachtungszeitraum} Ein Array, das den Betrachtungszeitraum für Selbstständige (Vorjahr)
 * und für Nicht-Selbstständige (Januar bis Geburt bzw. Monat vor Geburt) enthält.
 */
export function berechneBetrachtungszeitraum(
  geburtsdatum: Date,
): Betrachtungszeitraum {
  return [
    {
      von: new Date(Date.UTC(geburtsdatum.getFullYear() - 1, 0, 1)),
      bis: new Date(Date.UTC(geburtsdatum.getFullYear(), 0, 0)),
    },
    {
      von: new Date(Date.UTC(geburtsdatum.getFullYear(), 0, 1)),
      bis: geburtsdatum,
    },
  ];
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("berechneBetrachtumgszeitraum", () => {
    it("includes the correct betrachtungszeitraum for selbststaendige", () => {
      const geburtsdatum = new Date("2025-10-15T00:00:00.000Z");

      const betrachtungszeitraum = berechneBetrachtungszeitraum(geburtsdatum);
      const [betrachtungszeitraumSelbstaendig] = betrachtungszeitraum;

      expect(betrachtungszeitraumSelbstaendig).toEqual({
        von: new Date("2024-01-01T00:00:00.000Z"),
        bis: new Date("2024-12-31T00:00:00.000Z"),
      });
    });

    it("includes the correct betrachtungszeitraum for nicht-selbststaendige", () => {
      const geburtsdatum = new Date("2025-10-15T00:00:00.000Z");

      const betrachtungszeitraum = berechneBetrachtungszeitraum(geburtsdatum);

      const [, betrachtungszeitraumNichtSelbstaendig] = betrachtungszeitraum;

      expect(betrachtungszeitraumNichtSelbstaendig).toEqual({
        von: new Date("2025-01-01T00:00:00.000Z"),
        bis: new Date("2025-10-15T00:00:00.000Z"),
      });
    });
  });
}
