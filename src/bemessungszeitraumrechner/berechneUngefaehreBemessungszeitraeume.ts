import { Bemessungszeitraum, ZeitabschnittArt } from "./Bemessungszeitraum";
import { Einklammerung } from "./Einklammerung";
import { Erwerbstaetigkeit } from "./Erwerbstaetigkeit";

/**
 * Berechnet die zwei potenziell relevanten Bemessungszeiträume (BMZ) für eine
 * erste, grobe Einordnung (z.B. für eine UI-Vorauswahl).
 *
 * @param {Date} geburtsdatum Das Geburtsdatum des Kindes.
 * @returns {Bemessungszeitraum[]} Ein Array, das den BMZ für Selbstständige (Vorjahr)
 * und ein Fragment des BMZ für Nicht-Selbstständige (Januar bis Geburt) enthält.
 */
export function berechneRelevanteBemessungszeitraeumeFuerErsteEinordnung(
  geburtsdatum: Date,
): Bemessungszeitraum[] {
  const anzahlMonate = geburtsdatum.getMonth();
  const monate = Array.from({ length: anzahlMonate }, (_, i) => ({
    monatsIndex: i,
    monatsDatum: new Date(geburtsdatum.getFullYear(), i, 1),
  }));

  const fragmentZeitabschnittNichtSelbststaendig: Einklammerung = {
    von: new Date(geburtsdatum.getFullYear(), 0, 1),
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
    monatsDatum: new Date(geburtsdatum.getFullYear() - 1, i, 1),
  }));

  const zeitabschnitt = {
    von: new Date(geburtsdatum.getFullYear() - 1, 0, 1),
    bis: new Date(geburtsdatum.getFullYear(), 0, 0),
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
    geburtsdatum.getFullYear() - 1,
    geburtsdatum.getMonth(),
    1,
  );

  const monate = Array.from({ length: 12 }, (_, i) => ({
    monatsIndex: i,
    monatsDatum: new Date(
      startDatum.getFullYear(),
      startDatum.getMonth() + i,
      1,
    ),
  }));

  const zeitabschnitt = {
    von: startDatum,
    bis: new Date(geburtsdatum.getFullYear(), geburtsdatum.getMonth(), 0),
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
