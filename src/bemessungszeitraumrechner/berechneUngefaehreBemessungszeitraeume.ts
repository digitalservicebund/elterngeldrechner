import {
  Bemessungszeitraum,
  Zeitabschnitt,
  ZeitabschnittArt,
} from "./Bemessungszeitraum";
import { Einklammerung } from "./Einklammerung";
import { Erwerbstaetigkeit } from "./Erwerbstaetigkeit";

/**
 * Berechnet die zwei potenziell relevanten Bemessungszeiträume (BMZ) für eine
 * erste, grobe Einordnung (z.B. für eine UI-Vorauswahl).
 *
 * @param {Date} geburtsdatum Das Geburtsdatum des Kindes.
 * @returns {Bemessungszeitraum[]} Ein Array, das den BMZ für Selbstständige (Vorjahr)
 * und ein Fragment des BMZ für Nicht-Selbstständige (Januar bis Geburt bzw. Monat vor Geburt) enthält.
 */
export function berechneRelevanteBemessungszeitraeumeFuerErsteEinordnung(
  geburtsdatum: Date,
): Bemessungszeitraum[] {
  const anzahlMonate = geburtsdatum.getMonth();
  const monate = Array.from({ length: anzahlMonate }, (_, i) => ({
    monatsIndex: i,
    monatsDatum: new Date(Date.UTC(geburtsdatum.getFullYear(), i, 1)),
  }));

  const fragmentZeitabschnittNichtSelbststaendig: Einklammerung = {
    von: new Date(Date.UTC(geburtsdatum.getFullYear(), 0, 1)),
    bis: geburtsdatum,
    monate,
  };

  const fragmentBemessungszeitraumNichtSelbststaendig: Bemessungszeitraum = {
    startdatum: fragmentZeitabschnittNichtSelbststaendig.von,
    enddatum: fragmentZeitabschnittNichtSelbststaendig.bis,
    zeitabschnitte: [
      {
        art: ZeitabschnittArt.einklammerung,
        zeitabschnitt: fragmentZeitabschnittNichtSelbststaendig,
      },
    ],
  };

  return [
    getUngefaehrenSelbststaendigenBemessungszeitraum(geburtsdatum),
    fragmentBemessungszeitraumNichtSelbststaendig,
  ];
}

/**
 * Berechnet den ungefähren Bemessungszeitraum basierend auf der Erwerbstätigkeit.
 * Ungefähr ist er insofern, als dass diese Funktion keine Ausklammerungszeiträume
 * berücksichtigt.
 *
 * @param {Date} geburtsdatum Das Geburtsdatum des Kindes.
 * @param {Erwerbstaetigkeit} erwerbstaetigkeit Der Status der Erwerbstätigkeit.
 * @returns {Bemessungszeitraum} Der angenommene, ungefaehre Bemessungszeitraum ohne
 * Berücksichtigung von Ausklammerungen.
 */
export function berechneUngefaehrenBemessungszeitraum(
  geburtsdatum: Date,
  erwerbstaetigkeit: Erwerbstaetigkeit,
): Bemessungszeitraum {
  return erwerbstaetigkeit === Erwerbstaetigkeit.SELBSTSTAENDIG
    ? getUngefaehrenSelbststaendigenBemessungszeitraum(geburtsdatum)
    : getUngefaehrenNichtSelbststaendigenBemessungszeitraum(geburtsdatum);
}

/**
 * Ermittelt den BMZ für Selbstständige (Wirtschaftsjahr vor Geburt) ohne
 * Berücksichtigung von Ausklammerungen.
 * Regel: 1. Januar bis 31. Dezember des Jahres vor dem Geburtsjahr.
 */
const getUngefaehrenSelbststaendigenBemessungszeitraum = (
  geburtsdatum: Date,
): Bemessungszeitraum => {
  const monate = Array.from({ length: 12 }, (_, i) => ({
    monatsIndex: i,
    monatsDatum: new Date(Date.UTC(geburtsdatum.getFullYear() - 1, i, 1)),
  }));

  const zeitabschnitt = {
    von: new Date(Date.UTC(geburtsdatum.getFullYear() - 1, 0, 1)),
    bis: new Date(Date.UTC(geburtsdatum.getFullYear(), 0, 0)),
    monate,
  };
  return erstelleBemessungszeitraumAusEinklammerung(zeitabschnitt);
};

