import { Temporal } from "@js-temporal/polyfill";

import type { Ausklammerung } from "./Ausklammerung";

/**
 * Prüft, ob eine Ausklammerung in einen gegebenen Monat fällt.
 * Eine Ausklammerung überlappt mit einem Monat, wenn:
 * - Die Ausklammerung vor dem Ende des Monats beginnt UND
 * - Die Ausklammerung nach dem Anfang des Monats endet
 */
export function istAusklammerungInMonat(
  monat: Temporal.PlainYearMonth,
  ausklammerungen: readonly Ausklammerung[],
): boolean {
  const monatStart = monat.toPlainDate({ day: 1 });
  const naechsterMonatStart = monat.add({ months: 1 }).toPlainDate({ day: 1 });

  return ausklammerungen.some((ausklammerung) => {
    return (
      Temporal.PlainDate.compare(ausklammerung.von, naechsterMonatStart) < 0 &&
      Temporal.PlainDate.compare(ausklammerung.bis, monatStart) >= 0
    );
  });
}

/**
 * Findet das erste Jahr ohne Ausklammerung, ausgehend von einem Startdatum.
 * Gibt den Januar dieses Jahres als PlainYearMonth zurück.
 */
export function findeJahrOhneAusklammerung(
  startMonat: Temporal.PlainYearMonth,
  ausklammerungen: readonly Ausklammerung[],
): Temporal.PlainYearMonth {
  const sortierteAusklammerungen = [...ausklammerungen].sort((a, b) =>
    Temporal.PlainDate.compare(b.bis, a.bis),
  );

  return findeJahrOhneAusklammerungRekursiv(
    startMonat.year,
    sortierteAusklammerungen,
  );
}

function findeJahrOhneAusklammerungRekursiv(
  aktuellesJahr: number,
  ausklammerungen: readonly Ausklammerung[],
): Temporal.PlainYearMonth {
  if (ausklammerungen.length === 0) {
    return Temporal.PlainYearMonth.from({ year: aktuellesJahr, month: 1 });
  }

  const [naechsteAusklammerung, ...restlicheAusklammerungen] = ausklammerungen;

  const endeNaechsteAusklammerung = naechsteAusklammerung!.bis;
  const startNaechsteAusklammerung = naechsteAusklammerung!.von;

  if (aktuellesJahr > endeNaechsteAusklammerung.year) {
    return Temporal.PlainYearMonth.from({ year: aktuellesJahr, month: 1 });
  }

  if (aktuellesJahr >= startNaechsteAusklammerung.year) {
    return findeJahrOhneAusklammerungRekursiv(
      startNaechsteAusklammerung.year - 1,
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
        von: Temporal.PlainDate.from({ year: 2023, month: 7, day: 15 }),
        bis: Temporal.PlainDate.from({ year: 2023, month: 7, day: 31 }),
        grund: "Test",
      },
    ];

    it("soll true zurückgeben, wenn eine Ausklammerung im Monat liegt", () => {
      const monat = Temporal.PlainYearMonth.from({ year: 2023, month: 7 });

      expect(istAusklammerungInMonat(monat, ausklammerungen)).toBe(true);
    });

    it("soll false zurückgeben, wenn keine Ausklammerung im Monat liegt", () => {
      const monat = Temporal.PlainYearMonth.from({ year: 2023, month: 8 });

      expect(istAusklammerungInMonat(monat, ausklammerungen)).toBe(false);
    });

    it("soll true zurückgeben, wenn eine Ausklammerung den Monatswechsel überlappt", () => {
      const monat = Temporal.PlainYearMonth.from({ year: 2023, month: 7 });

      // Ausklammerung beginnt kurz vor Monatsende Juli und endet im August
      const ausklammerungenMonatswechsel: Ausklammerung[] = [
        {
          von: Temporal.PlainDate.from({ year: 2023, month: 7, day: 31 }),
          bis: Temporal.PlainDate.from({ year: 2023, month: 8, day: 7 }),
          grund: "Test Monatswechsel",
        },
      ];

      expect(istAusklammerungInMonat(monat, ausklammerungenMonatswechsel)).toBe(
        true,
      );
    });
  });

  describe("findeJahrOhneAusklammerung", () => {
    const ausklammerungen: Ausklammerung[] = [
      {
        von: Temporal.PlainDate.from({ year: 2023, month: 1, day: 1 }),
        bis: Temporal.PlainDate.from({ year: 2023, month: 12, day: 31 }),
        grund: "Ganzes Jahr",
      },
    ];

    it("soll das gegebene Jahr zurückgeben, wenn keine Ausklammerung vorliegt", () => {
      const jahr = Temporal.PlainYearMonth.from({ year: 2024, month: 1 });

      const result = findeJahrOhneAusklammerung(jahr, ausklammerungen);

      expect(result.year).toBe(2024);
    });

    it("soll das vorherige Jahr finden, wenn das aktuelle eine Ausklammerung hat", () => {
      const jahr = Temporal.PlainYearMonth.from({ year: 2023, month: 1 });

      const result = findeJahrOhneAusklammerung(jahr, ausklammerungen);

      expect(result.year).toBe(2022);
    });

    it("soll rekursiv nach dem vorherigen Jahr suchen", () => {
      const ausklammerungenMehrereJahre: Ausklammerung[] = [
        {
          von: Temporal.PlainDate.from({ year: 2023, month: 1, day: 1 }),
          bis: Temporal.PlainDate.from({ year: 2023, month: 12, day: 31 }),
          grund: "2023",
        },
        {
          von: Temporal.PlainDate.from({ year: 2022, month: 1, day: 1 }),
          bis: Temporal.PlainDate.from({ year: 2022, month: 12, day: 31 }),
          grund: "2022",
        },
      ];

      const jahr = Temporal.PlainYearMonth.from({ year: 2023, month: 1 });

      const result = findeJahrOhneAusklammerung(
        jahr,
        ausklammerungenMehrereJahre,
      );

      expect(result.year).toBe(2021);
    });
  });
}
