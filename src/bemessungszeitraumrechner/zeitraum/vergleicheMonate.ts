import { naechsterMonat } from "./manipuliereMonat";

export function istMonatFolgend(vormonat: Date, folgemonat: Date): boolean {
  return naechsterMonat(vormonat).getTime() === folgemonat.getTime();
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("istMonatFolgend", () => {
    it("soll true zurückgeben, wenn der zweite Monat direkt auf den ersten folgt", () => {
      const ersterMonat = new Date("2024-01-01T00:00:00.000Z");
      const zweiterMonat = new Date("2024-02-01T00:00:00.000Z");
      expect(istMonatFolgend(ersterMonat, zweiterMonat)).toBe(true);
    });

    it("soll true zurückgeben, wenn der zweite Monat direkt auf den ersten folgt und über die Jahresgrenze geht", () => {
      const ersterMonat = new Date("2024-12-01T00:00:00.000Z");
      const zweiterMonat = new Date("2025-01-01T00:00:00.000Z");
      expect(istMonatFolgend(ersterMonat, zweiterMonat)).toBe(true);
    });

    it("soll false zurückgeben, wenn der zweite Monat nicht direkt auf den ersten folgt (gleicher Monat)", () => {
      const ersterMonat = new Date("2024-01-01T00:00:00.000Z");
      const zweiterMonat = new Date("2024-01-01T00:00:00.000Z");
      expect(istMonatFolgend(ersterMonat, zweiterMonat)).toBe(false);
    });

    it("soll false zurückgeben, wenn der zweite Monat nicht direkt auf den ersten folgt (Monat davor)", () => {
      const ersterMonat = new Date("2024-02-01T00:00:00.000Z");
      const zweiterMonat = new Date("2024-01-01T00:00:00.000Z");
      expect(istMonatFolgend(ersterMonat, zweiterMonat)).toBe(false);
    });

    it("soll false zurückgeben, wenn der zweite Monat nicht direkt auf den ersten folgt (zwei Monate später)", () => {
      const ersterMonat = new Date("2024-01-01T00:00:00.000Z");
      const zweiterMonat = new Date("2024-03-01T00:00:00.000Z");
      expect(istMonatFolgend(ersterMonat, zweiterMonat)).toBe(false);
    });
  });
}
