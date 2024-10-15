import Big from "big.js";
import { EgrSteuerRechner } from "./egr-steuer-rechner";
import { log } from "@/globals/js/calculations/common/logger";
import {
  F_FAKTOR,
  GRENZE_MIDI_MAX,
  GRENZE_MINI_MIDI,
  SATZ_ALV_BEEG,
  SATZ_KVPV_BEEG,
  SATZ_RV_BEEG,
} from "@/globals/js/calculations/model/egr-berechnung-param-id";
import {
  Einkommen,
  ErwerbsArt,
  FinanzDaten,
  KassenArt,
  NettoEinkommen,
  RentenArt,
  SteuerKlasse,
} from "@/globals/js/calculations/model";
import {
  BIG_100,
  BIG_ZERO,
  round,
} from "@/globals/js/calculations/common/math-util";

export class BruttoNettoRechner {
  private egrSteuerRechner = new EgrSteuerRechner();

  /**
   * Methode zum Ermitteln der Abzüge anhand des durchschnittlichen monatlichen Bruttogehaltes
   *
   * @param {Big} bruttoProMonat Steuerpflichtiger durchschnittlicher Arbeitslohn pro Monat für das angegebene Jahr.
   * @param {number} lohnSteuerJahr Das Lohnsteuerjahr des angegebenen steuerpflichtigen Arbeitslohns.
   * @param {FinanzDaten} finanzDaten Angaben zum Einkommen.
   * @param {ErwerbsArt} erwerbsArt Art des Einkommens (selbstständig, angestellt, ...)
   * @return {Big} Die Höhe der Abzüge.
   * @throws EgrBerechnungException
   */
  async abzuege(
    bruttoProMonat: Big,
    lohnSteuerJahr: number,
    finanzDaten: FinanzDaten,
    erwerbsArt: ErwerbsArt,
  ): Promise<Big> {
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

    return await this.berechneSteuernAbgaben(
      finanzDaten,
      krankenversicherungspflichtig,
      rentenversicherungspflichtig,
      erwerbsArt,
      bruttoProMonat,
      lohnSteuerJahr,
    );
  }

