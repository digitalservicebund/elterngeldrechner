import { Temporal } from "@js-temporal/polyfill";

import { berechneBetrachtungszeitraum } from "@/bemessungszeitraumrechner";

import type { Ausklammerung } from "@/bemessungszeitraumrechner";

/**
 * Erstaufruf: Sucht das jüngste Geschwisterkind, für das eine Ausklammerung
 * überhaupt noch in den Betrachtungszeitraum reichen könnte.
 */
export function findeJuengstesRelevantesGeschwisterkind(
  geschwisterkinder: Geschwisterkinder,
  geburtsdatum: Temporal.PlainDate,
  ausklammerungen: readonly Ausklammerung[],
): number | undefined {
  const betrachtungszeitraum = berechneBetrachtungszeitraum(
    geburtsdatum,
    ausklammerungen,
  );

  // prettier-ignore
  const sortierteGeschwisterkinder = sortiereNachGeburtsdatum(geschwisterkinder);
  const juengstesGeschwisterkind = sortierteGeschwisterkinder[0];

  if (!juengstesGeschwisterkind) return undefined;

  const istAusklammerungsrelevant = betrifftBetrachtungszeitraum(
    juengstesGeschwisterkind.geburtsdatum,
    ELTERNGELD_BEZUGSFENSTER,
    betrachtungszeitraum.von,
  );

  return istAusklammerungsrelevant
    ? juengstesGeschwisterkind.eingabeposition
    : undefined;
}

/**
 * Folgeaufruf: Sucht ausgehend von einem bereits abgefragten Geschwisterkind
 * das nächstältere, für das eine Ausklammerung noch relevant sein könnte.
 */
export function findeNaechstAelteresRelevantesGeschwisterkind(
  geschwisterkinder: Geschwisterkinder,
  geburtsdatum: Temporal.PlainDate,
  ausklammerungen: readonly Ausklammerung[],
  geschwisterIndex: number,
): number | undefined {
  const betrachtungszeitraum = berechneBetrachtungszeitraum(
    geburtsdatum,
    ausklammerungen,
  );

  // prettier-ignore
  const sortierteGeschwisterkinder = sortiereNachGeburtsdatum(geschwisterkinder);

  const position = sortierteGeschwisterkinder.findIndex(
    (geschwisterkind) => geschwisterkind.eingabeposition === geschwisterIndex,
  );

  // Ohne diesen Guard würde -1 + 1 = 0 das jüngste Geschwisterkind liefern.
  if (position === -1) return undefined;

  // prettier-ignore
  const naechstAelteresGeschwisterkind = sortierteGeschwisterkinder[position + 1];

  if (!naechstAelteresGeschwisterkind) return undefined;

  const istAusklammerungsrelevant = betrifftBetrachtungszeitraum(
    naechstAelteresGeschwisterkind.geburtsdatum,
    ELTERNGELD_BEZUGSFENSTER,
    betrachtungszeitraum.von,
  );

  return istAusklammerungsrelevant
    ? naechstAelteresGeschwisterkind.eingabeposition
    : undefined;
}

/**
 * Folgeaufruf im Elternzeit-Zweig: Für dasselbe Geschwisterkind kann noch ein
 * Mutterschutz abgefragt werden, dafür gilt aber die kürzere Mutterschutzfrist
 * statt des Elterngeld-Bezugsfensters. Trifft sie nicht mehr zu, gilt die
 * normale Regel für das nächstältere Geschwisterkind.
 */
export function findeRelevantesGeschwisterkindFuerMutterschutzAbfrage(
  geschwisterkinder: Geschwisterkinder,
  geburtsdatum: Temporal.PlainDate,
  ausklammerungen: readonly Ausklammerung[],
  geschwisterIndex: number,
): number | undefined {
  const betrachtungszeitraum = berechneBetrachtungszeitraum(
    geburtsdatum,
    ausklammerungen,
  );

  // prettier-ignore
  const sortierteGeschwisterkinder = sortiereNachGeburtsdatum(geschwisterkinder);

  const gleichesGeschwisterkind = sortierteGeschwisterkinder.find(
    (geschwisterkind) => geschwisterkind.eingabeposition === geschwisterIndex,
  );

  if (!gleichesGeschwisterkind) return undefined;

  const istAusklammerungsrelevant = betrifftBetrachtungszeitraum(
    gleichesGeschwisterkind.geburtsdatum,
    MUTTERSCHUTZFRIST,
    betrachtungszeitraum.von,
  );

  if (istAusklammerungsrelevant) {
    return gleichesGeschwisterkind.eingabeposition;
  }

  return findeNaechstAelteresRelevantesGeschwisterkind(
    geschwisterkinder,
    geburtsdatum,
    ausklammerungen,
    geschwisterIndex,
  );
}