/**
 * Ermittelt den BMZ für Nicht-Selbstständige (12 Monate vor Geburtsmonat) ohne
 * Berücksichtigung von Ausklammerungen.
 * Regel: 1. Tag des Monats, der 12 Monate vor dem Geburtsmonat liegt,
 * bis zum letzten Tag des Monats vor dem Geburtsmonat.
 */
const getUngefaehrenNichtSelbststaendigenBemessungszeitraum = (
  geburtsdatum: Date,
): Bemessungszeitraum => {
  const startDatum = new Date(
    Date.UTC(geburtsdatum.getFullYear() - 1, geburtsdatum.getMonth(), 1),
  );

  const monate = Array.from({ length: 12 }, (_, i) => ({
    monatsIndex: i,
    monatsDatum: new Date(
      Date.UTC(startDatum.getFullYear(), startDatum.getMonth() + i, 1),
    ),
  }));

  const zeitabschnitt = {
    von: startDatum,
    bis: new Date(
      Date.UTC(geburtsdatum.getFullYear(), geburtsdatum.getMonth(), 0),
    ),
    monate,
  };
  return erstelleBemessungszeitraumAusEinklammerung(zeitabschnitt);
};

/**
 * Erzeugt ein standardisiertes Bemessungszeitraum-Objekt
 * aus einem einzelnen Einklammerungs-Zeitabschnitt.
 */
