import { Temporal } from "@js-temporal/polyfill";
import { AusklammerungMitGeschwisterindex } from "./findeAusklammerungen";
import { berechneBetrachtungszeitraum } from "@/bemessungszeitraumrechner";

export function berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerung(
  geburtsdatum: Temporal.PlainDate,
  geschwisterkinder: Geschwisterkinder,
  ausklammerungen: AusklammerungMitGeschwisterindex[],
  geschwisterIndex?: number,
  istAbfrageMutterschutzGleichesGeschwisterkind?: boolean,
): number | undefined {
  if (geschwisterkinder.length === 0) return undefined;

  const sortierteGeschwisterkinder =
    sortiereGeschwisterkinderNachGeburtsdatum(geschwisterkinder);
  const betrachtungszeitraum = berechneBetrachtungszeitraum(
    geburtsdatum,
    ausklammerungen,
  );

  if (geschwisterIndex === undefined) {
    const juengstesGeschwisterkind = getJuengstesGeschwisterkind(
      sortierteGeschwisterkinder,
    );

    if (juengstesGeschwisterkind) {
      const betrifftJuengstesBetrachtungszeitraum =
        betrifftBetrachtungszeitraum(
          juengstesGeschwisterkind.geburtsdatum,
          ELTERNGELD_BEZUGSFENSTER,
          betrachtungszeitraum.von,
        );

      if (betrifftJuengstesBetrachtungszeitraum) {
        return juengstesGeschwisterkind.eingabeposition;
      }
    }

    return undefined;
  }

  const currentPosition = sortierteGeschwisterkinder.findIndex(
    ({ eingabeposition }) => eingabeposition === geschwisterIndex,
  );

  if (currentPosition === -1) return undefined;

  if (istAbfrageMutterschutzGleichesGeschwisterkind) {
    const gleichesGeschwisterkind = getGleichesGeschwisterkind(
      sortierteGeschwisterkinder,
      geschwisterIndex,
    );

    if (gleichesGeschwisterkind) {
      const betrifftGleichesBetrachtungszeitraum = betrifftBetrachtungszeitraum(
        gleichesGeschwisterkind.geburtsdatum,
        MUTTERSCHUTZFRIST,
        betrachtungszeitraum.von,
      );

      if (betrifftGleichesBetrachtungszeitraum) {
        return gleichesGeschwisterkind.eingabeposition;
      }
    }
  }

  const naechstesGeschwisterkind = getNaechstAelteresGeschwisterkind(
    sortierteGeschwisterkinder,
    geschwisterIndex,
  );

  if (naechstesGeschwisterkind) {
    const betrifftNaechstesBetrachtungszeitraum = betrifftBetrachtungszeitraum(
      naechstesGeschwisterkind.geburtsdatum,
      ELTERNGELD_BEZUGSFENSTER,
      betrachtungszeitraum.von,
    );

    if (betrifftNaechstesBetrachtungszeitraum) {
      return naechstesGeschwisterkind.eingabeposition;
    }
  }

  return undefined;
}

function getJuengstesGeschwisterkind(
  sortierteGeschwisterkinder: SortierteGeschwisterkinder,
) {
  return sortierteGeschwisterkinder[0];
}

function getGleichesGeschwisterkind(
  sortierteGeschwisterkinder: SortierteGeschwisterkinder,
  eingabeposition: number,
): SortiertesGeschwisterkind | undefined {
  return sortierteGeschwisterkinder.find(
    (geschwisterkind) => geschwisterkind.eingabeposition === eingabeposition,
  );
}

function getNaechstAelteresGeschwisterkind(
  sortierteGeschwisterkinder: SortierteGeschwisterkinder,
  eingabeposition: number,
): SortiertesGeschwisterkind | undefined {
  const position = sortierteGeschwisterkinder.findIndex(
    (geschwisterkind) => geschwisterkind.eingabeposition === eingabeposition,
  );

  if (position === -1) return undefined;

  return sortierteGeschwisterkinder[position + 1];
}

