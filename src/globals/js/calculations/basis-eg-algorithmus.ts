import Big from "big.js";
import { AbstractAlgorithmus } from "./abstract-algorithmus";
import { BruttoNettoRechner } from "./brutto-netto-rechner/brutto-netto-rechner";
import {
  ErwerbsArt,
  ErwerbsTaetigkeit,
  FinanzDaten,
  KassenArt,
  type Lohnsteuerjahr,
  MischEkZwischenErgebnis,
  PersoenlicheDaten,
  RentenArt,
  SteuerKlasse,
} from "./model";
import {
  BIG_ONE,
  BIG_ZERO,
  greater,
  isEqual,
  lessOrEqual,
  round,
} from "@/globals/js/calculations/common/math-util";
import {
  F_FAKTOR,
  GRENZE_MIDI_MAX,
  GRENZE_MINI_MIDI,
  PAUSCH,
} from "@/globals/js/calculations/model/egr-berechnung-param-id";

const ANZAHL_MONATE_PRO_JAHR: number = 12;

/**
 * Bildet die Berechnung von Netto und Basiselterngeld ab.
 */
export class BasisEgAlgorithmus extends AbstractAlgorithmus {
  /**
   * Bildet die Berechnung von Netto und Basiselterngeld für Mischeinkommen ab.
   *
   * @param {PersoenlicheDaten} persoenlicheDaten Persönliche Angaben für die Berechnung des Elterngeldes.
   * @param {FinanzDaten} finanzDaten Angaben zum Einkommen.
   * @param {Lohnsteuerjahr} lohnSteuerJahr Das Lohnsteuerjahr des angegebenen steuerpflichtigen Arbeitslohns.
   *
   * @return Das Zwischenergebnis bei Mischeinkommen.
   */
  public berechneMischNettoUndBasiselterngeld(
    persoenlicheDaten: PersoenlicheDaten,
    finanzDaten: FinanzDaten,
    lohnSteuerJahr: Lohnsteuerjahr,
  ): MischEkZwischenErgebnis {
    let netto: Big;
    let steuern: Big = Big(0);
    let abgaben: Big = Big(0);
    finanzDaten.mischEinkommenTaetigkeiten.forEach((mischEkTaetigkeit) => {
      if (
        greater(
          mischEkTaetigkeit.bruttoEinkommenDurchschnitt,
          GRENZE_MINI_MIDI,
        ) &&
        lessOrEqual(
          mischEkTaetigkeit.bruttoEinkommenDurchschnitt,
          GRENZE_MIDI_MAX,
        ) &&
        mischEkTaetigkeit.erwerbsTaetigkeit ===
          ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG
      ) {
        const midiRange: Big = GRENZE_MIDI_MAX.sub(GRENZE_MINI_MIDI);
        const overMini: Big =
          mischEkTaetigkeit.bruttoEinkommenDurchschnitt.sub(GRENZE_MINI_MIDI);
        const faktoredMin: Big = F_FAKTOR.mul(GRENZE_MINI_MIDI);
        const faktoredMidi: Big = GRENZE_MIDI_MAX.sub(faktoredMin)
          .div(midiRange)
          .mul(overMini);
        mischEkTaetigkeit.bruttoEinkommenDurchschnittMidi =
          faktoredMin.add(faktoredMidi);
      }
    });

    let betrachtungsmonate: number = 0;
    let letzter_Betrachtungsmonat: number = 0;
    let zaehler_Pauschmonate: number = 0;
    const monate_pausch: number[] = new Array<number>(12).fill(0);
    for (let i: number = 0; i < ANZAHL_MONATE_PRO_JAHR; i++) {
      let tmpBetrachtungsmonateFlag: boolean = false;

      const array = finanzDaten.mischEinkommenTaetigkeiten;
      for (const mischEkTaetigkeit of array) {
        if (mischEkTaetigkeit.bemessungsZeitraumMonate[i]) {
          tmpBetrachtungsmonateFlag = true;
        }
        if (
          mischEkTaetigkeit.bemessungsZeitraumMonate[i] &&
          mischEkTaetigkeit.erwerbsTaetigkeit !==
            ErwerbsTaetigkeit.SELBSTSTAENDIG &&
          monate_pausch[i] === 0
        ) {
          zaehler_Pauschmonate++;
          monate_pausch[i] = 1;
        }
      }

      if (tmpBetrachtungsmonateFlag) {
        betrachtungsmonate++;
        letzter_Betrachtungsmonat = i;
      }
    }
    let summe_EK_SS: Big = BIG_ZERO;
    let summe_EK_NS: Big = BIG_ZERO;
    let summe_EK_NS_SV: Big = BIG_ZERO;
    let summe_EK_GNS: Big = BIG_ZERO;
    const array = finanzDaten.mischEinkommenTaetigkeiten;
    for (const mischEkTaetigkeit of array) {
      const bruttoGesamt: Big =
        mischEkTaetigkeit.bruttoEinkommenDurchschnitt.mul(
          new Big(mischEkTaetigkeit.getAnzahlBemessungsZeitraumMonate()),
        );
      switch (mischEkTaetigkeit.erwerbsTaetigkeit) {
        case ErwerbsTaetigkeit.SELBSTSTAENDIG:
          summe_EK_SS = summe_EK_SS.add(
            mischEkTaetigkeit.bruttoEinkommenDurchschnitt.mul(
              new Big(mischEkTaetigkeit.getAnzahlBemessungsZeitraumMonate()),
            ),
          );
          break;
        case ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG:
          summe_EK_NS = summe_EK_NS.add(bruttoGesamt);
          if (
            isEqual(mischEkTaetigkeit.bruttoEinkommenDurchschnittMidi, BIG_ZERO)
          ) {
            summe_EK_NS_SV = summe_EK_NS_SV.add(bruttoGesamt);
          } else if (
            greater(mischEkTaetigkeit.bruttoEinkommenDurchschnittMidi, BIG_ZERO)
          ) {
            summe_EK_NS_SV = summe_EK_NS_SV.add(
              mischEkTaetigkeit.bruttoEinkommenDurchschnittMidi.mul(
                new Big(mischEkTaetigkeit.getAnzahlBemessungsZeitraumMonate()),
              ),
            );
          }
          break;
        case ErwerbsTaetigkeit.MINIJOB:
          summe_EK_GNS = summe_EK_GNS.add(bruttoGesamt);
          break;
      }
    }

    const brutto_elg: Big = round(
      summe_EK_SS
        .add(summe_EK_NS)
        .add(summe_EK_GNS)
        .sub(Big(zaehler_Pauschmonate).mul(PAUSCH))
        .div(ANZAHL_MONATE_PRO_JAHR),
      2,
    );
    const brutto_steuer: Big = round(
      summe_EK_SS.add(summe_EK_NS).div(ANZAHL_MONATE_PRO_JAHR),
      2,
    );
    const brutto_sv: Big = round(
      summe_EK_SS.add(summe_EK_NS_SV).div(ANZAHL_MONATE_PRO_JAHR),
      2,
    );
    const betrachtungszeitraumRV: boolean[] = [];
    const betrachtungszeitraumKV: boolean[] = [];
    const betrachtungszeitraumAV: boolean[] = [];
    for (let i: number = 0; i < ANZAHL_MONATE_PRO_JAHR; i++) {
      betrachtungszeitraumRV.push(false);
      betrachtungszeitraumKV.push(false);
      betrachtungszeitraumAV.push(false);
      {
        const array = finanzDaten.mischEinkommenTaetigkeiten;
        for (const mischEkTaetigkeit of array) {
          if (
            mischEkTaetigkeit.bemessungsZeitraumMonate[i] &&
            mischEkTaetigkeit.erwerbsTaetigkeit !== ErwerbsTaetigkeit.MINIJOB
          ) {
            if (mischEkTaetigkeit.istRentenVersicherungsPflichtig) {
              betrachtungszeitraumRV[i] = true;
            }
            if (mischEkTaetigkeit.istKrankenVersicherungsPflichtig) {
              betrachtungszeitraumKV[i] = true;
            }
            if (mischEkTaetigkeit.istArbeitslosenVersicherungsPflichtig) {
              betrachtungszeitraumAV[i] = true;
            }
          }
        }
      }
    }
    const betrachtungsmonate_grenze: Big = Big(betrachtungsmonate).div(Big(2));
    let anzahl_monate_rv: Big = BIG_ZERO;
    let anzahl_monate_kv: Big = BIG_ZERO;
    let anzahl_monate_av: Big = BIG_ZERO;
    for (let i: number = 0; i < ANZAHL_MONATE_PRO_JAHR; i++) {
      if (betrachtungszeitraumRV[i]) {
        anzahl_monate_rv = anzahl_monate_rv.add(BIG_ONE);
      }
      if (betrachtungszeitraumKV[i]) {
        anzahl_monate_kv = anzahl_monate_kv.add(BIG_ONE);
      }
      if (betrachtungszeitraumAV[i]) {
        anzahl_monate_av = anzahl_monate_av.add(BIG_ONE);
      }
    }
    let rentenversicherungspflichtig: number = 0;
    let krankenversicherungspflichtig: number = 0;
    let arbeitslosenversicherungspflichtig: number = 0;
    if (greater(anzahl_monate_rv, betrachtungsmonate_grenze)) {
      rentenversicherungspflichtig = 1;
    }
    if (
      isEqual(anzahl_monate_rv, betrachtungsmonate_grenze) &&
      betrachtungszeitraumRV[letzter_Betrachtungsmonat]
    ) {
      rentenversicherungspflichtig = 1;
    }
    if (greater(anzahl_monate_kv, betrachtungsmonate_grenze)) {
      krankenversicherungspflichtig = 1;
    }
    if (
      isEqual(anzahl_monate_kv, betrachtungsmonate_grenze) &&
      betrachtungszeitraumKV[letzter_Betrachtungsmonat]
    ) {
      krankenversicherungspflichtig = 1;
    }
    if (greater(anzahl_monate_av, betrachtungsmonate_grenze)) {
      arbeitslosenversicherungspflichtig = 1;
    }
    if (
      isEqual(anzahl_monate_av, betrachtungsmonate_grenze) &&
      betrachtungszeitraumAV[letzter_Betrachtungsmonat]
    ) {
      arbeitslosenversicherungspflichtig = 1;
    }
    let status: ErwerbsArt = ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI;
    if (
      rentenversicherungspflichtig +
        krankenversicherungspflichtig +
        arbeitslosenversicherungspflichtig ===
      0
    ) {
      status = ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI;
    }
    if (greater(summe_EK_SS, summe_EK_NS.add(summe_EK_GNS))) {
      status = ErwerbsArt.JA_SELBSTSTAENDIG;
    }
    if (
      lessOrEqual(brutto_elg, GRENZE_MINI_MIDI) &&
      status !== ErwerbsArt.JA_SELBSTSTAENDIG
    ) {
      status = ErwerbsArt.JA_NICHT_SELBST_MINI;
    }
    persoenlicheDaten.etVorGeburt = status;
    if (rentenversicherungspflichtig === 1) {
      finanzDaten.rentenVersicherung =
        RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG;
    }
    if (krankenversicherungspflichtig === 1) {
      finanzDaten.kassenArt = KassenArt.GESETZLICH_PFLICHTVERSICHERT;
    }
    if (status === ErwerbsArt.JA_NICHT_SELBST_MINI) {
      netto = brutto_elg;
    } else {
      if (status === ErwerbsArt.JA_SELBSTSTAENDIG) {
        finanzDaten.steuerKlasse = SteuerKlasse.SKL4;
        finanzDaten.splittingFaktor = 1.0;
      }
      if (finanzDaten.steuerKlasse === SteuerKlasse.SKL4) {
        finanzDaten.splittingFaktor = 1.0;
      }
      if (finanzDaten.steuerKlasse === SteuerKlasse.SKL4_FAKTOR) {
        finanzDaten.steuerKlasse = SteuerKlasse.SKL4;
      }
      const summe_sozab: Big = new BruttoNettoRechner().summe_svb_misch(
        krankenversicherungspflichtig > 0,
        rentenversicherungspflichtig > 0,
        status,
        brutto_sv,
      );
      const summe_steuer_abzug: Big = new BruttoNettoRechner().summeSteuer(
        finanzDaten,
        status,
        brutto_steuer,
        lohnSteuerJahr,
      );
      netto = brutto_elg.sub(summe_steuer_abzug).sub(summe_sozab);
      steuern = summe_steuer_abzug;
      abgaben = summe_sozab;
    }
    const ek_vor: Big = netto;
    const elterngeldbasis: Big = round(this.elterngeld_keine_et(ek_vor), 2);
    return {
      krankenversicherungspflichtig: krankenversicherungspflichtig === 1,
      rentenversicherungspflichtig: rentenversicherungspflichtig === 1,
      netto: netto,
      brutto: brutto_elg,
      steuern: steuern,
      abgaben: abgaben,
      elterngeldbasis: elterngeldbasis,
      status: status,
    };
  }
}
