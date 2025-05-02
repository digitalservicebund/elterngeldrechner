import { abgabenSteuern } from "./egr-steuer-rechner";
import { aufDenCentRunden } from "@/elterngeldrechner/common/math-util";
import {
  Einkommen,
  ErwerbsArt,
  FinanzDaten,
  type Geburtstag,
  KassenArt,
  RentenArt,
  SteuerKlasse,
} from "@/elterngeldrechner/model";
import {
  F_FAKTOR,
  GRENZE_MIDI_MAX,
  GRENZE_MINI_MIDI,
} from "@/elterngeldrechner/model/egr-berechnung-param-id";
import {
  berechneAbzuegeFuerDieArbeitsfoerderung,
  berechneAbzuegeFuerDieKrankenUndPflegeversicherung,
  berechneAbzuegeFuerDieRentenversicherung,
} from "@/elterngeldrechner/sozialabgaben/Abzuege";

export function abzuege(
  bruttoProMonat: number,
  finanzDaten: FinanzDaten,
  erwerbsArt: ErwerbsArt,
  geburtstagDesKindes: Geburtstag,
): number {
  let rentenversicherungspflichtig =
    finanzDaten.rentenVersicherung ===
    RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG;
  let krankenversicherungspflichtig =
    finanzDaten.kassenArt === KassenArt.GESETZLICH_PFLICHTVERSICHERT;
  if (erwerbsArt === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI) {
    rentenversicherungspflichtig = true;
  }
  if (erwerbsArt === ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI) {
    rentenversicherungspflichtig = false;
    krankenversicherungspflichtig = false;
  }
  // in 2023 only rentenversicherungspflichtig: https://www.dgb.de/schwerpunkt/minijob
  if (erwerbsArt === ErwerbsArt.JA_NICHT_SELBST_MINI) {
    krankenversicherungspflichtig = false;
    rentenversicherungspflichtig = true;
  }

  let steuerKlasse = finanzDaten.steuerKlasse;
  let splittingFaktor = finanzDaten.splittingFaktor;
  if (erwerbsArt === ErwerbsArt.JA_SELBSTSTAENDIG) {
    steuerKlasse = SteuerKlasse.SKL4;
    splittingFaktor = 1.0;
  }

  // TODO Prüfen on diese Zuweisungen nötig und sinnvoll sind, wenn die Methode vom EGR aufgerufen wird.
  finanzDaten.steuerKlasse = steuerKlasse;
  finanzDaten.splittingFaktor = splittingFaktor;

  return berechneSteuernAbgaben(
    finanzDaten,
    krankenversicherungspflichtig,
    rentenversicherungspflichtig,
    erwerbsArt,
    bruttoProMonat,
    geburtstagDesKindes,
  );
}

/**
 * Methode zum Ermitteln des Zwischenergebnisses, wurde aus VB übernommen. Variablen haben identische Namen wie in
 * VB. Soll auch so bleiben.
 */
export function nettoEinkommenZwischenErgebnis(
  finanzdaten: FinanzDaten,
  erwerbsArtVorGeburt: ErwerbsArt,
  geburtstagDesKindes: Geburtstag,
): Einkommen {
  const netto: Einkommen = new Einkommen(0);
  const status: ErwerbsArt = erwerbsArtVorGeburt;
  const brutto = finanzdaten.bruttoEinkommen.value;
  const art_rv: RentenArt = finanzdaten.rentenVersicherung;
  const art_kv: KassenArt = finanzdaten.kassenArt;
  let rentenversicherungspflichtig: boolean;
  let krankenversicherungspflichtig: boolean;
  rentenversicherungspflichtig =
    art_rv === RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG;
  krankenversicherungspflichtig =
    art_kv === KassenArt.GESETZLICH_PFLICHTVERSICHERT;
  if (status === ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI) {
    rentenversicherungspflichtig = false;
    krankenversicherungspflichtig = false;
  }
  if (status === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI) {
    rentenversicherungspflichtig = true;
  }
  if (status !== ErwerbsArt.JA_NICHT_SELBST_MINI) {
    const steuerUndAbgaben = berechneSteuernAbgaben(
      finanzdaten,
      krankenversicherungspflichtig,
      rentenversicherungspflichtig,
      status,
      brutto,
      geburtstagDesKindes,
    );
    netto.value = brutto - steuerUndAbgaben;
  } else {
    netto.value = brutto;
  }
  return netto;
}

/**
 * Methode errechnet Abzüge (Lohnsteuer, Kirchensteuer) vom Bruttogehalt.
 */
