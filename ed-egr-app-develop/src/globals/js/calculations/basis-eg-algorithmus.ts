import Big from "big.js";
import { AbstractAlgorithmus } from "./abstract-algorithmus";
import {
  EgrBerechnungParamId,
  ErwerbsArt,
  ErwerbsTaetigkeit,
  FinanzDaten,
  KassenArt,
  MischEkZwischenErgebnis,
  PersoenlicheDaten,
  RentenArt,
  SteuerKlasse,
  YesNo,
} from "./model";
import { MathUtil } from "./common/math-util";
import { BruttoNettoRechner } from "./brutto-netto-rechner/brutto-netto-rechner";
import { Logger } from "./common/logger";

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
   * @param {number} lohnSteuerJahr Das Lohnsteuerjahr des angegebenen steuerpflichtigen Arbeitslohns.
   *
   * @return Das Zwischenergebnis bei Mischeinkommen.
   */
  public async berechneMischNettoUndBasiselterngeld(
    persoenlicheDaten: PersoenlicheDaten,
    finanzDaten: FinanzDaten,
    lohnSteuerJahr: number,
  ): Promise<MischEkZwischenErgebnis> {
    let netto: Big;
    let steuern: Big = Big(0);
    let abgaben: Big = Big(0);
    finanzDaten.mischEinkommenTaetigkeiten.forEach((mischEkTaetigkeit) => {
      if (
        MathUtil.greater(
          mischEkTaetigkeit.bruttoEinkommenDurchschnitt,
          EgrBerechnungParamId.GRENZE_MINI_MIDI,
        ) &&
        MathUtil.lessOrEqual(
          mischEkTaetigkeit.bruttoEinkommenDurchschnitt,
          EgrBerechnungParamId.GRENZE_MIDI_MAX,
        ) &&
        mischEkTaetigkeit.erwerbsTaetigkeit ===
          ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG
      ) {
        const midiRange: Big = EgrBerechnungParamId.GRENZE_MIDI_MAX.sub(
          EgrBerechnungParamId.GRENZE_MINI_MIDI,
        );
        const overMini: Big = mischEkTaetigkeit.bruttoEinkommenDurchschnitt.sub(
          EgrBerechnungParamId.GRENZE_MINI_MIDI,
        );
        const faktoredMin: Big = EgrBerechnungParamId.F_FAKTOR.mul(
          EgrBerechnungParamId.GRENZE_MINI_MIDI,
        );
        const faktoredMidi: Big = EgrBerechnungParamId.GRENZE_MIDI_MAX.sub(
          faktoredMin,
        )
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

      let array = finanzDaten.mischEinkommenTaetigkeiten;
      for (let index = 0; index < array.length; index++) {
        let mischEkTaetigkeit = array[index];
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
    let summe_EK_SS: Big = MathUtil.BIG_ZERO;
    let summe_EK_NS: Big = MathUtil.BIG_ZERO;
    let summe_EK_NS_SV: Big = MathUtil.BIG_ZERO;
    let summe_EK_GNS: Big = MathUtil.BIG_ZERO;
    let array = finanzDaten.mischEinkommenTaetigkeiten;
    for (let index = 0; index < array.length; index++) {
      let mischEkTaetigkeit = array[index];

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
            MathUtil.isEqual(
              mischEkTaetigkeit.bruttoEinkommenDurchschnittMidi,
              MathUtil.BIG_ZERO,
            )
          ) {
            summe_EK_NS_SV = summe_EK_NS_SV.add(bruttoGesamt);
          } else if (
            MathUtil.greater(
              mischEkTaetigkeit.bruttoEinkommenDurchschnittMidi,
              MathUtil.BIG_ZERO,
            )
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

    const brutto_elg: Big = MathUtil.round(
      summe_EK_SS
        .add(summe_EK_NS)
        .add(summe_EK_GNS)
        .sub(Big(zaehler_Pauschmonate).mul(EgrBerechnungParamId.PAUSCH))
        .div(ANZAHL_MONATE_PRO_JAHR),
      2,
    );
    const brutto_steuer: Big = MathUtil.round(
      summe_EK_SS.add(summe_EK_NS).div(ANZAHL_MONATE_PRO_JAHR),
      2,
    );
    const brutto_sv: Big = MathUtil.round(
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
        let array = finanzDaten.mischEinkommenTaetigkeiten;
        for (let index = 0; index < array.length; index++) {
          let mischEkTaetigkeit = array[index];

          if (
            mischEkTaetigkeit.bemessungsZeitraumMonate[i] &&
            mischEkTaetigkeit.erwerbsTaetigkeit !== ErwerbsTaetigkeit.MINIJOB
          ) {
            if (mischEkTaetigkeit.rentenVersicherungsPflichtig === YesNo.YES) {
              betrachtungszeitraumRV[i] = true;
            }
            if (mischEkTaetigkeit.krankenVersicherungsPflichtig === YesNo.YES) {
              betrachtungszeitraumKV[i] = true;
            }
            if (
              mischEkTaetigkeit.arbeitslosenVersicherungsPflichtig === YesNo.YES
            ) {
              betrachtungszeitraumAV[i] = true;
            }
          }
        }
      }
    }
    const betrachtungsmonate_grenze: Big = Big(betrachtungsmonate).div(Big(2));
    let anzahl_monate_rv: Big = MathUtil.BIG_ZERO;
    let anzahl_monate_kv: Big = MathUtil.BIG_ZERO;
    let anzahl_monate_av: Big = MathUtil.BIG_ZERO;
    for (let i: number = 0; i < ANZAHL_MONATE_PRO_JAHR; i++) {
      if (betrachtungszeitraumRV[i]) {
        anzahl_monate_rv = anzahl_monate_rv.add(MathUtil.BIG_ONE);
      }
      if (betrachtungszeitraumKV[i]) {
        anzahl_monate_kv = anzahl_monate_kv.add(MathUtil.BIG_ONE);
      }
      if (betrachtungszeitraumAV[i]) {
        anzahl_monate_av = anzahl_monate_av.add(MathUtil.BIG_ONE);
      }
    }
    let rentenversicherungspflichtig: number = 0;
    let krankenversicherungspflichtig: number = 0;
    let arbeitslosenversicherungspflichtig: number = 0;
    if (MathUtil.greater(anzahl_monate_rv, betrachtungsmonate_grenze)) {
      rentenversicherungspflichtig = 1;
    }
    if (
      MathUtil.isEqual(anzahl_monate_rv, betrachtungsmonate_grenze) &&
      betrachtungszeitraumRV[letzter_Betrachtungsmonat]
    ) {
      rentenversicherungspflichtig = 1;
    }
    if (MathUtil.greater(anzahl_monate_kv, betrachtungsmonate_grenze)) {
      krankenversicherungspflichtig = 1;
    }
    if (
      MathUtil.isEqual(anzahl_monate_kv, betrachtungsmonate_grenze) &&
      betrachtungszeitraumKV[letzter_Betrachtungsmonat]
    ) {
      krankenversicherungspflichtig = 1;
    }
    if (MathUtil.greater(anzahl_monate_av, betrachtungsmonate_grenze)) {
      arbeitslosenversicherungspflichtig = 1;
    }
    if (
      MathUtil.isEqual(anzahl_monate_av, betrachtungsmonate_grenze) &&
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
    if (MathUtil.greater(summe_EK_SS, summe_EK_NS.add(summe_EK_GNS))) {
      status = ErwerbsArt.JA_SELBSTSTAENDIG;
    }
    if (
      MathUtil.lessOrEqual(brutto_elg, EgrBerechnungParamId.GRENZE_MINI_MIDI) &&
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
      Logger.log(
        `Berechne Summe der Sozialabgaben mit: kv=${krankenversicherungspflichtig}, rv=${rentenversicherungspflichtig}, status=${status}, brutto_sv=${brutto_sv}`,
      );
      const summe_sozab: Big = new BruttoNettoRechner().summe_svb_misch(
        krankenversicherungspflichtig > 0,
        rentenversicherungspflichtig > 0,
        status,
        brutto_sv,
      );
      const summe_steuer_abzug: Big =
        await new BruttoNettoRechner().summeSteuer(
          finanzDaten,
          status,
          brutto_steuer,
          lohnSteuerJahr,
        );
      netto = brutto_elg.sub(summe_steuer_abzug).sub(summe_sozab);
      steuern = summe_steuer_abzug;
      abgaben = summe_sozab;
      Logger.log(
        `Netto (${netto}) berechnet aus Brutto ${brutto_elg} und Abgaben SV=${summe_sozab}, Steuer=${summe_steuer_abzug}`,
      );
    }
    const ek_vor: Big = netto;
    const elterngeldbasis: Big = MathUtil.round(
      this.elterngeld_keine_et(ek_vor),
      2,
    );
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
