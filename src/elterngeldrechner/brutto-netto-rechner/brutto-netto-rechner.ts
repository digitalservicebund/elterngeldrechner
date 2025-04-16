import { abgabenSteuern } from "./egr-steuer-rechner";
import { aufDenCentRunden } from "@/elterngeldrechner/common/math-util";
import {
  Einkommen,
  ErwerbsArt,
  FinanzDaten,
  KassenArt,
  RentenArt,
  SteuerKlasse,
} from "@/elterngeldrechner/model";
import {
  F_FAKTOR,
  GRENZE_MIDI_MAX,
  GRENZE_MINI_MIDI,
  SATZ_ALV_BEEG,
  SATZ_KVPV_BEEG,
  SATZ_RV_BEEG,
} from "@/elterngeldrechner/model/egr-berechnung-param-id";

export function abzuege(
  bruttoProMonat: number,
  finanzDaten: FinanzDaten,
  erwerbsArt: ErwerbsArt,
  geburtsdatumDesKindes: Date,
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
    geburtsdatumDesKindes,
  );
}

/**
 * Methode zum Ermitteln des Zwischenergebnisses, wurde aus VB übernommen. Variablen haben identische Namen wie in
 * VB. Soll auch so bleiben.
 */
export function nettoEinkommenZwischenErgebnis(
  finanzdaten: FinanzDaten,
  erwerbsArtVorGeburt: ErwerbsArt,
  geburtsdatumDesKindes: Date,
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
      geburtsdatumDesKindes,
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
  geburtsdatumDesKindes: Date,
): number {
  const charge = abgabenSteuern(
    finanzdaten,
    erwerbsArt,
    bruttoProMonat,
    geburtsdatumDesKindes,
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
  geburtsdatumDesKindes: Date,
): number {
  const summeAnSteuern = summeSteuer(
    finanzdaten,
    status,
    bruttoProMonat,
    geburtsdatumDesKindes,
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
  let abgaben_gleitzone = 0;
  const brutto_rech_sub = brutto_sub;
  const satz_kvpv_beeg = SATZ_KVPV_BEEG;
  const satz_rv_beeg = SATZ_RV_BEEG;
  const satz_alv_beeg = SATZ_ALV_BEEG;
  const f_faktor = F_FAKTOR;
  const grenze_mini_midi = GRENZE_MINI_MIDI;
  const grenze_midi_max = GRENZE_MIDI_MAX;

  const isNoMidi =
    brutto_rech_sub > grenze_midi_max || brutto_rech_sub <= grenze_mini_midi;

  if (isNoMidi) {
    if (krankenversicherungspflichtig_sub) {
      abgaben_kvpv = brutto_rech_sub * satz_kvpv_beeg;
    }
    if (rentenversicherungspflichtig_sub) {
      abgaben_rv = brutto_rech_sub * satz_rv_beeg;
    }
    if (status_sub === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI) {
      abgaben_alv = brutto_rech_sub * satz_alv_beeg;
    }
  }
  if (
    brutto_rech_sub > grenze_mini_midi &&
    brutto_rech_sub <= grenze_midi_max
  ) {
    let beitragsatz = 0;
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
      beitragsatz = beitragsatz + satz_kvpv_beeg;
    }
    if (rentenversicherungspflichtig_sub) {
      beitragsatz = beitragsatz + satz_rv_beeg;
    }
    if (status_sub === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI) {
      beitragsatz = beitragsatz + satz_alv_beeg;
    }
    abgaben_gleitzone = beitragsatz * bemessungsentgelt;
    abgaben_kvpv = aufDenCentRunden(abgaben_kvpv);
    abgaben_rv = aufDenCentRunden(abgaben_rv);
    abgaben_alv = aufDenCentRunden(abgaben_alv);
    abgaben_gleitzone = aufDenCentRunden(abgaben_gleitzone);
  }

  return abgaben_kvpv + abgaben_rv + abgaben_alv + abgaben_gleitzone;
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
  const satz_kvpv_beeg = SATZ_KVPV_BEEG;
  const satz_rv_beeg = SATZ_RV_BEEG;
  const satz_alv_beeg = SATZ_ALV_BEEG;
  if (krankenversicherungspflichtig_sub) {
    abgaben_kvpv = brutto_rech_sub * satz_kvpv_beeg;
  }
  if (rentenversicherungspflichtig_sub) {
    abgaben_rv = brutto_rech_sub * satz_rv_beeg;
  }
  if (status_sub === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI) {
    abgaben_alv = brutto_rech_sub * satz_alv_beeg;
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
    const { KinderFreiBetrag } = await import("@/elterngeldrechner/model");

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
        new Date("2020-01-01"),
      );

      // then
      expect(actual).toBe(562.66);
    });
  });
}
