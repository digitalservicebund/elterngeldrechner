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
    status,
    bruttoProMonat,
  );
  summe_sozab = aufDenCentRunden(summe_sozab);
  return summeAnSteuern + summe_sozab;
}

/**
 * Ermittlung der Sozialversicherungsabgaben in Summe.
 */
function summer_svb(
  krankenversicherungspflichtig_sub: boolean,
  rentenversicherungspflichtig_sub: boolean,
  status_sub: ErwerbsArt,
  brutto_sub: number,
): number {
  let abgaben_kvpv = 0;
  let abgaben_rv = 0;
  let abgaben_alv = 0;
  const brutto_rech_sub = brutto_sub;
  const f_faktor = F_FAKTOR;
  const grenze_mini_midi = GRENZE_MINI_MIDI;
  const grenze_midi_max = GRENZE_MIDI_MAX;

  const isNoMidi =
    brutto_rech_sub > grenze_midi_max || brutto_rech_sub <= grenze_mini_midi;

  if (isNoMidi) {
    if (krankenversicherungspflichtig_sub) {
      abgaben_kvpv =
        berechneAbzuegeFuerDieKrankenUndPflegeversicherung(brutto_rech_sub);
    }
    if (rentenversicherungspflichtig_sub) {
      abgaben_rv = berechneAbzuegeFuerDieRentenversicherung(brutto_rech_sub);
    }
    if (status_sub === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI) {
      abgaben_alv = berechneAbzuegeFuerDieArbeitsfoerderung(brutto_rech_sub);
    }
  } else {
    const tmp = grenze_mini_midi * f_faktor;
    const bd850_450 = grenze_midi_max - grenze_mini_midi;
    const bd850 = grenze_midi_max;
    const bd450 = grenze_mini_midi;
    const x = bd850 / bd850_450;

    let y: number;
    y = bd450 * f_faktor;
    y = y / bd850_450;

    const tmp2 = x - y;
    const tmp3 = brutto_rech_sub - grenze_mini_midi;
    let bemessungsentgelt = tmp2 * tmp3;
    bemessungsentgelt = bemessungsentgelt + tmp;
    if (krankenversicherungspflichtig_sub) {
      abgaben_kvpv =
        berechneAbzuegeFuerDieKrankenUndPflegeversicherung(bemessungsentgelt);
    }
    if (rentenversicherungspflichtig_sub) {
      abgaben_rv = berechneAbzuegeFuerDieRentenversicherung(bemessungsentgelt);
    }
    if (status_sub === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI) {
      abgaben_alv = berechneAbzuegeFuerDieArbeitsfoerderung(bemessungsentgelt);
    }
  }

  abgaben_kvpv = aufDenCentRunden(abgaben_kvpv);
  abgaben_rv = aufDenCentRunden(abgaben_rv);
  abgaben_alv = aufDenCentRunden(abgaben_alv);

  return abgaben_kvpv + abgaben_rv + abgaben_alv;
}

export function summe_svb_misch(
  krankenversicherungspflichtig_sub: boolean,
  rentenversicherungspflichtig_sub: boolean,
  status_sub: ErwerbsArt,
  brutto_sub: number,
): number {
  let abgaben_kvpv = 0;
  let abgaben_rv = 0;
  let abgaben_alv = 0;
  const brutto_rech_sub = brutto_sub;
  if (krankenversicherungspflichtig_sub) {
    abgaben_kvpv =
      berechneAbzuegeFuerDieKrankenUndPflegeversicherung(brutto_rech_sub);
  }
  if (rentenversicherungspflichtig_sub) {
    abgaben_rv = berechneAbzuegeFuerDieRentenversicherung(brutto_rech_sub);
  }
  if (status_sub === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI) {
    abgaben_alv = berechneAbzuegeFuerDieArbeitsfoerderung(brutto_rech_sub);
  }
  abgaben_kvpv = aufDenCentRunden(abgaben_kvpv);
  abgaben_rv = aufDenCentRunden(abgaben_rv);
  abgaben_alv = aufDenCentRunden(abgaben_alv);
  return aufDenCentRunden(abgaben_kvpv + abgaben_rv + abgaben_alv);
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
