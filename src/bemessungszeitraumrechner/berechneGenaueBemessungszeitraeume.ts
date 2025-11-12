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
const getGenauenSelbststaendigenBemessungszeitraum = (
  geburtsdatum: Date,
  auszuklammerndeZeitraeume: Ausklammerung[],
): Bemessungszeitraum => {
  const jahrDesBemessungszeitraums =
    ermittleJahrDesBemessungszeitraumsFuerSelbststaendige(
      geburtsdatum.getFullYear(),
      auszuklammerndeZeitraeume,
    );

  const monate = Array.from({ length: 12 }, (_, i) => ({
    monatsIndex: i,
    monatsDatum: new Date(jahrDesBemessungszeitraums, i, 1),
  }));

  const einklammerung: Einklammerung = {
    von: new Date(jahrDesBemessungszeitraums, 0, 1),
    bis: new Date(jahrDesBemessungszeitraums, 11, 31),
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
};

/**
 * Ermittelt das korrekte Jahr des Bemessungszeitraums für Selbstständige.
 * Verschiebt das Jahr um ein Jahr, wenn eine Ausklammerung im Standard-BMZ liegt.
 * Eine Verschiebung um mehr als ein Jahr ist erstmal nicht vorgesehen, wäre aber
 * evtl. eine gute Iteration für die Zukunft.
 */
const ermittleJahrDesBemessungszeitraumsFuerSelbststaendige = (
  geburtsjahr: number,
  auszuklammerndeZeitraeume: Ausklammerung[],
): number => {
  const jahrVorGeburtsjahr = geburtsjahr - 1;

  const standardBMZStart = new Date(jahrVorGeburtsjahr, 0, 1);
  const standardBMZEnde = new Date(jahrVorGeburtsjahr, 11, 31);

  const mussVerschobenWerden = auszuklammerndeZeitraeume.some(
    (zeitraum) =>
      zeitraum.von <= standardBMZEnde && zeitraum.bis >= standardBMZStart,
  );

  return mussVerschobenWerden ? jahrVorGeburtsjahr - 1 : jahrVorGeburtsjahr;
};

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
            endElement.monatsDatum.getFullYear(),
            endElement.monatsDatum.getMonth() + 1,
            0,
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
    geburtsdatum.getFullYear() - MAX_SEARCH_YEARS,
    geburtsdatum.getMonth(),
    1,
  );

  let current = new Date(
    geburtsdatum.getFullYear(),
    geburtsdatum.getMonth() - 1,
    1,
  );

  while (monateDateObjekte.length < 12 && current >= fruehestesSuchDatum) {
    const monthStart = new Date(current.getFullYear(), current.getMonth(), 1);
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);

    const istAusgeklammert = auszuklammerndeZeitraeume.some(
      ({ von, bis }) => von <= monthEnd && bis >= monthStart,
    );

    if (!istAusgeklammert) {
      monateDateObjekte.push(monthStart);
    }
    current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
  }

  if (monateDateObjekte.length < 12) {
    while (monateDateObjekte.length < 12) {
      monateDateObjekte.push(
        new Date(current.getFullYear(), current.getMonth(), 1),
      );
      current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
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