export function summeSteuer(
  finanzdaten: FinanzDaten,
  erwerbsArt: ErwerbsArt,
  bruttoProMonat: number,
  geburtstagDesKindes: Geburtstag,
): number {
  const charge = abgabenSteuern(
    finanzdaten,
    erwerbsArt,
    bruttoProMonat,
    geburtstagDesKindes,
  );
  const kirchensteuersatz: number = 8;
  let kirchenlohnsteuer = calculateChurchTaxes(kirchensteuersatz, charge.bk);
  kirchenlohnsteuer = aufDenCentRunden(kirchenlohnsteuer);
  let summeSteuer = charge.lstlzz + charge.solzlzz;
  if (bruttoProMonat <= GRENZE_MINI_MIDI) {
    kirchenlohnsteuer = 0;
    summeSteuer = 0;
  }

  return summeSteuer + kirchenlohnsteuer;
}

/**
 * Methode errechnet Abzüge vom Bruttogehalt in Summe (Lohnsteuer, Kirchensteuer und Sozialabgaben).
 */
function berechneSteuernAbgaben(
  finanzdaten: FinanzDaten,
  krankenversicherungspflichtig: boolean,
  rentenversicherungspflichtig: boolean,
  status: ErwerbsArt,
  bruttoProMonat: number,
  geburtstagDesKindes: Geburtstag,
): number {
  const summeAnSteuern = summeSteuer(
    finanzdaten,
    status,
    bruttoProMonat,
    geburtstagDesKindes,
  );
  let summe_sozab = summer_svb(
    krankenversicherungspflichtig,
    rentenversicherungspflichtig,
    status === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
    bruttoProMonat,
  );
  summe_sozab = aufDenCentRunden(summe_sozab);
  return summeAnSteuern + summe_sozab;
}

/**
 * Ermittlung der Sozialversicherungsabgaben in Summe.
 */
function summer_svb(
  istKrankenversicherungspflichtig: boolean,
  istRentenversicherungspflichtig: boolean,
  istArbeitsfoerderungspflichtig: boolean,
  arbeitsentgelt: number,
): number {
  const isNoMidi =
    arbeitsentgelt > GRENZE_MIDI_MAX || arbeitsentgelt <= GRENZE_MINI_MIDI;

  if (isNoMidi) {
    return summe_svb_misch(
      istKrankenversicherungspflichtig,
      istRentenversicherungspflichtig,
      istArbeitsfoerderungspflichtig,
      arbeitsentgelt,
    );
  } else {
    const tmp = GRENZE_MINI_MIDI * F_FAKTOR;
    const bd850_450 = GRENZE_MIDI_MAX - GRENZE_MINI_MIDI;
    const bd850 = GRENZE_MIDI_MAX;
    const bd450 = GRENZE_MINI_MIDI;
    const x = bd850 / bd850_450;

    let y: number;
    y = bd450 * F_FAKTOR;
    y = y / bd850_450;

    const tmp2 = x - y;
    const tmp3 = arbeitsentgelt - GRENZE_MINI_MIDI;
    let bemessungsentgelt = tmp2 * tmp3;
    bemessungsentgelt = bemessungsentgelt + tmp;

    return summe_svb_misch(
      istKrankenversicherungspflichtig,
      istRentenversicherungspflichtig,
      istArbeitsfoerderungspflichtig,
      bemessungsentgelt,
    );
  }
}

export function summe_svb_misch(
  istKrankenversicherungspflichtig: boolean,
  istRentenversicherungspflichtig: boolean,
  istArbeitsfoerderungspflichtig: boolean,
  bemessungsgrundlage: number,
): number {
  const abzuege = [
    istKrankenversicherungspflichtig
      ? berechneAbzuegeFuerDieKrankenUndPflegeversicherung(bemessungsgrundlage)
      : 0,
    istRentenversicherungspflichtig
      ? berechneAbzuegeFuerDieRentenversicherung(bemessungsgrundlage)
      : 0,
    istArbeitsfoerderungspflichtig
      ? berechneAbzuegeFuerDieArbeitsfoerderung(bemessungsgrundlage)
      : 0,
  ];

  return abzuege.reduce((summe, abzug) => summe + abzug, 0);
}

function calculateChurchTaxes(kirchensteuersatz: number, bk: number): number {
  return (bk / 100) * kirchensteuersatz;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("brutto-netto-rechner", async () => {
    const { abzuege } = await import("./brutto-netto-rechner");
    const { KinderFreiBetrag, Geburtstag } = await import(
      "@/elterngeldrechner/model"
    );

    it("should calculate test from TestErweiterterAlgorithmus.java", () => {
      // given
      const finanzDaten = {
        bruttoEinkommen: new Einkommen(0),
        steuerKlasse: SteuerKlasse.SKL4,
        kinderFreiBetrag: KinderFreiBetrag.ZKF1,
        kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
        rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
        splittingFaktor: 1.0,
        mischEinkommenTaetigkeiten: [],
        erwerbsZeitraumLebensMonatList: [],
      };

      // when
      const actual = abzuege(
        2000,
        finanzDaten,
        ErwerbsArt.JA_SELBSTSTAENDIG,
        new Geburtstag("2020-01-01"),
      );

      // then
      expect(actual).toBe(562.66);
    });
  });
}