/**
 * Fassade auf die alte Signatur, solange die Aufrufstellen noch nicht auf die
 * drei expliziten Funktionen umgestellt sind.
 */
export function berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerung(
  geburtsdatum: Temporal.PlainDate,
  geschwisterkinder: Geschwisterkinder,
  ausklammerungen: Ausklammerung[],
  geschwisterIndex?: number,
  istAbfrageMutterschutzGleichesGeschwisterkind?: boolean,
): number | undefined {
  if (geschwisterIndex === undefined) {
    return findeJuengstesRelevantesGeschwisterkind(
      geschwisterkinder,
      geburtsdatum,
      ausklammerungen,
    );
  }

  if (istAbfrageMutterschutzGleichesGeschwisterkind) {
    return findeRelevantesGeschwisterkindFuerMutterschutzAbfrage(
      geschwisterkinder,
      geburtsdatum,
      ausklammerungen,
      geschwisterIndex,
    );
  }

  return findeNaechstAelteresRelevantesGeschwisterkind(
    geschwisterkinder,
    geburtsdatum,
    ausklammerungen,
    geschwisterIndex,
  );
}

function sortiereNachGeburtsdatum(geschwisterkinder: Geschwisterkinder) {
  return geschwisterkinder
    .map((geschwisterkind, index) => ({
      geburtsdatum: geschwisterkind.geburtsdatum,
      eingabeposition: index,
    }))
    .sort((a, b) =>
      Temporal.PlainDate.compare(b.geburtsdatum, a.geburtsdatum),
    ) satisfies SortierteGeschwisterkinder;
}

type Geschwisterkind = { geburtsdatum: Temporal.PlainDate };

type Geschwisterkinder = Geschwisterkind[];

type SortiertesGeschwisterkind = Geschwisterkind & {
  eingabeposition: number; // Die Position in der Eingabereihenfolge
};

type SortierteGeschwisterkinder = SortiertesGeschwisterkind[];

// § 2b BEEG: Basiselterngeld läuft bis zum 14. Lebensmonat des Kindes.
const ELTERNGELD_BEZUGSFENSTER = { months: 14 } as const;

// Mutterschutzfrist nach der Geburt (§ 3 Abs. 2 MuSchG) ist im Regelfall 8 Wochen,
// kann jedoch auf 12 Wochen verlängert werden im Fall von Frühgeburten, Mehrlingsgeburten
// oder wenn vor Ablauf von 8 Wochen nach der Entbindung bei dem Kind eine Behinderung
// festgestellt wird.
const MUTTERSCHUTZFRIST = { weeks: 12 } as const;