const erstelleBemessungszeitraumAusEinklammerung = (
  zeitabschnitt: Einklammerung,
): Bemessungszeitraum => {
  return {
    startdatum: zeitabschnitt.von,
    enddatum: zeitabschnitt.bis,
    zeitabschnitte: [
      {
        art: ZeitabschnittArt.einklammerung,
        zeitabschnitt,
      },
    ],
  };
};

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  const createDate = (datumsString: string) => new Date(datumsString);

  describe("berechneRelevanteBemessungszeitraeumeFuerErsteEinordnung", () => {
    it("returns an array with two bemessungszeitraeume (BMZ) for selbststaendig and nicht-selbststaendig", () => {
      const geburtsdatum = new Date("2025-10-15T00:00:00.000Z");

      const result =
        berechneRelevanteBemessungszeitraeumeFuerErsteEinordnung(geburtsdatum);

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            startdatum: expect.any(Date) as Date,
            enddatum: expect.any(Date) as Date,
            zeitabschnitte: expect.any(Array) as Zeitabschnitt[],
          }),
        ]),
      );
    });

    it("includes the necessary and correct dates of the BMZ for selbststaendige as first object of the array", () => {
      const geburtsdatum = new Date("2025-10-15T00:00:00.000Z");

      const result =
        berechneRelevanteBemessungszeitraeumeFuerErsteEinordnung(geburtsdatum);
      const bmzSelbststaendig = result[0];

      expect(bmzSelbststaendig).toBeDefined();
      expect(bmzSelbststaendig!.startdatum).toEqual(
        createDate("2024-01-01T00:00:00.000Z"),
      );
      expect(bmzSelbststaendig!.enddatum).toEqual(
        createDate("2024-12-31T00:00:00.000Z"),
      );
      expect(bmzSelbststaendig!.zeitabschnitte).toBeInstanceOf(Array);

      const ersterZeitabschnitt = bmzSelbststaendig!.zeitabschnitte[0];

      expect(ersterZeitabschnitt).toBeDefined();

      const einklammerung = ersterZeitabschnitt!.zeitabschnitt as Einklammerung;

      expect(einklammerung.monate).toHaveLength(12);
      expect(einklammerung.monate[0]!.monatsDatum).toEqual(
        createDate("2024-01-01T00:00:00.000Z"),
      );
      expect(einklammerung.monate[11]!.monatsDatum).toEqual(
        createDate("2024-12-01T00:00:00.000Z"),
      );
    });

    it("includes the necessary and correct dates of the BMZ for nicht-selbststaendige as second object of the array", () => {
      const geburtsdatum = new Date("2025-10-15T00:00:00.000Z");

      const result =
        berechneRelevanteBemessungszeitraeumeFuerErsteEinordnung(geburtsdatum);

      const bmzFragmentNichtSelbststaendig = result[1];

      expect(bmzFragmentNichtSelbststaendig).toBeDefined();
      expect(bmzFragmentNichtSelbststaendig!.startdatum).toEqual(
        createDate("2025-01-01T00:00:00.000Z"),
      );
      expect(bmzFragmentNichtSelbststaendig!.enddatum).toEqual(
        createDate("2025-10-15T00:00:00.000Z"),
      );
      expect(bmzFragmentNichtSelbststaendig!.zeitabschnitte).toBeInstanceOf(
        Array,
      );

      const ersterZeitabschnitt =
        bmzFragmentNichtSelbststaendig!.zeitabschnitte[0];

      expect(ersterZeitabschnitt).toBeDefined();

      const einklammerung = ersterZeitabschnitt!.zeitabschnitt as Einklammerung;

      expect(einklammerung.monate).toHaveLength(9);
      expect(einklammerung.monate[0]!.monatsDatum).toEqual(
        createDate("2025-01-01T00:00:00.000Z"),
      );
      expect(einklammerung.monate[8]!.monatsDatum).toEqual(
        createDate("2025-09-01T00:00:00.000Z"),
      );
    });
  });

  describe("berechneUngefaehrenBemessungszeitraum", () => {
    it("returns an bemessungszeitraum (BMZ) object for selbststaendig, which contains one zeitabschnitt as an array with 12 elements", () => {
      const geburtsdatum = createDate("2025-10-15T00:00:00.000Z");
      const erwerbstaetigkeit = Erwerbstaetigkeit.SELBSTSTAENDIG;

      const result = berechneUngefaehrenBemessungszeitraum(
        geburtsdatum,
        erwerbstaetigkeit,
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

    it("includes the necessary and correct dates of the BMZ for selbststaendige", () => {
      const geburtsdatum = createDate("2025-10-15T00:00:00.000Z");
      const erwerbstaetigkeit = Erwerbstaetigkeit.SELBSTSTAENDIG;

      const result = berechneUngefaehrenBemessungszeitraum(
        geburtsdatum,
        erwerbstaetigkeit,
      );

      expect(result.startdatum).toEqual(createDate("2024-01-01T00:00:00.000Z"));
      expect(result.enddatum).toEqual(createDate("2024-12-31T00:00:00.000Z"));

      expect(result.zeitabschnitte).toBeInstanceOf(Array);
      const ersterZeitabschnitt = result.zeitabschnitte[0];
      expect(ersterZeitabschnitt).toBeDefined();

      const einklammerung = ersterZeitabschnitt!.zeitabschnitt as Einklammerung;
      expect(einklammerung.monate).toHaveLength(12);
      expect(einklammerung.monate[0]!.monatsDatum).toEqual(
        createDate("2024-01-01T00:00:00.000Z"),
      );
      expect(einklammerung.monate[11]!.monatsDatum).toEqual(
        createDate("2024-12-01T00:00:00.000Z"),
      );
    });

    it("returns an bemessungszeitraum (BMZ) object for nicht-selbststaendig, which contains one zeitabschnitt as an array with 12 elements", () => {
      const geburtsdatum = createDate("2025-10-15T00:00:00.000Z");
      const erwerbstaetigkeit = Erwerbstaetigkeit.ANGESTELLT;

      const result = berechneUngefaehrenBemessungszeitraum(
        geburtsdatum,
        erwerbstaetigkeit,
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

    it("includes the necessary and correct dates of the BMZ for nicht-selbststaendige as second object of the array", () => {
      const geburtsdatum = createDate("2025-10-15T00:00:00.000Z");
      const erwerbstaetigkeit = Erwerbstaetigkeit.ANGESTELLT;

      const result = berechneUngefaehrenBemessungszeitraum(
        geburtsdatum,
        erwerbstaetigkeit,
      );

      expect(result.startdatum).toEqual(createDate("2024-10-01T00:00:00.000Z"));
      expect(result.enddatum).toEqual(createDate("2025-09-30T00:00:00.000Z"));

      expect(result.zeitabschnitte).toBeInstanceOf(Array);
      const ersterZeitabschnitt = result.zeitabschnitte[0];
      expect(ersterZeitabschnitt).toBeDefined();

      const einklammerung = ersterZeitabschnitt!.zeitabschnitt as Einklammerung;
      expect(einklammerung.monate).toHaveLength(12);
      expect(einklammerung.monate[0]!.monatsDatum).toEqual(
        createDate("2024-10-01T00:00:00.000Z"),
      );
      expect(einklammerung.monate[11]!.monatsDatum).toEqual(
        createDate("2025-09-01T00:00:00.000Z"),
      );
    });
  });
}
