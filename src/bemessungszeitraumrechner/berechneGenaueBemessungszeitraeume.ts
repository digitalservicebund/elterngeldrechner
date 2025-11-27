import { Ausklammerung } from "./Ausklammerung";
import {
  Bemessungszeitraum,
  Zeitabschnitt,
  ZeitabschnittArt,
} from "./Bemessungszeitraum";
import { Einklammerung, Monatseintrag } from "./Einklammerung";
import { Erwerbstaetigkeit } from "./Erwerbstaetigkeit";

/**
 * Berechnet den genauen Bemessungszeitraum (BMZ) basierend auf der Erwerbstätigkeit.
 *
 * Diese Funktion delegiert die komplexe Berechnungslogik an die spezialisierten
 * Funktionen für Selbstständige oder Nicht-Selbstständige.
 *
 * Beide Berechnungsarten berücksichtigen die übergebenen Ausklammerungszeiträume,
 * wenden jedoch unterschiedliche fachliche Regeln an (Verschiebung
 * eines Kalenderjahres bzw. Verschiebung einzelner Monate).
 *
 * Im Fall der Selbstständigen wird der Bemessungszeitraum durch einen
 * auszuklammernden Zeitraum maximal um ein Kalenderjahr verschoben,
 * da weitere Verschiebungen in der Regel nur in Sonderfällen möglich sind.
 *
 * @param {Date} geburtsdatum - Das Geburtsdatum des Kindes.
 * @param {Erwerbstaetigkeit} erwerbstaetigkeit - Der Erwerbsstatus (SELBSTSTAENDIG oder nicht SELBSTSTAENDIG), der die Berechnungslogik bestimmt.
 * @param {Ausklammerung[]} auszuklammerndeZeitraeume - Eine Liste von Zeiträumen, die bei der Berechnung übersprungen werden sollen.
 * @returns {Bemessungszeitraum} Das vollständige, genaue BMZ-Objekt.
 */
export function berechneGenauenBemessungszeitraum(
  geburtsdatum: Date,
  erwerbstaetigkeit: Erwerbstaetigkeit,
  auszuklammerndeZeitraeume: Ausklammerung[],
): Bemessungszeitraum {
  return erwerbstaetigkeit === Erwerbstaetigkeit.SELBSTSTAENDIG
    ? getGenauenSelbststaendigenBemessungszeitraum(
        geburtsdatum,
        auszuklammerndeZeitraeume,
      )
    : getGenauenNichtSelbststaendigenBemessungszeitraum(
        geburtsdatum,
        auszuklammerndeZeitraeume,
      );
}

/** Logik und Helper für Selbstständige */

/**
 * Berechnet den genauen Bemessungszeitraum (BMZ) für Selbstständige.
 *
 * Die Logik basiert auf dem Kalenderjahr vor dem Geburtsjahr.
 * Wenn Ausklammerungsgründe (z.B. Krankheit, Mutterschutz) in diesem
 * Standard-BMZ-Jahr (Kalenderjahr vor Geburt) liegen, wird der BMZ
 * komplett auf das davorliegende Kalenderjahr verschoben.
 *
 * Die Möglichkeit, noch weitere Jahre zurück zu gehen, ist nicht
 * implementiert.
 *
 * @private
 * @param {Date} geburtsdatum - Das Geburtsdatum des Kindes.
 * @param {Ausklammerung[]} auszuklammerndeZeitraeume - Eine Liste von Zeiträumen, die zur Prüfung der Verschiebung herangezogen werden.
 * @returns {Bemessungszeitraum} Das vollständige BZR-Objekt.
 */
function getGenauenSelbststaendigenBemessungszeitraum(
  geburtsdatum: Date,
  auszuklammerndeZeitraeume: Ausklammerung[],
): Bemessungszeitraum {
  const jahrDesBemessungszeitraums =
    ermittleJahrDesBemessungszeitraumsFuerSelbststaendige(
      geburtsdatum.getFullYear(),
      auszuklammerndeZeitraeume,
    );

  const monate = Array.from({ length: 12 }, (_, i) => ({
    monatsIndex: i,
    monatsDatum: new Date(Date.UTC(jahrDesBemessungszeitraums, i, 1)),
  }));

  const einklammerung: Einklammerung = {
    von: new Date(Date.UTC(jahrDesBemessungszeitraums, 0, 1)),
    bis: new Date(Date.UTC(jahrDesBemessungszeitraums, 11, 31)),
    monate,
  };

  const einklammerungAbschnitt: Zeitabschnitt = {
    art: ZeitabschnittArt.einklammerung,
    zeitabschnitt: einklammerung,
  };
  const ausklammerungAbschnitte: Zeitabschnitt[] =
    auszuklammerndeZeitraeume.map((zeitabschnitt) => ({
      art: ZeitabschnittArt.ausklammerung,
      zeitabschnitt,
    }));

  const alleAbschnitte = [einklammerungAbschnitt, ...ausklammerungAbschnitte];
  const sortierteAbschnitte = alleAbschnitte.toSorted(
    (a, b) => a.zeitabschnitt.von.getTime() - b.zeitabschnitt.von.getTime(),
  );

  return {
    startdatum: einklammerung.von,
    enddatum: einklammerung.bis,
    zeitabschnitte: sortierteAbschnitte,
  };
}

/**
 * Ermittelt das korrekte Jahr des Bemessungszeitraums für Selbstständige
 * indem es so lange ein Jahr zurück geht bis kein Ausklammerungszeitraum
 * mehr vorliegt.
 */
function ermittleJahrDesBemessungszeitraumsFuerSelbststaendige(
  geburtsjahr: number,
  auszuklammerndeZeitraeume: Ausklammerung[],
): number {
  const findeJahr = (year: number): number => {
    const mussVerschobenWerden = auszuklammerndeZeitraeume.some((zeitraum) => {
      return (
        zeitraum.von <= new Date(Date.UTC(year, 11, 31)) &&
        zeitraum.bis >= new Date(Date.UTC(year, 0, 1))
      );
    });

    if (mussVerschobenWerden) {
      return findeJahr(year - 1);
    }

    return year;
  };

  return findeJahr(geburtsjahr - 1);
}