function sortiereGeschwisterkinderNachGeburtsdatum(
  geschwisterkinder: Geschwisterkinder,
): SortierteGeschwisterkinder {
  return geschwisterkinder
    .map((geschwisterkind, index) => ({
      geburtsdatum: geschwisterkind.geburtsdatum,
      eingabeposition: index,
    }))
    .sort((a, b) => Temporal.PlainDate.compare(b.geburtsdatum, a.geburtsdatum));
}

type Geschwisterkind = { geburtsdatum: Temporal.PlainDate };

type Geschwisterkinder = Geschwisterkind[];

type SortiertesGeschwisterkind = Geschwisterkind & {
  eingabeposition: number;
};

/**
 * Eine Menge an Geschwisterkindern in der Reihenfolge, in der die
 * Relevanz geprüft wird also jüngstes zuerst und ältestes zuletzt.
 *
 * Die `eingabeposition` ist die Position in der Eingabereihenfolge der
 * Eltern. Sie ist nicht die Position innerhalb einer sortierten Sequenz.
 */
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

  // geburtsdatum of the new child → betrachtungszeitraum.von = 2024-01-01 (no Ausklammerungen)
  const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
  const keineAusklammerungen: AusklammerungMitGeschwisterindex[] = [];

  const geschwisterkind = (geburtsdatumStr: string): Geschwisterkind => ({
    geburtsdatum: Temporal.PlainDate.from(geburtsdatumStr),
  });

  const ausklammerung = (
    von: string,
    bis: string,
  ): AusklammerungMitGeschwisterindex => ({
    von: Temporal.PlainDate.from(von),
    bis: Temporal.PlainDate.from(bis),
    grund: "test",
  });

  const fn = berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerung;

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

      const result =
        sortiereGeschwisterkinderNachGeburtsdatum(geschwisterkinder);

      expect(result).toMatchObject([
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

      const result =
        sortiereGeschwisterkinderNachGeburtsdatum(geschwisterkinder);

      expect(result).toMatchObject([
        { eingabeposition: 1 },
        { eingabeposition: 0 },
        { eingabeposition: 2 },
      ]);
    });
  });

  describe("berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerung", () => {
    describe("keine Geschwisterkinder", () => {
      it("gibt undefined zurück wenn keine Geschwisterkinder vorhanden", () => {
        expect(fn(geburtsdatum, [], keineAusklammerungen)).toBeUndefined();
      });

      it("gibt undefined zurück wenn keine Geschwisterkinder und geschwisterIndex gesetzt", () => {
        expect(fn(geburtsdatum, [], keineAusklammerungen, 0)).toBeUndefined();
      });
    });

    describe("geschwisterIndex undefined (Erstaufruf)", () => {
      it("gibt Index des jüngsten Geschwisterkinds zurück wenn +14 Monate nach dem Betrachtungszeitraum.von liegt", () => {
        // 2022-12-01 + 14M = 2024-02-01 > 2024-01-01 → relevant
        expect(
          fn(
            geburtsdatum,
            [geschwisterkind("2022-12-01")],
            keineAusklammerungen,
          ),
        ).toBe(0);
      });

      it("gibt undefined zurück wenn +14 Monate genau gleich Betrachtungszeitraum.von (keine strikte Überschreitung)", () => {
        // 2022-11-01 + 14M = 2024-01-01 = 2024-01-01 → compare() = 0, nicht > 0
        expect(
          fn(
            geburtsdatum,
            [geschwisterkind("2022-11-01")],
            keineAusklammerungen,
          ),
        ).toBeUndefined();
      });

      it("gibt undefined zurück wenn jüngstes Geschwisterkind zu alt", () => {
        // 2022-10-01 + 14M = 2023-12-01 < 2024-01-01 → nicht relevant
        expect(
          fn(
            geburtsdatum,
            [geschwisterkind("2022-10-01")],
            keineAusklammerungen,
          ),
        ).toBeUndefined();
      });

      it("gibt den ursprünglichen Array-Index des jüngsten Kindes zurück, nicht die Sortierposition", () => {
        // [älter (idx 0), jünger (idx 1)] → nach Sort: jünger zuerst → gibt ursprünglichen Index 1 zurück
        const geschwisterkinder = [
          geschwisterkind("2021-01-01"), // original idx 0
          geschwisterkind("2023-06-01"), // original idx 1 (jünger, relevant)
        ];
        expect(fn(geburtsdatum, geschwisterkinder, keineAusklammerungen)).toBe(
          1,
        );
      });

      it("gibt Index 0 zurück wenn jüngstes Kind an erster Stelle im Array steht", () => {
        const geschwisterkinder = [
          geschwisterkind("2023-06-01"), // original idx 0 (jünger)
          geschwisterkind("2021-01-01"), // original idx 1
        ];
        expect(fn(geburtsdatum, geschwisterkinder, keineAusklammerungen)).toBe(
          0,
        );
      });

      it("gibt undefined zurück wenn alle Geschwisterkinder zu alt sind", () => {
        const geschwisterkinder = [
          geschwisterkind("2018-01-01"),
          geschwisterkind("2020-01-01"),
        ];
        expect(
          fn(geburtsdatum, geschwisterkinder, keineAusklammerungen),
        ).toBeUndefined();
      });
    });

    describe("geschwisterIndex definiert (Folgeaufruf)", () => {
      it("gibt undefined zurück wenn geschwisterIndex nicht in Geschwisterliste vorhanden", () => {
        expect(
          fn(
            geburtsdatum,
            [geschwisterkind("2023-01-01")],
            keineAusklammerungen,
            5,
          ),
        ).toBeUndefined();
      });

      it("gibt undefined zurück wenn Geschwisterkind an letzter Sortierposition (kein älteres Geschwisterkind)", () => {
        // Einziges Kind (idx 0) → kein nächstes älteres Kind
        expect(
          fn(
            geburtsdatum,
            [geschwisterkind("2023-01-01")],
            keineAusklammerungen,
            0,
          ),
        ).toBeUndefined();
      });

      it("gibt Index des nächstälteren Geschwisterkindes zurück wenn innerhalb 14 Monate", () => {
        // [älteres (idx 0, 2022-12-01), jüngeres (idx 1, 2023-06-01)]
        // Bei idx 1 → nächstälteres ist idx 0, 2022-12-01 + 14M = 2024-02-01 > 2024-01-01 → relevant
        const geschwisterkinder = [
          geschwisterkind("2022-12-01"), // idx 0
          geschwisterkind("2023-06-01"), // idx 1
        ];
        expect(
          fn(geburtsdatum, geschwisterkinder, keineAusklammerungen, 1),
        ).toBe(0);
      });

      it("gibt undefined zurück wenn nächstälteres Geschwisterkind zu alt", () => {
        // 2021-01-01 + 14M = 2022-03-01 < 2024-01-01 → nicht relevant
        const geschwisterkinder = [
          geschwisterkind("2021-01-01"), // idx 0
          geschwisterkind("2023-06-01"), // idx 1
        ];
        expect(
          fn(geburtsdatum, geschwisterkinder, keineAusklammerungen, 1),
        ).toBeUndefined();
      });

      it("gibt undefined zurück wenn beim ältesten Kind gefragt wird (kein weiteres)", () => {
        const geschwisterkinder = [
          geschwisterkind("2022-12-01"), // idx 0 (ältestes)
          geschwisterkind("2023-06-01"), // idx 1
        ];
        expect(
          fn(geburtsdatum, geschwisterkinder, keineAusklammerungen, 0),
        ).toBeUndefined();
      });

      it("modelliert korrekten Walk: jüngstes → nächstälteres → undefined", () => {
        // Drei Kinder in Ursprungsreihenfolge
        const geschwisterkinder = [
          geschwisterkind("2022-01-01"), // idx 0 (ältestes), +14M = 2023-03-01 < 2024-01-01 → nicht relevant
          geschwisterkind("2022-12-01"), // idx 1 (mittleres), +14M = 2024-02-01 > 2024-01-01 → relevant
          geschwisterkind("2023-06-01"), // idx 2 (jüngstes)
        ];
        // Schritt 1: kein geschwisterIndex → jüngstes (idx 2)
        expect(fn(geburtsdatum, geschwisterkinder, keineAusklammerungen)).toBe(
          2,
        );
        // Schritt 2: bei idx 2 → nächstälteres idx 1
        expect(
          fn(geburtsdatum, geschwisterkinder, keineAusklammerungen, 2),
        ).toBe(1);
        // Schritt 3: bei idx 1 → nächstälteres idx 0, zu alt → undefined
        expect(
          fn(geburtsdatum, geschwisterkinder, keineAusklammerungen, 1),
        ).toBeUndefined();
      });
    });

    describe("istAbfrageMutterschutzGleichesGeschwisterkind", () => {
      it("gibt denselben Index zurück wenn Geburtsdatum + 12 Wochen nach Betrachtungszeitraum.von liegt", () => {
        // 2023-10-10 + 84 Tage = 2024-01-02 > 2024-01-01 → gleichen Index zurückgeben
        expect(
          fn(
            geburtsdatum,
            [geschwisterkind("2023-10-10")],
            keineAusklammerungen,
            0,
            true,
          ),
        ).toBe(0);
      });

      it("gibt undefined zurück wenn Geburtsdatum + 12 Wochen genau gleich Betrachtungszeitraum.von (keine strikte Überschreitung)", () => {
        // 2023-10-09 + 84 Tage = 2024-01-01 → compare() = 0, nicht > 0 → fällt durch, kein nächstes Kind → undefined
        expect(
          fn(
            geburtsdatum,
            [geschwisterkind("2023-10-09")],
            keineAusklammerungen,
            0,
            true,
          ),
        ).toBeUndefined();
      });

      it("fällt auf nächstälteres Kind durch wenn 12-Wochen-Bedingung nicht erfüllt", () => {
        // idx 1: born 2023-05-01, +12W = 2023-07-24 < 2024-01-01 → Mutterschutz nicht relevant
        // idx 0: born 2022-12-01, +14M = 2024-02-01 > 2024-01-01 → relevant
        const geschwisterkinder = [
          geschwisterkind("2022-12-01"), // idx 0
          geschwisterkind("2023-05-01"), // idx 1
        ];
        expect(
          fn(geburtsdatum, geschwisterkinder, keineAusklammerungen, 1, true),
        ).toBe(0);
      });

      it("gibt sofort gleichen Index zurück ohne nächstes Kind zu prüfen wenn 12-Wochen-Bedingung erfüllt", () => {
        // idx 1: born 2023-10-10, +12W > 2024-01-01 → direkt idx 1 zurückgeben
        // idx 0: born 2019-01-01 → viel zu alt, würde undefined ergeben
        const geschwisterkinder = [
          geschwisterkind("2019-01-01"), // idx 0, zu alt
          geschwisterkind("2023-10-10"), // idx 1, Mutterschutz relevant
        ];
        expect(
          fn(geburtsdatum, geschwisterkinder, keineAusklammerungen, 1, true),
        ).toBe(1);
      });

      it("prüft nächstälteres Kind ohne Mutterschutz-Flag", () => {
        // Gleiche Konstellation, aber ohne Flag → idx 0 zu alt → undefined
        const geschwisterkinder = [
          geschwisterkind("2019-01-01"), // idx 0
          geschwisterkind("2023-10-10"), // idx 1
        ];
        expect(
          fn(geburtsdatum, geschwisterkinder, keineAusklammerungen, 1, false),
        ).toBeUndefined();
      });

      it("Ausklammerung verschiebt von zurück, sodass die 12-Wochen-Mutterschutzfrist des gleichen Geschwisterkinds wieder relvant wird", () => {
        // Das Geburtsdatum ist der 15.10.2025 und resultiert damit in
        // einem Betrachtungszeitraum der am 01.01.2024 startet. Das ist
        // der frühste Anfang aus der Kombination von nicht-selbständigen
        // und selbständigen.
        const geburtsdatum = Temporal.PlainDate.from("2025-10-15");

        // Ein Geschwisterkind ist geboren am 01.06.2023 und somit endet
        // die Muttschutzfrist 12 Wochen später am 24.08.2023.
        const geschwisterkinder = [geschwisterkind("2023-06-01")];

        // In diesem Fall, ohne Ausklammerungen, wäre der 24.08.2023
        // vor dem 01.01.2024 und so greift die 12 Wochen Regel nicht.
        // Da es auch kein älteres Kind zum durchfallen gibt ist der
        // Wert undefined.
        expect(
          fn(geburtsdatum, geschwisterkinder, keineAusklammerungen, 0, true),
        ).toBeUndefined();

        // Durch eine Ausklammerung in 2024 verschiebt sich der Start des
        // Betrachtungszeitraum jedoch auf den 01.01.2023 und somit ist der
        // Mutterschutz des gleichen Kindes wieder relevant. Dadurch ist der
        // Return Wert 0 also das gleiche Geschwisterkind.
        const ausklammerungen = [ausklammerung("2024-03-01", "2024-09-30")];
        expect(
          fn(geburtsdatum, geschwisterkinder, ausklammerungen, 0, true),
        ).toBe(0);
      });
    });

    describe("Ausklammerungen verschieben Betrachtungszeitraum.von", () => {
      it("Ausklammerung im Vorjahr macht sonst irrelevantes Geschwisterkind relevant", () => {
        // Ohne Ausklammerung: von = 2024-01-01
        // 2021-12-01 + 14M = 2023-02-01 < 2024-01-01 → nicht relevant
        expect(
          fn(
            geburtsdatum,
            [geschwisterkind("2021-12-01")],
            keineAusklammerungen,
          ),
        ).toBeUndefined();

        // Mit Ausklammerung in 2024: von = 2023-01-01
        // 2021-12-01 + 14M = 2023-02-01 > 2023-01-01 → relevant!
        const ausklammerungen = [ausklammerung("2024-03-01", "2024-09-30")];
        expect(
          fn(geburtsdatum, [geschwisterkind("2021-12-01")], ausklammerungen),
        ).toBe(0);
      });

      it("Ausklammerungen in zwei aufeinanderfolgenden Jahren verschieben von um zwei Jahre", () => {
        // Ausklammerungen in 2024 und 2023 → von = 2022-01-01
        // 2020-12-01 + 14M = 2022-02-01 > 2022-01-01 → relevant
        const geschwisterkinder = [geschwisterkind("2020-12-01")];
        const ausklammerungen = [
          ausklammerung("2024-01-01", "2024-12-31"),
          ausklammerung("2023-01-01", "2023-12-31"),
        ];
        expect(fn(geburtsdatum, geschwisterkinder, ausklammerungen)).toBe(0);
      });

      it("Ausklammerung weit in der Vergangenheit beeinflusst Betrachtungszeitraum nicht", () => {
        // Ausklammerung in 2020 berührt 2024 nicht → von bleibt 2024-01-01
        // 2021-01-01 + 14M = 2022-03-01 < 2024-01-01 → nicht relevant
        const ausklammerungen = [ausklammerung("2020-01-01", "2020-12-31")];
        expect(
          fn(geburtsdatum, [geschwisterkind("2021-01-01")], ausklammerungen),
        ).toBeUndefined();
      });

      it("Ausklammerungen mit geschwisterIndex werden korrekt an berechneBetrachtungszeitraum weitergegeben", () => {
        // AusklammerungMitGeschwisterindex erweitert Ausklammerung → kompatibel
        const ausklammerungMitIndex: AusklammerungMitGeschwisterindex = {
          ...ausklammerung("2024-03-01", "2024-09-30"),
          geschwisterIndex: 0,
        };
        // Gleiche Wirkung wie ohne geschwisterIndex: von = 2023-01-01
        // 2021-12-01 + 14M = 2023-02-01 > 2023-01-01 → relevant
        expect(
          fn(
            geburtsdatum,
            [geschwisterkind("2021-12-01")],
            [ausklammerungMitIndex],
          ),
        ).toBe(0);
      });

      it("Ausklammerung genau im Januar des Vorjahres verschiebt von auf das Jahr davor", () => {
        // Ausklammerung 2024-01-01..2024-01-01 → 2024 betroffen → von = 2023-01-01
        const ausklammerungen = [ausklammerung("2024-01-01", "2024-01-01")];
        // 2021-12-01 + 14M = 2023-02-01 > 2023-01-01 → relevant (wäre ohne Ausklammerung nicht)
        expect(
          fn(geburtsdatum, [geschwisterkind("2021-12-01")], ausklammerungen),
        ).toBe(0);
      });
    });
  });
}