function betrifftBetrachtungszeitraum(
  geburtsdatum: Temporal.PlainDate,
  relevanzfenster: Temporal.DurationLike,
  betrachtungszeitraumStart: Temporal.PlainDate,
): boolean {
  return (
    Temporal.PlainDate.compare(
      geburtsdatum.add(relevanzfenster),
      betrachtungszeitraumStart,
    ) > 0
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("betrifftBetrachtungszeitraum", () => {
    it("returns true if start of Betrachtungszeitraum is last day of Relevanzfenster for Elterngeld", () => {
      const geburtsdatumGeschwisterkind = Temporal.PlainDate.from("2025-10-01");
      const relevanzfensterElterngeld = Temporal.Duration.from({ months: 14 });
      const betrachtungszeitraumStart = Temporal.PlainDate.from("2026-11-30");

      const result = betrifftBetrachtungszeitraum(
        geburtsdatumGeschwisterkind,
        relevanzfensterElterngeld,
        betrachtungszeitraumStart,
      );

      expect(result).toEqual(true);
    });

    it("returns false if start of Betrachtungszeitraum is one day after last day of Relevanzfenster for Elterngeld", () => {
      const geburtsdatumGeschwisterkind = Temporal.PlainDate.from("2025-10-01");
      const relevanzfensterElterngeld = Temporal.Duration.from({ months: 14 });
      const betrachtungszeitraumStart = Temporal.PlainDate.from("2026-12-01");

      const result = betrifftBetrachtungszeitraum(
        geburtsdatumGeschwisterkind,
        relevanzfensterElterngeld,
        betrachtungszeitraumStart,
      );

      expect(result).toEqual(false);
    });
  });

  describe("sortiereGeschwisterkinderNachGeburtsdatum", () => {
    it("sorts Geschwisterkinder from youngest to eldest", () => {
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2025-01-01") },
        { geburtsdatum: Temporal.PlainDate.from("2026-01-01") },
        { geburtsdatum: Temporal.PlainDate.from("2024-01-01") },
      ];

      expect(sortiereNachGeburtsdatum(geschwisterkinder)).toMatchObject([
        { geburtsdatum: Temporal.PlainDate.from("2026-01-01") },
        { geburtsdatum: Temporal.PlainDate.from("2025-01-01") },
        { geburtsdatum: Temporal.PlainDate.from("2024-01-01") },
      ]);
    });

    it("keeps the original index as eingabeposition", () => {
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2025-01-01") },
        { geburtsdatum: Temporal.PlainDate.from("2026-01-01") },
        { geburtsdatum: Temporal.PlainDate.from("2024-01-01") },
      ];

      expect(sortiereNachGeburtsdatum(geschwisterkinder)).toMatchObject([
        { eingabeposition: 1 },
        { eingabeposition: 0 },
        { eingabeposition: 2 },
      ]);
    });
  });

  describe("findeJuengstesRelevantesGeschwisterkind", () => {
    it("gibt undefined zurück wenn es keine Geschwisterkinder gibt", () => {
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");

      const result = findeJuengstesRelevantesGeschwisterkind(
        [],
        geburtsdatum,
        [],
      );

      expect(result).toBeUndefined();
    });

    it("gibt die Eingabeposition des jüngsten Geschwisterkinds zurück wenn dessen Bezugsfenster nach dem Start des Betrachtungszeitraums endet", () => {
      // Geburt am 15.10.2025 ergibt einen Betrachtungszeitraum ab 01.01.2024.
      // 01.12.2022 + 14 Monate = 01.02.2024 und liegt danach, also relevant.
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2022-12-01") },
      ];

      const result = findeJuengstesRelevantesGeschwisterkind(
        geschwisterkinder,
        geburtsdatum,
        [],
      );

      expect(result).toEqual(0);
    });

    it("gibt undefined zurück wenn das Bezugsfenster genau am Start des Betrachtungszeitraums endet", () => {
      // 01.11.2022 + 14 Monate = 01.01.2024 und damit genau der Start.
      // Verlangt wird eine strikte Überschreitung, also nicht relevant.
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2022-11-01") },
      ];

      const result = findeJuengstesRelevantesGeschwisterkind(
        geschwisterkinder,
        geburtsdatum,
        [],
      );

      expect(result).toBeUndefined();
    });

    it("gibt undefined zurück wenn das jüngste Geschwisterkind zu alt ist", () => {
      // 01.10.2022 + 14 Monate = 01.12.2023 und liegt vor dem 01.01.2024.
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2022-10-01") },
      ];

      const result = findeJuengstesRelevantesGeschwisterkind(
        geschwisterkinder,
        geburtsdatum,
        [],
      );

      expect(result).toBeUndefined();
    });

    it("gibt die Eingabeposition zurück und nicht die Sortierposition", () => {
      // Das jüngere Kind steht an Eingabeposition 1, nach dem Sortieren aber
      // an Sortierposition 0. Zurückgegeben wird die Eingabeposition.
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2021-01-01") },
        { geburtsdatum: Temporal.PlainDate.from("2023-06-01") },
      ];

      const result = findeJuengstesRelevantesGeschwisterkind(
        geschwisterkinder,
        geburtsdatum,
        [],
      );

      expect(result).toEqual(1);
    });

    it("gibt 0 zurück wenn das jüngste Geschwisterkind an erster Eingabeposition steht", () => {
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2023-06-01") },
        { geburtsdatum: Temporal.PlainDate.from("2021-01-01") },
      ];

      const result = findeJuengstesRelevantesGeschwisterkind(
        geschwisterkinder,
        geburtsdatum,
        [],
      );

      expect(result).toEqual(0);
    });

    it("gibt undefined zurück wenn alle Geschwisterkinder zu alt sind", () => {
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2018-01-01") },
        { geburtsdatum: Temporal.PlainDate.from("2020-01-01") },
      ];

      const result = findeJuengstesRelevantesGeschwisterkind(
        geschwisterkinder,
        geburtsdatum,
        [],
      );

      expect(result).toBeUndefined();
    });

    it("macht ein sonst irrelevantes Geschwisterkind relevant wenn eine Ausklammerung den Betrachtungszeitraum zurückschiebt", () => {
      // Ohne Ausklammerung startet der Betrachtungszeitraum am 01.01.2024 und
      // 01.12.2021 + 14 Monate = 01.02.2023 liegt davor, also nicht relevant.
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2021-12-01") },
      ];

      const resultOhneAusklammerung = findeJuengstesRelevantesGeschwisterkind(
        geschwisterkinder,
        geburtsdatum,
        [],
      );

      expect(resultOhneAusklammerung).toBeUndefined();

      // Eine Ausklammerung in 2024 verschiebt den Start auf den 01.01.2023.
      // Damit liegt der 01.02.2023 danach und das Kind wird relevant.
      const resultMitAusklammerung = findeJuengstesRelevantesGeschwisterkind(
        geschwisterkinder,
        geburtsdatum,
        [
          {
            von: Temporal.PlainDate.from("2024-03-01"),
            bis: Temporal.PlainDate.from("2024-09-30"),
            grund: "test",
          },
        ],
      );

      expect(resultMitAusklammerung).toEqual(0);
    });

    it("verschiebt den Start um zwei Jahre wenn Ausklammerungen in zwei aufeinanderfolgenden Jahren liegen", () => {
      // Ausklammerungen in 2024 und 2023 ergeben einen Start am 01.01.2022.
      // 01.12.2020 + 14 Monate = 01.02.2022 liegt danach, also relevant.
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2020-12-01") },
      ];

      const result = findeJuengstesRelevantesGeschwisterkind(
        geschwisterkinder,
        geburtsdatum,
        [
          {
            von: Temporal.PlainDate.from("2024-01-01"),
            bis: Temporal.PlainDate.from("2024-12-31"),
            grund: "test",
          },
          {
            von: Temporal.PlainDate.from("2023-01-01"),
            bis: Temporal.PlainDate.from("2023-12-31"),
            grund: "test",
          },
        ],
      );

      expect(result).toEqual(0);
    });

    it("lässt den Betrachtungszeitraum unberührt wenn die Ausklammerung weit in der Vergangenheit liegt", () => {
      // Eine Ausklammerung in 2020 berührt 2024 nicht, der Start bleibt der
      // 01.01.2024. 01.01.2021 + 14 Monate = 01.03.2022 liegt davor.
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2021-01-01") },
      ];

      const result = findeJuengstesRelevantesGeschwisterkind(
        geschwisterkinder,
        geburtsdatum,
        [
          {
            von: Temporal.PlainDate.from("2020-01-01"),
            bis: Temporal.PlainDate.from("2020-12-31"),
            grund: "test",
          },
        ],
      );

      expect(result).toBeUndefined();
    });

    it("verschiebt den Start auch wenn die Ausklammerung nur einen Tag im Januar des Vorjahres umfasst", () => {
      // Ein einziger Tag in 2024 macht das Jahr betroffen, Start am 01.01.2023.
      // 01.12.2021 + 14 Monate = 01.02.2023 liegt danach, also relevant.
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2021-12-01") },
      ];

      const result = findeJuengstesRelevantesGeschwisterkind(
        geschwisterkinder,
        geburtsdatum,
        [
          {
            von: Temporal.PlainDate.from("2024-01-01"),
            bis: Temporal.PlainDate.from("2024-01-01"),
            grund: "test",
          },
        ],
      );

      expect(result).toEqual(0);
    });
  });

  describe("findeNaechstAelteresRelevantesGeschwisterkind", () => {
    it("gibt undefined zurück wenn es keine Geschwisterkinder gibt", () => {
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");

      const result = findeNaechstAelteresRelevantesGeschwisterkind(
        [],
        geburtsdatum,
        [],
        0,
      );

      expect(result).toBeUndefined();
    });

    it("gibt undefined zurück wenn die Eingabeposition nicht vorkommt", () => {
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2023-01-01") },
      ];

      const result = findeNaechstAelteresRelevantesGeschwisterkind(
        geschwisterkinder,
        geburtsdatum,
        [],
        5,
      );

      expect(result).toBeUndefined();
    });

    it("gibt undefined zurück wenn es kein älteres Geschwisterkind gibt", () => {
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2023-01-01") },
      ];

      const result = findeNaechstAelteresRelevantesGeschwisterkind(
        geschwisterkinder,
        geburtsdatum,
        [],
        0,
      );

      expect(result).toBeUndefined();
    });

    it("gibt die Eingabeposition des nächstälteren Geschwisterkinds zurück wenn dessen Bezugsfenster noch reicht", () => {
      // Ausgehend von Eingabeposition 1 ist Eingabeposition 0 das nächstältere
      // Kind. 01.12.2022 + 14 Monate = 01.02.2024 liegt nach dem 01.01.2024.
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2022-12-01") },
        { geburtsdatum: Temporal.PlainDate.from("2023-06-01") },
      ];

      const result = findeNaechstAelteresRelevantesGeschwisterkind(
        geschwisterkinder,
        geburtsdatum,
        [],
        1,
      );

      expect(result).toEqual(0);
    });

    it("gibt undefined zurück wenn das nächstältere Geschwisterkind zu alt ist", () => {
      // 01.01.2021 + 14 Monate = 01.03.2022 liegt vor dem 01.01.2024.
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2021-01-01") },
        { geburtsdatum: Temporal.PlainDate.from("2023-06-01") },
      ];

      const result = findeNaechstAelteresRelevantesGeschwisterkind(
        geschwisterkinder,
        geburtsdatum,
        [],
        1,
      );

      expect(result).toBeUndefined();
    });

    it("gibt undefined zurück wenn nach dem ältesten Geschwisterkind gefragt wird", () => {
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2022-12-01") },
        { geburtsdatum: Temporal.PlainDate.from("2023-06-01") },
      ];

      const result = findeNaechstAelteresRelevantesGeschwisterkind(
        geschwisterkinder,
        geburtsdatum,
        [],
        0,
      );

      expect(result).toBeUndefined();
    });

    it("läuft im Zusammenspiel mit dem Erstaufruf vom jüngsten bis zum ältesten Geschwisterkind", () => {
      // Eingabeposition 0 ist das älteste Kind und mit 01.01.2022 + 14 Monate
      // = 01.03.2023 nicht mehr relevant. Eingabeposition 1 ist mit
      // 01.12.2022 + 14 Monate = 01.02.2024 relevant.
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2022-01-01") },
        { geburtsdatum: Temporal.PlainDate.from("2022-12-01") },
        { geburtsdatum: Temporal.PlainDate.from("2023-06-01") },
      ];

      const erstaufruf = findeJuengstesRelevantesGeschwisterkind(
        geschwisterkinder,
        geburtsdatum,
        [],
      );

      expect(erstaufruf).toEqual(2);

      const zweiterSchritt = findeNaechstAelteresRelevantesGeschwisterkind(
        geschwisterkinder,
        geburtsdatum,
        [],
        2,
      );

      expect(zweiterSchritt).toEqual(1);

      const dritterSchritt = findeNaechstAelteresRelevantesGeschwisterkind(
        geschwisterkinder,
        geburtsdatum,
        [],
        1,
      );

      expect(dritterSchritt).toBeUndefined();
    });

    it("prüft das nächstältere Geschwisterkind auch wenn für das gleiche Kind noch eine Mutterschutzfrist offen wäre", () => {
      // Eingabeposition 1 ist am 10.10.2023 geboren, dessen Mutterschutzfrist
      // wäre relevant. Diese Funktion prüft sie nicht, sondern nur das
      // nächstältere Kind an Eingabeposition 0, das zu alt ist.
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2019-01-01") },
        { geburtsdatum: Temporal.PlainDate.from("2023-10-10") },
      ];

      const result = findeNaechstAelteresRelevantesGeschwisterkind(
        geschwisterkinder,
        geburtsdatum,
        [],
        1,
      );

      expect(result).toBeUndefined();
    });
  });

  describe("findeRelevantesGeschwisterkindFuerMutterschutzAbfrage", () => {
    it("gibt die Eingabeposition des gleichen Geschwisterkinds zurück wenn die Mutterschutzfrist nach dem Start des Betrachtungszeitraums endet", () => {
      // 10.10.2023 + 12 Wochen = 02.01.2024 und liegt nach dem 01.01.2024.
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2023-10-10") },
      ];

      const result = findeRelevantesGeschwisterkindFuerMutterschutzAbfrage(
        geschwisterkinder,
        geburtsdatum,
        [],
        0,
      );

      expect(result).toEqual(0);
    });

    it("gibt undefined zurück wenn die Mutterschutzfrist genau am Start des Betrachtungszeitraums endet", () => {
      // 09.10.2023 + 12 Wochen = 01.01.2024 und damit genau der Start. Verlangt
      // wird eine strikte Überschreitung, und es gibt kein älteres Kind.
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2023-10-09") },
      ];

      const result = findeRelevantesGeschwisterkindFuerMutterschutzAbfrage(
        geschwisterkinder,
        geburtsdatum,
        [],
        0,
      );

      expect(result).toBeUndefined();
    });

    it("fällt auf das nächstältere Geschwisterkind durch wenn die Mutterschutzfrist nicht mehr reicht", () => {
      // Eingabeposition 1: 01.05.2023 + 12 Wochen = 24.07.2023 liegt vor dem
      // 01.01.2024. Eingabeposition 0: 01.12.2022 + 14 Monate = 01.02.2024
      // liegt danach und ist damit relevant.
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2022-12-01") },
        { geburtsdatum: Temporal.PlainDate.from("2023-05-01") },
      ];

      const result = findeRelevantesGeschwisterkindFuerMutterschutzAbfrage(
        geschwisterkinder,
        geburtsdatum,
        [],
        1,
      );

      expect(result).toEqual(0);
    });

    it("gibt das gleiche Geschwisterkind zurück ohne das nächstältere zu prüfen", () => {
      // Eingabeposition 1 ist über die Mutterschutzfrist relevant. Das
      // nächstältere Kind an Eingabeposition 0 ist viel zu alt und würde
      // undefined ergeben, wird also gar nicht geprüft.
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2019-01-01") },
        { geburtsdatum: Temporal.PlainDate.from("2023-10-10") },
      ];

      const result = findeRelevantesGeschwisterkindFuerMutterschutzAbfrage(
        geschwisterkinder,
        geburtsdatum,
        [],
        1,
      );

      expect(result).toEqual(1);
    });

    it("macht die Mutterschutzfrist des gleichen Geschwisterkinds wieder relevant wenn eine Ausklammerung den Betrachtungszeitraum zurückschiebt", () => {
      // Das Geburtsdatum ist der 15.10.2025 und resultiert damit in
      // einem Betrachtungszeitraum der am 01.01.2024 startet. Das ist
      // der frühste Anfang aus der Kombination von nicht-selbständigen
      // und selbständigen.
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");

      // Ein Geschwisterkind ist geboren am 01.06.2023 und somit endet
      // die Muttschutzfrist 12 Wochen später am 24.08.2023.
      const geschwisterkinder = [
        { geburtsdatum: Temporal.PlainDate.from("2023-06-01") },
      ];

      // In diesem Fall, ohne Ausklammerungen, wäre der 24.08.2023
      // vor dem 01.01.2024 und so greift die 12 Wochen Regel nicht.
      // Da es auch kein älteres Kind zum durchfallen gibt ist der
      // Wert undefined.
      const resultOhneAusklammerung =
        findeRelevantesGeschwisterkindFuerMutterschutzAbfrage(
          geschwisterkinder,
          geburtsdatum,
          [],
          0,
        );

      expect(resultOhneAusklammerung).toBeUndefined();

      // Durch eine Ausklammerung in 2024 verschiebt sich der Start des
      // Betrachtungszeitraum jedoch auf den 01.01.2023 und somit ist der
      // Mutterschutz des gleichen Kindes wieder relevant. Dadurch ist der
      // Return Wert 0 also das gleiche Geschwisterkind.
      const resultMitAusklammerung =
        findeRelevantesGeschwisterkindFuerMutterschutzAbfrage(
          geschwisterkinder,
          geburtsdatum,
          [
            {
              von: Temporal.PlainDate.from("2024-03-01"),
              bis: Temporal.PlainDate.from("2024-09-30"),
              grund: "test",
            },
          ],
          0,
        );

      expect(resultMitAusklammerung).toEqual(0);
    });
  });
}