/** Logik und Helper für Nicht-Selbstständige */

/**
 * Berechnet den genauen Bemessungszeitraum (BMZ) für Nicht-Selbstständige.
 *
 * Dieser Prozess ist komplexer als der genaue BMZ von Selbstständigen:
 * 1. Es werden die ersten 12 Kalendermonate rückwärts ab dem Monat vor der Geburt
 * *  gesucht, in denen kein Ausklammerungsgrund vorliegt.
 * 2. Diese 12 gefundenen und möglicherweise nicht zusammenhängenden Monate werden gruppiert.
 * 3. Alle Ausklammerungen und Einklammerungen werden sortiert zurückgegeben.
 *
 * @private
 * @param {Date} geburtsdatum - Das Geburtsdatum des Kindes.
 * @param {Ausklammerung[]} auszuklammerndeZeitraeume - Eine Liste von Zeiträumen, die übersprungen werden sollen.
 * @returns {Bemessungszeitraum} Das vollständige BMZ-Objekt.
 * @throws {Error} Wirft einen Fehler, wenn Einklammerungs-Array leer sein sollte (darf nicht vorkommen).
 */
function getGenauenNichtSelbststaendigenBemessungszeitraum(
  geburtsdatum: Date,
  auszuklammerndeZeitraeume: Ausklammerung[],
): Bemessungszeitraum {
  const monate = berechneMonateFuerGenauenBemessungszeitraum(
    geburtsdatum,
    auszuklammerndeZeitraeume,
  );
  const monatsGruppen = gruppiereMonatseintraege(monate);

  const einklammerungAbschnitte: Zeitabschnitt[] = monatsGruppen
    .map((gruppe) => {
      const startElement = gruppe[0];
      const endElement = gruppe[gruppe.length - 1];

      if (!startElement || !endElement) {
        return null;
      }

      return {
        art: ZeitabschnittArt.einklammerung,
        zeitabschnitt: {
          von: startElement.monatsDatum,
          bis: new Date(
            Date.UTC(
              endElement.monatsDatum.getFullYear(),
              endElement.monatsDatum.getMonth() + 1,
              0,
            ),
          ),
          monate: gruppe,
        },
      };
    })
    .filter(Boolean) as Zeitabschnitt[];

  const ausklammerungAbschnitte: Zeitabschnitt[] =
    auszuklammerndeZeitraeume.map((zeitabschnitt) => ({
      art: ZeitabschnittArt.ausklammerung,
      zeitabschnitt,
    }));

  const alleAbschnitte: Zeitabschnitt[] = [
    ...einklammerungAbschnitte,
    ...ausklammerungAbschnitte,
  ];
  const sortierteAbschnitte = alleAbschnitte.toSorted(
    (a, b) => a.zeitabschnitt.von.getTime() - b.zeitabschnitt.von.getTime(),
  );

  const ersteEinklammerung = einklammerungAbschnitte[0];
  const letzteEinklammerung =
    einklammerungAbschnitte[einklammerungAbschnitte.length - 1];

  if (!ersteEinklammerung || !letzteEinklammerung) {
    throw new Error(
      "Logikfehler: Einklammerungs-Array ist leer, obwohl Monate gefunden wurden.",
    );
  }

  const startdatum = (ersteEinklammerung.zeitabschnitt as Einklammerung).von;
  const enddatum = (letzteEinklammerung.zeitabschnitt as Einklammerung).bis;

  return {
    startdatum,
    enddatum,
    zeitabschnitte: sortierteAbschnitte,
  };
}

/**
 * Definiert, wie viele Jahre (ab dem Geburtsjahr) maximal
 * rückwärts nach gültigen Monaten gesucht werden darf.
 * Ab diesem Zeitpunkt werden ausgeklammerte Monate beim
 * Erstellen des Arrays aus 12 Monatseinträgen nicht mehr
 * berücksichtigt.
 */
const MAX_SEARCH_YEARS = 10;

/**
 * Ermittelt die 12 relevanten (nicht ausgeklammerten) Monate für den BMZ.
 * Durchsucht die Monate rückwärts ab dem Vormonat der Geburt.
 * Gibt ein sortiertes Array aus 12 Monatseinträgen zurück.
 */
function berechneMonateFuerGenauenBemessungszeitraum(
  geburtsdatum: Date,
  auszuklammerndeZeitraeume: Ausklammerung[],
): Monatseintrag[] {
  const monateDateObjekte: Date[] = [];

  const fruehestesSuchDatum = new Date(
    Date.UTC(
      geburtsdatum.getFullYear() - MAX_SEARCH_YEARS,
      geburtsdatum.getMonth(),
      1,
    ),
  );

  let current = new Date(
    Date.UTC(geburtsdatum.getFullYear(), geburtsdatum.getMonth() - 1, 1),
  );

  while (monateDateObjekte.length < 12 && current >= fruehestesSuchDatum) {
    const monthStart = new Date(
      Date.UTC(current.getFullYear(), current.getMonth(), 1),
    );
    const monthEnd = new Date(
      Date.UTC(current.getFullYear(), current.getMonth() + 1, 0),
    );

    const istAusgeklammert = auszuklammerndeZeitraeume.some(
      ({ von, bis }) => von <= monthEnd && bis >= monthStart,
    );

    if (!istAusgeklammert) {
      monateDateObjekte.push(monthStart);
    }
    current = new Date(
      Date.UTC(current.getFullYear(), current.getMonth() - 1, 1),
    );
  }

  if (monateDateObjekte.length < 12) {
    while (monateDateObjekte.length < 12) {
      monateDateObjekte.push(
        new Date(Date.UTC(current.getFullYear(), current.getMonth(), 1)),
      );
      current = new Date(
        Date.UTC(current.getFullYear(), current.getMonth() - 1, 1),
      );
    }
  }

  const sortierteMonate = monateDateObjekte.toSorted(
    (a, b) => a.getTime() - b.getTime(),
  );

  return sortierteMonate.map((monatsDatum, index) => {
    return {
      monatsIndex: index,
      monatsDatum,
    };
  });
}

/**
 * Gruppiert ein sortiertes Array von Monatseinträgen in zusammenhängende Blöcke.
 * (z.B. [Jan, Feb, Apr] -> [[Jan, Feb], [Apr]])
 */