  /**
   * Methode zum Ermitteln des Zwischenergebnisses, wurde aus VB übernommen. Variablen haben identische Namen wie in
   * VB. Soll auch so bleiben.
   *
   * @param {FinanzDaten} finanzdaten
   * @param erwerbsArtVorGeburt
   * @param lohnSteuerJahr
   * @return {NettoEinkommen}
   */
  async nettoEinkommenZwischenErgebnis(
    finanzdaten: FinanzDaten,
    erwerbsArtVorGeburt: ErwerbsArt,
    lohnSteuerJahr: number,
  ): Promise<NettoEinkommen> {
    const netto: NettoEinkommen = new Einkommen(0);
    const status: ErwerbsArt = erwerbsArtVorGeburt;
    const brutto: Big = finanzdaten.bruttoEinkommen.value;
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
      const steuerUndAbgaben: Big = await this.berechneSteuernAbgaben(
        finanzdaten,
        krankenversicherungspflichtig,
        rentenversicherungspflichtig,
        status,
        brutto,
        lohnSteuerJahr,
      );
      netto.value = brutto.sub(steuerUndAbgaben);
    } else {
      netto.value = brutto;
    }
    return netto;
  }

  /**
   * Methode errechnet Abzüge (Lohnsteuer, Kirchensteuer) vom Bruttogehalt.
   */
  async summeSteuer(
    finanzdaten: FinanzDaten,
    erwerbsArt: ErwerbsArt,
    bruttoProMonat: Big,
    lohnSteuerJahr: number,
  ): Promise<Big> {
    const charge = await this.egrSteuerRechner.abgabenSteuern(
      finanzdaten,
      erwerbsArt,
      bruttoProMonat,
      lohnSteuerJahr,
    );
    const kirchensteuersatz: number = 8;
    let kirchenlohnsteuer: Big = BruttoNettoRechner.calculateChurchTaxes(
      kirchensteuersatz,
      charge.bk,
    );
    kirchenlohnsteuer = round(kirchenlohnsteuer);
    let summeSteuer: Big = charge.lstlzz.add(charge.solzlzz);
    if (bruttoProMonat.lte(GRENZE_MINI_MIDI)) {
      kirchenlohnsteuer = BIG_ZERO;
      summeSteuer = BIG_ZERO;
    }

    log(`Lohnsteuer: ${charge.lstlzz}`);
    log(`SoliZuschlag: ${charge.solzlzz}`);
    log(`Kirchensteuer: ${kirchenlohnsteuer}`);

    return summeSteuer.add(kirchenlohnsteuer);
  }

  /**
   * Methode errechnet Abzüge vom Bruttogehalt in Summe (Lohnsteuer, Kirchensteuer und Sozialabgaben).
   */
  private async berechneSteuernAbgaben(
    finanzdaten: FinanzDaten,
    krankenversicherungspflichtig: boolean,
    rentenversicherungspflichtig: boolean,
    status: ErwerbsArt,
    bruttoProMonat: Big,
    lohnSteuerJahr: number,
  ): Promise<Big> {
    const summeSteuer: Big = await this.summeSteuer(
      finanzdaten,
      status,
      bruttoProMonat,
      lohnSteuerJahr,
    );
    let summe_sozab: Big = BruttoNettoRechner.summer_svb(
      krankenversicherungspflichtig,
      rentenversicherungspflichtig,
      status,
      bruttoProMonat,
    );
    summe_sozab = round(summe_sozab);
    log(`Summe Sozialabgaben: ${summe_sozab}`);
    return summeSteuer.add(summe_sozab);
  }

  /**
   * Ermittlung der Sozialversicherungsabgaben in Summe.
   */
  private static summer_svb(
    krankenversicherungspflichtig_sub: boolean,
    rentenversicherungspflichtig_sub: boolean,
    status_sub: ErwerbsArt,
    brutto_sub: Big,
  ): Big {
    let abgaben_kvpv: Big = BIG_ZERO;
    let abgaben_rv: Big = BIG_ZERO;
    let abgaben_alv: Big = BIG_ZERO;
    let abgaben_gleitzone: Big = BIG_ZERO;
    const brutto_rech_sub: Big = brutto_sub;
    const satz_kvpv_beeg: Big = SATZ_KVPV_BEEG;
    const satz_rv_beeg: Big = SATZ_RV_BEEG;
    const satz_alv_beeg: Big = SATZ_ALV_BEEG;
    const f_faktor: Big = F_FAKTOR;
    const grenze_mini_midi = GRENZE_MINI_MIDI;
    const grenze_midi_max = GRENZE_MIDI_MAX;
    if (
      brutto_rech_sub.gt(grenze_midi_max) ||
      brutto_rech_sub.lte(grenze_mini_midi)
    ) {
      if (krankenversicherungspflichtig_sub) {
        abgaben_kvpv = brutto_rech_sub.mul(satz_kvpv_beeg);
      }
      if (rentenversicherungspflichtig_sub) {
        abgaben_rv = brutto_rech_sub.mul(satz_rv_beeg);
      }
      if (status_sub === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI) {
        abgaben_alv = brutto_rech_sub.mul(satz_alv_beeg);
      }
    }
    if (
      brutto_rech_sub.gt(grenze_mini_midi) &&
      brutto_rech_sub.lte(grenze_midi_max)
    ) {
      let beitragsatz: Big = BIG_ZERO;
      const tmp: Big = f_faktor.mul(grenze_mini_midi);
      const bd850_450: Big = grenze_midi_max.sub(grenze_mini_midi);
      const bd850: Big = grenze_midi_max;
      const bd450: Big = grenze_mini_midi;
      const x = bd850.div(bd850_450);

      let y: Big;
      y = bd450.mul(f_faktor);
      y = y.div(bd850_450);

      const tmp2: Big = x.sub(y);
      const tmp3: Big = brutto_rech_sub.sub(grenze_mini_midi);
      let bemessungsentgelt: Big = tmp2.mul(tmp3);
      bemessungsentgelt = bemessungsentgelt.add(tmp);
      if (krankenversicherungspflichtig_sub) {
        beitragsatz = beitragsatz.add(satz_kvpv_beeg);
      }
      if (rentenversicherungspflichtig_sub) {
        beitragsatz = beitragsatz.add(satz_rv_beeg);
      }
      if (status_sub === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI) {
        beitragsatz = beitragsatz.add(satz_alv_beeg);
      }
      abgaben_gleitzone = beitragsatz.mul(bemessungsentgelt);
      abgaben_kvpv = round(abgaben_kvpv);
      abgaben_rv = round(abgaben_rv);
      abgaben_alv = round(abgaben_alv);
      abgaben_gleitzone = round(abgaben_gleitzone);
    }
    log(`KV: ${abgaben_kvpv}`);
    log(`RV: ${abgaben_rv}`);
    log(`ALV: ${abgaben_alv}`);
    log(`Gleitzone: ${abgaben_gleitzone}`);

    return abgaben_kvpv.add(abgaben_rv).add(abgaben_alv).add(abgaben_gleitzone);
  }

  /**
   * Ermittlung der Sozialversicherungsabgaben in Summe für Mischeinkünfte
   *
   * //@formatter:off
   * Public Function summe_svb_misch(grenze_rv_sub, krankenversicherungspflichtig_sub, rentenversicherungspflichtig_sub, status_sub, brutto_sub)
   *
   * 'Berechnung Sozialabgaben
   *
   * abgaben_kvpv = 0
   * abgaben_rv = 0
   * abgaben_alv = 0
   * abgaben_gleitzone = 0
   * brutto_rech_sub = brutto_sub
   *
   * If krankenversicherungspflichtig_sub = 1 Then abgaben_kvpv = brutto_rech_sub * satz_kvpv_beeg
   * If rentenversicherungspflichtig_sub = 1 Then abgaben_rv = brutto_rech_sub * satz_rv_beeg
   * If status_sub = 2 Then abgaben_alv = brutto_rech_sub * satz_alv_beeg
   *
   * abgaben_kvpv = Round(abgaben_kvpv, 2)
   * abgaben_rv = Round(abgaben_rv, 2)
   * abgaben_alv = Round(abgaben_alv, 2)
   * summe_svb_misch = Round(abgaben_kvpv + abgaben_rv + abgaben_alv, 2)
   * End Function
   * //@formatter:on
   *
   * @param {boolean} krankenversicherungspflichtig_sub
   * @param {boolean} rentenversicherungspflichtig_sub
   * @param {ErwerbsArt} status_sub
   * @param {Big} brutto_sub
   * @return {Big}
   */
  summe_svb_misch(
    krankenversicherungspflichtig_sub: boolean,
    rentenversicherungspflichtig_sub: boolean,
    status_sub: ErwerbsArt,
    brutto_sub: Big,
  ): Big {
    let abgaben_kvpv: Big = BIG_ZERO;
    let abgaben_rv: Big = BIG_ZERO;
    let abgaben_alv: Big = BIG_ZERO;
    const brutto_rech_sub: Big = brutto_sub;
    const satz_kvpv_beeg: Big = SATZ_KVPV_BEEG;
    const satz_rv_beeg: Big = SATZ_RV_BEEG;
    const satz_alv_beeg: Big = SATZ_ALV_BEEG;
    if (krankenversicherungspflichtig_sub) {
      abgaben_kvpv = brutto_rech_sub.mul(satz_kvpv_beeg);
    }
    if (rentenversicherungspflichtig_sub) {
      abgaben_rv = brutto_rech_sub.mul(satz_rv_beeg);
    }
    if (status_sub === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI) {
      abgaben_alv = brutto_rech_sub.mul(satz_alv_beeg);
    }
    abgaben_kvpv = round(abgaben_kvpv);
    abgaben_rv = round(abgaben_rv);
    abgaben_alv = round(abgaben_alv);
    log(`KV: ${abgaben_kvpv}`);
    log(`RV: ${abgaben_rv}`);
    log(`ALV: ${abgaben_alv}`);
    return round(abgaben_kvpv.add(abgaben_rv).add(abgaben_alv));
  }

  private static calculateChurchTaxes(kirchensteuersatz: number, bk: Big): Big {
    return bk.div(BIG_100).mul(Big(kirchensteuersatz));
  }
}
