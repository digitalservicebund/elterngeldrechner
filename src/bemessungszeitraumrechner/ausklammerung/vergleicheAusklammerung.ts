import { Ausklammerung } from "./Ausklammerung";

export function istAusklammerungInMonat(
  monat: Date,
  ausklammerungen: readonly Ausklammerung[],
): boolean {
  return ausklammerungen.some((ausklammerung) => {
    return (
      ausklammerung.von < naechsterMonat(monat) && ausklammerung.bis >= monat
    );
  });
}

function naechsterMonat(datum: Date): Date {
  const naechstesDatum = new Date(datum);
  naechstesDatum.setUTCMonth(naechstesDatum.getUTCMonth() + 1);
  return naechstesDatum;
}

export function findeJahrOhneAusklammerung(
  startDatum: Date,
  ausklammerungen: readonly Ausklammerung[],
): Date {
  const sortierteAusklammerungen = [...ausklammerungen].sort(
    (a, b) => b.bis.getTime() - a.bis.getTime(),
  );

  return findeJahrOhneAusklammerungRekursiv(
    startDatum.getUTCFullYear(),
    sortierteAusklammerungen,
  );
}

function findeJahrOhneAusklammerungRekursiv(
  aktuellesJahr: number,
  ausklammerungen: readonly Ausklammerung[],
): Date {
  if (ausklammerungen.length === 0) {
    return new Date(Date.UTC(aktuellesJahr, 0, 1));
  }

  const [naechsteAusklammerung, ...restlicheAusklammerungen] = ausklammerungen;

  const endeNaechsteAusklammerung = naechsteAusklammerung!.bis;
  const startNaechsteAusklammerung = naechsteAusklammerung!.von;

  if (aktuellesJahr > endeNaechsteAusklammerung.getUTCFullYear()) {
    return new Date(Date.UTC(aktuellesJahr, 0, 1));
  }

  if (aktuellesJahr >= startNaechsteAusklammerung.getUTCFullYear()) {
    return findeJahrOhneAusklammerungRekursiv(
      startNaechsteAusklammerung.getUTCFullYear() - 1,
      restlicheAusklammerungen,
    );
  }

  return findeJahrOhneAusklammerungRekursiv(
    aktuellesJahr,
    restlicheAusklammerungen,
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("istAusklammerungInMonat", () => {
    const ausklammerungen: Ausklammerung[] = [
      {
        von: new Date("2023-07-15T00:00:00.000Z"),
        bis: new Date("2023-07-31T00:00:00.000Z"),
        beschreibung: "Test",
      },
    ];

    it("soll true zurückgeben, wenn eine Ausklammerung im Monat liegt", () => {
      const monat = new Date("2023-07-01T00:00:00.000Z");

      expect(istAusklammerungInMonat(monat, ausklammerungen)).toBe(true);
    });

    it("soll false zurückgeben, wenn keine Ausklammerung im Monat liegt", () => {
      const monat = new Date("2023-08-01T00:00:00.000Z");

      expect(istAusklammerungInMonat(monat, ausklammerungen)).toBe(false);
    });
  });

  describe("findeJahrOhneAusklammerung", () => {
    const ausklammerungen: Ausklammerung[] = [
      {
        von: new Date("2023-01-01T00:00:00.000Z"),
        bis: new Date("2023-12-31T00:00:00.000Z"),
        beschreibung: "Ganzes Jahr",
      },
    ];

    it("soll das gegebene Jahr zurückgeben, wenn keine Ausklammerung vorliegt", () => {
      const jahr = new Date("2024-01-01T00:00:00.000Z");

      const result = findeJahrOhneAusklammerung(jahr, ausklammerungen);

      expect(result.getUTCFullYear()).toBe(2024);
    });

    it("soll das vorherige Jahr finden, wenn das aktuelle eine Ausklammerung hat", () => {
      const jahr = new Date("2023-01-01T00:00:00.000Z");

      const result = findeJahrOhneAusklammerung(jahr, ausklammerungen);

      expect(result.getUTCFullYear()).toBe(2022);
    });

    it("soll rekursiv nach dem vorherigen Jahr suchen", () => {
      const ausklammerungenMehrereJahre: Ausklammerung[] = [
        {
          von: new Date("2023-01-01T00:00:00.000Z"),
          bis: new Date("2023-12-31T00:00:00.000Z"),
          beschreibung: "2023",
        },
        {
          von: new Date("2022-01-01T00:00:00.000Z"),
          bis: new Date("2022-12-31T00:00:00.000Z"),
          beschreibung: "2022",
        },
      ];

      const jahr = new Date("2023-01-01T00:00:00.000Z");

      const result = findeJahrOhneAusklammerung(
        jahr,
        ausklammerungenMehrereJahre,
      );

      expect(result.getUTCFullYear()).toBe(2021);
    });
  });
}