function gruppiereMonatseintraege(monate: Monatseintrag[]): Monatseintrag[][] {
  return monate.reduce((acc, aktuellerMonat) => {
    const letzteGruppe = acc[acc.length - 1];

    if (!letzteGruppe) {
      return [[aktuellerMonat]];
    }

    const letzterMonatInGruppe = letzteGruppe[letzteGruppe.length - 1];

    if (!letzterMonatInGruppe) {
      acc.push([aktuellerMonat]);
      return acc;
    }

    const letztesDatum = letzterMonatInGruppe.monatsDatum;
    const aktuellesDatum = aktuellerMonat.monatsDatum;

    const differenzInMonaten =
      aktuellesDatum.getFullYear() * 12 +
      aktuellesDatum.getMonth() -
      (letztesDatum.getFullYear() * 12 + letztesDatum.getMonth());

    if (differenzInMonaten === 1) {
      letzteGruppe.push(aktuellerMonat);
    } else {
      acc.push([aktuellerMonat]);
    }

    return acc;
  }, [] as Monatseintrag[][]);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("berechneMonateFuerGenauenBemessungszeitraum", () => {
    /**
     * Jahr:               |---------------------- 2024 --------------------|---------------------- 2025 ----------------------|
     * Monat:              |[01][02][03][04][05][06][07][08][09][10][11][12]|[01][02][03][04][05][06][07][08][09][10][11][12]  |
     * Ausklammerungen:    |                                                |                                                  |
     * Bemessungszeitraum: |                                     XX  XX  XX | XX  XX  XX  XX  XX  XX  XX  XX  XX               |
     */
    it("returns 01.10.24 - 01.09.25 (12) if Geburtsdatum is the 15.10.25 and no Ausklammerungen", () => {
      const geburtsdatum = new Date("2025-10-15T00:00:00.000Z");
      const ausklammerungen: Ausklammerung[] = [];

      const monate = berechneMonateFuerGenauenBemessungszeitraum(
        geburtsdatum,
        ausklammerungen,
      );

      expect(monate).toEqual([
        {
          monatsDatum: new Date("2024-10-01T00:00:00.000Z"),
          monatsIndex: 0,
        },
        {
          monatsDatum: new Date("2024-11-01T00:00:00.000Z"),
          monatsIndex: 1,
        },
        {
          monatsDatum: new Date("2024-12-01T00:00:00.000Z"),
          monatsIndex: 2,
        },
        {
          monatsDatum: new Date("2025-01-01T00:00:00.000Z"),
          monatsIndex: 3,
        },
        {
          monatsDatum: new Date("2025-02-01T00:00:00.000Z"),
          monatsIndex: 4,
        },
        {
          monatsDatum: new Date("2025-03-01T00:00:00.000Z"),
          monatsIndex: 5,
        },
        {
          monatsDatum: new Date("2025-04-01T00:00:00.000Z"),
          monatsIndex: 6,
        },
        {
          monatsDatum: new Date("2025-05-01T00:00:00.000Z"),
          monatsIndex: 7,
        },
        {
          monatsDatum: new Date("2025-06-01T00:00:00.000Z"),
          monatsIndex: 8,
        },
        {
          monatsDatum: new Date("2025-07-01T00:00:00.000Z"),
          monatsIndex: 9,
        },
        {
          monatsDatum: new Date("2025-08-01T00:00:00.000Z"),
          monatsIndex: 10,
        },
        {
          monatsDatum: new Date("2025-09-01T00:00:00.000Z"),
          monatsIndex: 11,
        },
      ]);
    });

    /**
     * Jahr:               |---------------------- 2024 --------------------|---------------------- 2025 ----------------------|
     * Monat:              |[01][02][03][04][05][06][07][08][09][10][11][12]|[01][02][03][04][05][06][07][08][09][10][11][12]  |
     * Ausklammerungen:    |                                                |                 XX                               |
     * Bemessungszeitraum: |                                 XX  XX  XX  XX | XX  XX  XX  XX      XX  XX  XX  XX               |
     */
    it("returns 01.09.24 - 01.04.25 (8) and 01.06.25 - 01.09.25 (4) if Geburtsdatum is the 15.10.25 and Ausklammerungen contains 01.05.25 - 12.05.25", () => {
      const geburtsdatum = new Date("2025-10-15T00:00:00.000Z");
      const ausklammerungen: Ausklammerung[] = [
        {
          von: new Date("2025-05-01T00:00:00.000Z"),
          bis: new Date("2025-05-12T00:00:00.000Z"),
          beschreibung: "Test",
        },
      ];

      const monate = berechneMonateFuerGenauenBemessungszeitraum(
        geburtsdatum,
        ausklammerungen,
      );

      expect(monate).toEqual([
        {
          monatsDatum: new Date("2024-09-01T00:00:00.000Z"),
          monatsIndex: 0,
        },
        {
          monatsDatum: new Date("2024-10-01T00:00:00.000Z"),
          monatsIndex: 1,
        },
        {
          monatsDatum: new Date("2024-11-01T00:00:00.000Z"),
          monatsIndex: 2,
        },
        {
          monatsDatum: new Date("2024-12-01T00:00:00.000Z"),
          monatsIndex: 3,
        },
        {
          monatsDatum: new Date("2025-01-01T00:00:00.000Z"),
          monatsIndex: 4,
        },
        {
          monatsDatum: new Date("2025-02-01T00:00:00.000Z"),
          monatsIndex: 5,
        },
        {
          monatsDatum: new Date("2025-03-01T00:00:00.000Z"),
          monatsIndex: 6,
        },
        {
          monatsDatum: new Date("2025-04-01T00:00:00.000Z"),
          monatsIndex: 7,
        },
        {
          monatsDatum: new Date("2025-06-01T00:00:00.000Z"),
          monatsIndex: 8,
        },
        {
          monatsDatum: new Date("2025-07-01T00:00:00.000Z"),
          monatsIndex: 9,
        },
        {
          monatsDatum: new Date("2025-08-01T00:00:00.000Z"),
          monatsIndex: 10,
        },
        {
          monatsDatum: new Date("2025-09-01T00:00:00.000Z"),
          monatsIndex: 11,
        },
      ]);
    });

    /**
     * Jahr:               ---------------------- 2024 --------------------|---------------------- 2025 ----------------------
     * Monat:              [01][02][03][04][05][06][07][08][09][10][11][12]|[01][02][03][04][05][06][07][08][09][10][11][12]
     * Ausklammerungen:                                                    |                 XX
     * Bemessungszeitraum:                                  XX  XX  XX  XX | XX  XX  XX  XX      XX  XX  XX  XX
     */
    it("returns 01.09.24 - 01.04.25 (8) and 01.06.25 - 01.09.25 (4) if Geburtsdatum is the 15.10.25 and Ausklammerungen contains 01.05.25 - 12.05.25 and 15.05.25 - 17.05.25", () => {
      const geburtsdatum = new Date("2025-10-15T00:00:00.000Z");
      const ausklammerungen: Ausklammerung[] = [
        {
          von: new Date("2025-05-01T00:00:00.000Z"),
          bis: new Date("2025-05-12T00:00:00.000Z"),
          beschreibung: "Test",
        },
        {
          von: new Date("2025-05-15T00:00:00.000Z"),
          bis: new Date("2025-05-17T00:00:00.000Z"),
          beschreibung: "Test",
        },
      ];

      const monate = berechneMonateFuerGenauenBemessungszeitraum(
        geburtsdatum,
        ausklammerungen,
      );

      expect(monate).toEqual([
        {
          monatsDatum: new Date("2024-09-01T00:00:00.000Z"),
          monatsIndex: 0,
        },
        {
          monatsDatum: new Date("2024-10-01T00:00:00.000Z"),
          monatsIndex: 1,
        },
        {
          monatsDatum: new Date("2024-11-01T00:00:00.000Z"),
          monatsIndex: 2,
        },
        {
          monatsDatum: new Date("2024-12-01T00:00:00.000Z"),
          monatsIndex: 3,
        },
        {
          monatsDatum: new Date("2025-01-01T00:00:00.000Z"),
          monatsIndex: 4,
        },
        {
          monatsDatum: new Date("2025-02-01T00:00:00.000Z"),
          monatsIndex: 5,
        },
        {
          monatsDatum: new Date("2025-03-01T00:00:00.000Z"),
          monatsIndex: 6,
        },
        {
          monatsDatum: new Date("2025-04-01T00:00:00.000Z"),
          monatsIndex: 7,
        },
        {
          monatsDatum: new Date("2025-06-01T00:00:00.000Z"),
          monatsIndex: 8,
        },
        {
          monatsDatum: new Date("2025-07-01T00:00:00.000Z"),
          monatsIndex: 9,
        },
        {
          monatsDatum: new Date("2025-08-01T00:00:00.000Z"),
          monatsIndex: 10,
        },
        {
          monatsDatum: new Date("2025-09-01T00:00:00.000Z"),
          monatsIndex: 11,
        },
      ]);
    });
  });

  describe("getGenauenSelbststaendigenBemessungszeitraum", () => {
    it("returns the previous year as the Bemessungszeitraum for Selbstaendig when no Ausklammerung applies", () => {
      const geburtsdatum = new Date("2025-10-15T00:00:00.000Z");
      const auszuklammerndeZeitraeume: Ausklammerung[] = [];

      const result = getGenauenSelbststaendigenBemessungszeitraum(
        geburtsdatum,
        auszuklammerndeZeitraeume,
      );

      expect(result.startdatum).toEqual(new Date("2024-01-01T00:00:00.000Z"));
      expect(result.enddatum).toEqual(new Date("2024-12-31T00:00:00.000Z"));
    });

    it("returns the previous year as the Bemessungszeitraum for Selbstaendig when Ausklammerung applies to the year before the previous year", () => {
      const geburtsdatum = new Date("2025-10-15T00:00:00.000Z");
      const auszuklammerndeZeitraeume: Ausklammerung[] = [
        {
          von: new Date("2023-05-02T00:00:00.000Z"),
          bis: new Date("2023-05-03T00:00:00.000Z"),
          beschreibung: "Test",
        },
      ];

      const result = getGenauenSelbststaendigenBemessungszeitraum(
        geburtsdatum,
        auszuklammerndeZeitraeume,
      );

      expect(result.startdatum).toEqual(new Date("2024-01-01T00:00:00.000Z"));
      expect(result.enddatum).toEqual(new Date("2024-12-31T00:00:00.000Z"));
    });

    it("returns the year before the previous year as the Bemessungszeitraum for Selbstaendig when exactly one Ausklammerung applies in the previous year", () => {
      const geburtsdatum = new Date("2025-10-15T00:00:00.000Z");

      const auszuklammerndeZeitraeume: Ausklammerung[] = [
        {
          von: new Date("2024-05-02T00:00:00.000Z"),
          bis: new Date("2024-05-03T00:00:00.000Z"),
          beschreibung: "Test",
        },
      ];

      const result = getGenauenSelbststaendigenBemessungszeitraum(
        geburtsdatum,
        auszuklammerndeZeitraeume,
      );

      expect(result.startdatum).toEqual(new Date("2023-01-01T00:00:00.000Z"));
      expect(result.enddatum).toEqual(new Date("2023-12-31T00:00:00.000Z"));
    });

    it("returns the year t–3 as the Bemessungszeitraum for Selbstaendig when Ausklammerungen apply in both the previous year and the year before that", () => {
      const geburtsdatum = new Date("2025-10-15T00:00:00.000Z");

      const auszuklammerndeZeitraeume: Ausklammerung[] = [
        {
          von: new Date("2024-05-02T00:00:00.000Z"),
          bis: new Date("2024-05-03T00:00:00.000Z"),
          beschreibung: "Test",
        },
        {
          von: new Date("2023-05-02T00:00:00.000Z"),
          bis: new Date("2023-05-03T00:00:00.000Z"),
          beschreibung: "Test",
        },
      ];

      const result = getGenauenSelbststaendigenBemessungszeitraum(
        geburtsdatum,
        auszuklammerndeZeitraeume,
      );

      expect(result.startdatum).toEqual(new Date("2022-01-01T00:00:00.000Z"));
      expect(result.enddatum).toEqual(new Date("2022-12-31T00:00:00.000Z"));
    });
  });

  describe("berechneGenauenBemessungszeitraum", () => {
    it("returns an bemessungszeitraum (BMZ) object for either selbststaendig or nicht-selbststaendig without ausklammerung which contains one zeitabschnitt as an array with 12 elements", () => {
      const geburtsdatum = new Date("2025-10-15T00:00:00.000Z");
      const erwerbstaetigkeit = Erwerbstaetigkeit.SELBSTSTAENDIG;
      const auszuklammerndeZeitraeume: Ausklammerung[] = [];

      const result = berechneGenauenBemessungszeitraum(
        geburtsdatum,
        erwerbstaetigkeit,
        auszuklammerndeZeitraeume,
      );

      expect(result).toEqual(
        expect.objectContaining({
          startdatum: expect.any(Date) as Date,
          enddatum: expect.any(Date) as Date,
          zeitabschnitte: expect.any(Array) as Zeitabschnitt[],
        }),
      );

      const einklammerung = result.zeitabschnitte[0]!
        .zeitabschnitt as Einklammerung;
      expect(einklammerung.monate).toBeInstanceOf(Array);
      expect(einklammerung.monate).toHaveLength(12);
    });
  });

  describe("berechneGenauenBemessungszeitraum for selbststaendige", () => {
    const erwerbstaetigkeit = Erwerbstaetigkeit.SELBSTSTAENDIG;

    it("returns an bemessungszeitraum (BMZ) object for either selbststaendig or nicht-selbststaendig without ausklammerung which contains one zeitabschnitt as an array with 12 elements", () => {
      const geburtsdatum = new Date("2025-10-15T00:00:00.000Z");
      const auszuklammerndeZeitraeume: Ausklammerung[] = [];

      const result = berechneGenauenBemessungszeitraum(
        geburtsdatum,
        erwerbstaetigkeit,
        auszuklammerndeZeitraeume,
      );

      expect(result).toEqual(
        expect.objectContaining({
          startdatum: expect.any(Date) as Date,
          enddatum: expect.any(Date) as Date,
          zeitabschnitte: expect.any(Array) as Zeitabschnitt[],
        }),
      );

      const einklammerung = result.zeitabschnitte[0]!
        .zeitabschnitt as Einklammerung;
      expect(einklammerung.monate).toBeInstanceOf(Array);
      expect(einklammerung.monate).toHaveLength(12);
    });

    it("returns the correct BMZ without ausklammerung", () => {
      const geburtsdatum = new Date("2025-11-13T00:00:00.000Z");
      const auszuklammerndeZeitraeume: Ausklammerung[] = [];

      const result = berechneGenauenBemessungszeitraum(
        geburtsdatum,
        erwerbstaetigkeit,
        auszuklammerndeZeitraeume,
      );

      expect(result.startdatum).toEqual(new Date("2024-01-01T00:00:00.000Z"));
      expect(result.enddatum).toEqual(new Date("2024-12-31T00:00:00.000Z"));

      expect(result.zeitabschnitte[0]).toBeDefined();

      const einklammerung = result.zeitabschnitte[0]!
        .zeitabschnitt as Einklammerung;
      expect(einklammerung.monate).toBeInstanceOf(Array);
      expect(einklammerung.monate[0]).toEqual({
        monatsDatum: new Date("2024-01-01T00:00:00.000Z"),
        monatsIndex: 0,
      });
    });

    it("returns the correct BMZ with mutterschaftsleistungen", () => {
      const geburtsdatum = new Date("2025-11-13T00:00:00.000Z");
      const auszuklammerndeZeitraeume: Ausklammerung[] = [
        {
          von: new Date("2025-10-02T00:00:00.000Z"),
          bis: new Date("2026-01-08T00:00:00.000Z"),
          beschreibung: "Mutterschaftsleistungen für dieses Kind",
        },
      ];

      const result = berechneGenauenBemessungszeitraum(
        geburtsdatum,
        erwerbstaetigkeit,
        auszuklammerndeZeitraeume,
      );

      expect(result.startdatum).toEqual(new Date("2024-01-01T00:00:00.000Z"));
      expect(result.enddatum).toEqual(new Date("2024-12-31T00:00:00.000Z"));

      expect(result.zeitabschnitte[0]).toBeDefined();
      expect(result.zeitabschnitte[0]!.art).toEqual(
        ZeitabschnittArt.einklammerung,
      );

      const einklammerung = result.zeitabschnitte[0]!
        .zeitabschnitt as Einklammerung;

      expect(einklammerung.monate).toBeInstanceOf(Array);
      expect(einklammerung.monate[0]).toEqual({
        monatsDatum: new Date("2024-01-01T00:00:00.000Z"),
        monatsIndex: 0,
      });

      expect(result.zeitabschnitte[1]).toBeDefined();
      expect(result.zeitabschnitte[1]!.art).toEqual(
        ZeitabschnittArt.ausklammerung,
      );

      const ausklammerung = result.zeitabschnitte[1]!
        .zeitabschnitt as Ausklammerung;

      expect(ausklammerung.von).toEqual(new Date("2025-10-02T00:00:00.000Z"));
    });

    it("returns the correct BMZ with mutterschaftsleistungen overlapping a year", () => {
      const geburtsdatum = new Date("2026-01-01T00:00:00.000Z");
      const auszuklammerndeZeitraeume: Ausklammerung[] = [
        {
          von: new Date("2025-11-11T00:00:00.000Z"),
          bis: new Date("2026-02-26T00:00:00.000Z"),
          beschreibung: "Mutterschaftsleistungen für dieses Kind",
        },
      ];

      const result = berechneGenauenBemessungszeitraum(
        geburtsdatum,
        erwerbstaetigkeit,
        auszuklammerndeZeitraeume,
      );

      expect(result.startdatum).toEqual(new Date("2024-01-01T00:00:00.000Z"));
      expect(result.enddatum).toEqual(new Date("2024-12-31T00:00:00.000Z"));

      expect(result.zeitabschnitte[0]).toBeDefined();
      expect(result.zeitabschnitte[0]!.art).toEqual(
        ZeitabschnittArt.einklammerung,
      );

      const einklammerung = result.zeitabschnitte[0]!
        .zeitabschnitt as Einklammerung;

      expect(einklammerung.monate).toBeInstanceOf(Array);
      expect(einklammerung.monate[11]).toEqual({
        monatsDatum: new Date("2024-12-01T00:00:00.000Z"),
        monatsIndex: 11,
      });

      expect(result.zeitabschnitte[1]).toBeDefined();
      expect(result.zeitabschnitte[1]!.art).toEqual(
        ZeitabschnittArt.ausklammerung,
      );

      const ausklammerung = result.zeitabschnitte[1]!
        .zeitabschnitt as Ausklammerung;

      expect(ausklammerung.beschreibung).toEqual(
        "Mutterschaftsleistungen für dieses Kind",
      );
    });

    it("returns the correct BMZ with mutterschaftsleistungen and sickness", () => {
      const geburtsdatum = new Date("2026-02-12T00:00:00.000Z");
      const auszuklammerndeZeitraeume: Ausklammerung[] = [
        {
          von: new Date("2026-01-10T00:00:00.000Z"),
          bis: new Date("2026-04-09T00:00:00.000Z"),
          beschreibung: "Mutterschaftsleistungen für dieses Kind",
        },
        {
          von: new Date("2025-08-10T00:00:00.000Z"),
          bis: new Date("2025-08-20T00:00:00.000Z"),
          beschreibung: "Schwangerschaftsbedingte Krankheit",
        },
      ];

      const result = berechneGenauenBemessungszeitraum(
        geburtsdatum,
        erwerbstaetigkeit,
        auszuklammerndeZeitraeume,
      );

      expect(result.startdatum).toEqual(new Date("2024-01-01T00:00:00.000Z"));
      expect(result.enddatum).toEqual(new Date("2024-12-31T00:00:00.000Z"));

      expect(result.zeitabschnitte).toBeInstanceOf(Array);
      expect(result.zeitabschnitte).toHaveLength(3);

      expect(result.zeitabschnitte[0]).toBeDefined();
      expect(result.zeitabschnitte[0]!.art).toEqual(
        ZeitabschnittArt.einklammerung,
      );

      const einklammerung = result.zeitabschnitte[0]!
        .zeitabschnitt as Einklammerung;

      expect(einklammerung.monate).toBeInstanceOf(Array);
      expect(einklammerung.monate[5]).toEqual({
        monatsDatum: new Date("2024-06-01T00:00:00.000Z"),
        monatsIndex: 5,
      });

      expect(result.zeitabschnitte[1]).toBeDefined();
      expect(result.zeitabschnitte[1]!.art).toEqual(
        ZeitabschnittArt.ausklammerung,
      );

      const ausklammerung = result.zeitabschnitte[1]!
        .zeitabschnitt as Ausklammerung;

      expect(ausklammerung.beschreibung).toEqual(
        "Schwangerschaftsbedingte Krankheit",
      );

      expect(result.zeitabschnitte[2]).toBeDefined();
      expect(result.zeitabschnitte[2]!.art).toEqual(
        ZeitabschnittArt.ausklammerung,
      );

      const ausklammerung2 = result.zeitabschnitte[2]!
        .zeitabschnitt as Ausklammerung;

      expect(ausklammerung2.beschreibung).toEqual(
        "Mutterschaftsleistungen für dieses Kind",
      );
    });
  });

  describe("berechneGenauenBemessungszeitraum for nicht-selbststaendige", () => {
    const erwerbstaetigkeit = Erwerbstaetigkeit.ANGESTELLT;

    it("returns the correct BMZ without ausklammerung", () => {
      const geburtsdatum = new Date("2025-11-13T00:00:00.000Z");
      const auszuklammerndeZeitraeume: Ausklammerung[] = [];

      const result = berechneGenauenBemessungszeitraum(
        geburtsdatum,
        erwerbstaetigkeit,
        auszuklammerndeZeitraeume,
      );

      expect(result.startdatum).toEqual(new Date("2024-11-01T00:00:00.000Z"));
      expect(result.enddatum).toEqual(new Date("2025-10-31T00:00:00.000Z"));

      expect(result.zeitabschnitte[0]).toBeDefined();

      const einklammerung = result.zeitabschnitte[0]!
        .zeitabschnitt as Einklammerung;
      expect(einklammerung.monate).toBeInstanceOf(Array);
      expect(einklammerung.monate[0]).toEqual({
        monatsDatum: new Date("2024-11-01T00:00:00.000Z"),
        monatsIndex: 0,
      });
    });

    it("returns the correct BMZ with mutterschaftsleistungen", () => {
      const geburtsdatum = new Date("2025-11-13T00:00:00.000Z");
      const auszuklammerndeZeitraeume: Ausklammerung[] = [
        {
          von: new Date("2025-10-02T00:00:00.000Z"),
          bis: new Date("2026-01-08T00:00:00.000Z"),
          beschreibung: "Mutterschaftsleistungen für dieses Kind",
        },
      ];

      const result = berechneGenauenBemessungszeitraum(
        geburtsdatum,
        erwerbstaetigkeit,
        auszuklammerndeZeitraeume,
      );

      expect(result.startdatum).toEqual(new Date("2024-10-01T00:00:00.000Z"));
      expect(result.enddatum).toEqual(new Date("2025-09-30T00:00:00.000Z"));

      expect(result.zeitabschnitte[0]).toBeDefined();
      expect(result.zeitabschnitte[0]!.art).toEqual(
        ZeitabschnittArt.einklammerung,
      );

      const einklammerung = result.zeitabschnitte[0]!
        .zeitabschnitt as Einklammerung;

      expect(einklammerung.monate).toBeInstanceOf(Array);
      expect(einklammerung.monate[0]).toEqual({
        monatsDatum: new Date("2024-10-01T00:00:00.000Z"),
        monatsIndex: 0,
      });

      expect(result.zeitabschnitte[1]).toBeDefined();
      expect(result.zeitabschnitte[1]!.art).toEqual(
        ZeitabschnittArt.ausklammerung,
      );

      const ausklammerung = result.zeitabschnitte[1]!
        .zeitabschnitt as Ausklammerung;

      expect(ausklammerung.von).toEqual(new Date("2025-10-02T00:00:00.000Z"));
    });

    it("returns the correct BMZ with mutterschaftsleistungen and sickness", () => {
      const geburtsdatum = new Date("2025-11-13T00:00:00.000Z");
      const auszuklammerndeZeitraeume: Ausklammerung[] = [
        {
          von: new Date("2025-10-02T00:00:00.000Z"),
          bis: new Date("2026-01-08T00:00:00.000Z"),
          beschreibung: "Mutterschaftsleistungen für dieses Kind",
        },
        {
          von: new Date("2025-06-15T00:00:00.000Z"),
          bis: new Date("2025-08-02T00:00:00.000Z"),
          beschreibung: "Schwangerschaftsbedingte Krankheit",
        },
      ];

      const result = berechneGenauenBemessungszeitraum(
        geburtsdatum,
        erwerbstaetigkeit,
        auszuklammerndeZeitraeume,
      );

      expect(result.startdatum).toEqual(new Date("2024-07-01T00:00:00.000Z"));
      expect(result.enddatum).toEqual(new Date("2025-09-30T00:00:00.000Z"));

      expect(result.zeitabschnitte).toBeInstanceOf(Array);
      expect(result.zeitabschnitte).toHaveLength(4);

      expect(result.zeitabschnitte[0]).toBeDefined();
      expect(result.zeitabschnitte[0]!.art).toEqual(
        ZeitabschnittArt.einklammerung,
      );

      const einklammerung = result.zeitabschnitte[0]!
        .zeitabschnitt as Einklammerung;

      expect(einklammerung.monate).toBeInstanceOf(Array);
      expect(einklammerung.monate[1]).toEqual({
        monatsDatum: new Date("2024-08-01T00:00:00.000Z"),
        monatsIndex: 1,
      });

      expect(result.zeitabschnitte[1]).toBeDefined();
      expect(result.zeitabschnitte[1]!.art).toEqual(
        ZeitabschnittArt.ausklammerung,
      );

      const ausklammerung = result.zeitabschnitte[1]!
        .zeitabschnitt as Ausklammerung;

      expect(ausklammerung.beschreibung).toEqual(
        "Schwangerschaftsbedingte Krankheit",
      );

      expect(result.zeitabschnitte[2]).toBeDefined();
      expect(result.zeitabschnitte[2]!.art).toEqual(
        ZeitabschnittArt.einklammerung,
      );

      const einklammerung2 = result.zeitabschnitte[2]!
        .zeitabschnitt as Einklammerung;

      expect(einklammerung2.monate).toBeInstanceOf(Array);
      expect(einklammerung2.monate[0]).toEqual({
        monatsDatum: new Date("2025-09-01T00:00:00.000Z"),
        monatsIndex: 11,
      });

      expect(result.zeitabschnitte[3]).toBeDefined();
      expect(result.zeitabschnitte[3]!.art).toEqual(
        ZeitabschnittArt.ausklammerung,
      );

      const ausklammerung2 = result.zeitabschnitte[3]!
        .zeitabschnitt as Ausklammerung;

      expect(ausklammerung2.beschreibung).toEqual(
        "Mutterschaftsleistungen für dieses Kind",
      );
    });

    it("returns the correct BMZ with mutterschaftsleistungen, sickness and elterngeld for other child", () => {
      const geburtsdatum = new Date("2025-11-13T00:00:00.000Z");
      const auszuklammerndeZeitraeume: Ausklammerung[] = [
        {
          von: new Date("2025-10-02T00:00:00.000Z"),
          bis: new Date("2026-01-08T00:00:00.000Z"),
          beschreibung: "Mutterschaftsleistungen für dieses Kind",
        },
        {
          von: new Date("2025-06-15T00:00:00.000Z"),
          bis: new Date("2025-08-02T00:00:00.000Z"),
          beschreibung: "Schwangerschaftsbedingte Krankheit",
        },
        {
          von: new Date("2023-10-03T00:00:00.000Z"),
          bis: new Date("2024-10-03T00:00:00.000Z"),
          beschreibung: "Elterngeld für anderes Kind",
        },
      ];

      const result = berechneGenauenBemessungszeitraum(
        geburtsdatum,
        erwerbstaetigkeit,
        auszuklammerndeZeitraeume,
      );

      expect(result.startdatum).toEqual(new Date("2023-06-01T00:00:00.000Z"));
      expect(result.enddatum).toEqual(new Date("2025-09-30T00:00:00.000Z"));

      expect(result.zeitabschnitte).toBeInstanceOf(Array);
      expect(result.zeitabschnitte).toHaveLength(6);

      expect(result.zeitabschnitte[0]).toBeDefined();
      expect(result.zeitabschnitte[0]!.art).toEqual(
        ZeitabschnittArt.einklammerung,
      );

      const einklammerung = result.zeitabschnitte[0]!
        .zeitabschnitt as Einklammerung;

      expect(einklammerung.monate).toBeInstanceOf(Array);
      expect(einklammerung.monate[1]).toEqual({
        monatsDatum: new Date("2023-07-01T00:00:00.000Z"),
        monatsIndex: 1,
      });

      expect(result.zeitabschnitte[1]).toBeDefined();
      expect(result.zeitabschnitte[1]!.art).toEqual(
        ZeitabschnittArt.ausklammerung,
      );

      const ausklammerung = result.zeitabschnitte[1]!
        .zeitabschnitt as Ausklammerung;

      expect(ausklammerung.beschreibung).toEqual("Elterngeld für anderes Kind");

      expect(result.zeitabschnitte[2]).toBeDefined();
      expect(result.zeitabschnitte[2]!.art).toEqual(
        ZeitabschnittArt.einklammerung,
      );

      const einklammerung2 = result.zeitabschnitte[2]!
        .zeitabschnitt as Einklammerung;

      expect(einklammerung2.monate).toBeInstanceOf(Array);
      expect(einklammerung2.monate[0]).toEqual({
        monatsDatum: new Date("2024-11-01T00:00:00.000Z"),
        monatsIndex: 4,
      });

      expect(result.zeitabschnitte[3]).toBeDefined();
      expect(result.zeitabschnitte[3]!.art).toEqual(
        ZeitabschnittArt.ausklammerung,
      );

      const ausklammerung2 = result.zeitabschnitte[3]!
        .zeitabschnitt as Ausklammerung;

      expect(ausklammerung2.beschreibung).toEqual(
        "Schwangerschaftsbedingte Krankheit",
      );

      expect(result.zeitabschnitte[4]).toBeDefined();
      expect(result.zeitabschnitte[4]!.art).toEqual(
        ZeitabschnittArt.einklammerung,
      );

      const einklammerung3 = result.zeitabschnitte[4]!
        .zeitabschnitt as Einklammerung;

      expect(einklammerung3.monate).toBeInstanceOf(Array);
      expect(einklammerung3.monate[0]).toEqual({
        monatsDatum: new Date("2025-09-01T00:00:00.000Z"),
        monatsIndex: 11,
      });

      expect(result.zeitabschnitte[5]).toBeDefined();
      expect(result.zeitabschnitte[5]!.art).toEqual(
        ZeitabschnittArt.ausklammerung,
      );

      const ausklammerung3 = result.zeitabschnitte[5]!
        .zeitabschnitt as Ausklammerung;

      expect(ausklammerung3.beschreibung).toEqual(
        "Mutterschaftsleistungen für dieses Kind",
      );
    });

    it("returns the correct BMZ with mutterschaftsleistungen, sickness and mutterschaftsleistungen and elterngeld for other child", () => {
      const geburtsdatum = new Date("2025-11-13T00:00:00.000Z");
      const auszuklammerndeZeitraeume: Ausklammerung[] = [
        {
          von: new Date("2025-10-02T00:00:00.000Z"),
          bis: new Date("2026-01-08T00:00:00.000Z"),
          beschreibung: "Mutterschaftsleistungen für dieses Kind",
        },
        {
          von: new Date("2025-06-15T00:00:00.000Z"),
          bis: new Date("2025-08-02T00:00:00.000Z"),
          beschreibung: "Schwangerschaftsbedingte Krankheit",
        },
        {
          von: new Date("2023-10-03T00:00:00.000Z"),
          bis: new Date("2024-10-03T00:00:00.000Z"),
          beschreibung: "Elterngeld für anderes Kind",
        },
        {
          von: new Date("2023-08-22T00:00:00.000Z"),
          bis: new Date("2023-10-02T00:00:00.000Z"),
          beschreibung: "Mutterschaftsleistungen für anderes Kind",
        },
      ];

      const result = berechneGenauenBemessungszeitraum(
        geburtsdatum,
        erwerbstaetigkeit,
        auszuklammerndeZeitraeume,
      );

      expect(result.startdatum).toEqual(new Date("2023-04-01T00:00:00.000Z"));
      expect(result.enddatum).toEqual(new Date("2025-09-30T00:00:00.000Z"));

      expect(result.zeitabschnitte).toBeInstanceOf(Array);
      expect(result.zeitabschnitte).toHaveLength(7);

      expect(result.zeitabschnitte[0]).toBeDefined();
      expect(result.zeitabschnitte[0]!.art).toEqual(
        ZeitabschnittArt.einklammerung,
      );
      const einklammerung = result.zeitabschnitte[0]!
        .zeitabschnitt as Einklammerung;
      expect(einklammerung.monate).toBeInstanceOf(Array);
      expect(einklammerung.monate[2]).toEqual({
        monatsDatum: new Date("2023-06-01T00:00:00.000Z"),
        monatsIndex: 2,
      });

      expect(result.zeitabschnitte[1]).toBeDefined();
      expect(result.zeitabschnitte[1]!.art).toEqual(
        ZeitabschnittArt.ausklammerung,
      );
      const ausklammerung = result.zeitabschnitte[1]!
        .zeitabschnitt as Ausklammerung;
      expect(ausklammerung.beschreibung).toEqual(
        "Mutterschaftsleistungen für anderes Kind",
      );

      expect(result.zeitabschnitte[2]).toBeDefined();
      expect(result.zeitabschnitte[2]!.art).toEqual(
        ZeitabschnittArt.ausklammerung,
      );
      const ausklammerung2 = result.zeitabschnitte[2]!
        .zeitabschnitt as Ausklammerung;
      expect(ausklammerung2.beschreibung).toEqual(
        "Elterngeld für anderes Kind",
      );

      expect(result.zeitabschnitte[3]).toBeDefined();
      expect(result.zeitabschnitte[3]!.art).toEqual(
        ZeitabschnittArt.einklammerung,
      );
      const einklammerung2 = result.zeitabschnitte[3]!
        .zeitabschnitt as Einklammerung;
      expect(einklammerung2.monate).toBeInstanceOf(Array);
      expect(einklammerung2.monate[0]).toEqual({
        monatsDatum: new Date("2024-11-01T00:00:00.000Z"),
        monatsIndex: 4,
      });

      expect(result.zeitabschnitte[4]).toBeDefined();
      expect(result.zeitabschnitte[4]!.art).toEqual(
        ZeitabschnittArt.ausklammerung,
      );
      const ausklammerung3 = result.zeitabschnitte[4]!
        .zeitabschnitt as Ausklammerung;
      expect(ausklammerung3.beschreibung).toEqual(
        "Schwangerschaftsbedingte Krankheit",
      );

      expect(result.zeitabschnitte[5]).toBeDefined();
      expect(result.zeitabschnitte[5]!.art).toEqual(
        ZeitabschnittArt.einklammerung,
      );
      const einklammerung3 = result.zeitabschnitte[5]!
        .zeitabschnitt as Einklammerung;
      expect(einklammerung3.monate).toBeInstanceOf(Array);
      expect(einklammerung3.monate[0]).toEqual({
        monatsDatum: new Date("2025-09-01T00:00:00.000Z"),
        monatsIndex: 11,
      });

      expect(result.zeitabschnitte[6]).toBeDefined();
      expect(result.zeitabschnitte[6]!.art).toEqual(
        ZeitabschnittArt.ausklammerung,
      );
      const ausklammerung4 = result.zeitabschnitte[6]!
        .zeitabschnitt as Ausklammerung;
      expect(ausklammerung4.beschreibung).toEqual(
        "Mutterschaftsleistungen für dieses Kind",
      );
    });
  });
}
