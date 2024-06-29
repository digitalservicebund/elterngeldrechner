import Big from "big.js";
import { AbstractAlgorithmus } from "./abstract-algorithmus";
import {
  EgrBerechnungParamId,
  ElternGeldArt,
  ElternGeldAusgabe,
  ElternGeldKategorie,
  ElternGeldPerioden,
  ElternGeldPlusErgebnis,
  ErwerbsArt,
  FinanzDaten,
  FinanzDatenBerechnet,
  MischEkZwischenErgebnis,
  MutterschaftsLeistung,
  mutterschaftsLeistungInMonaten,
  PersoenlicheDaten,
  PLANUNG_ANZAHL_MONATE,
  PlanungsDaten,
  YesNo,
  zaehleMonateErwerbsTaetigkeit,
  ZwischenErgebnis,
} from "./model";
import { MathUtil } from "./common/math-util";
import { BruttoNettoRechner } from "./brutto-netto-rechner/brutto-netto-rechner";
import { DateUtil } from "./common/date-util";
import { ElternGeldBruttoRechner } from "./eg-brutto-rechner";
import { errorOf } from "./calculation-error-code";

export class PlusEgAlgorithmus extends AbstractAlgorithmus {
  private bruttoNettoRechner = new BruttoNettoRechner();

  private pb_von: Date | null = null;
  private pb_bis: Date | null = null;
  private partnerbonus: YesNo = YesNo.NO;
  // Das Array wird mit Index 1-32 benutzt.
  public anfang_LM: Date[] = new Array<Date>(PLANUNG_ANZAHL_MONATE + 1);
  // Das Array wird mit Index 1-32 benutzt.
  public ende_LM: Date[] = new Array<Date>(PLANUNG_ANZAHL_MONATE + 1);

  public async elterngeldPlusErgebnis(
    planungsergebnis: PlanungsDaten,
    persoenlicheDaten: PersoenlicheDaten,
    finanzDaten: FinanzDaten,
    lohnSteuerJahr: number,
    mischEkZwischenErgebnis: MischEkZwischenErgebnis | null,
    z: ZwischenErgebnis,
  ): Promise<ElternGeldPlusErgebnis> {
    // Das Array wird mit Index 1-32 benutzt.
    let brutto_LM_Plus = new Array<Big>(PLANUNG_ANZAHL_MONATE + 1);
    // Das Array wird mit Index 1-32 benutzt.
    let brutto_LM_Basis = new Array<Big>(PLANUNG_ANZAHL_MONATE + 1);
    brutto_LM_Plus.fill(MathUtil.BIG_ZERO);
    brutto_LM_Basis.fill(MathUtil.BIG_ZERO);
    const etVorGeburt: boolean =
      persoenlicheDaten.etVorGeburt !== ErwerbsArt.NEIN;
    const eg_verlauf: ElternGeldArt[] = planungsergebnis.planung;
    let ergebnis: ElternGeldPlusErgebnis;
    const finanzDatenBerechnet: FinanzDatenBerechnet = {
      bruttoEinkommenDurch: MathUtil.BIG_ZERO,
      bruttoEinkommenPlusDurch: MathUtil.BIG_ZERO,
      bruttoLMBasis: [],
      bruttoLMPlus: [],
      lmMitETBasis: 0,
      lmMitETPlus: 0,
      summeBruttoBasis: MathUtil.BIG_ZERO,
      summeBruttoPlus: MathUtil.BIG_ZERO,
    };
    if (!etVorGeburt) {
      ergebnis = PlusEgAlgorithmus.ohneETVorGeburt();
    } else {
      ergebnis = await this.mitETVorGeburt(
        planungsergebnis,
        persoenlicheDaten,
        finanzDaten,
        lohnSteuerJahr,
        mischEkZwischenErgebnis,
        z,
      );
    }
    this.partnerbonus = YesNo.NO;
    //let listBruttoLMBasis: Array<Big> = finanzDatenBerechnet.bruttoLMBasis;
    //let listBruttoLMPlus: Array<Big> = finanzDatenBerechnet.bruttoLMPlus;
    const listBruttoLMPlus = finanzDaten.bruttoLeistungsMonateWithPlanung(
      true,
      planungsergebnis,
    );
    const listBruttoLMBasis = finanzDaten.bruttoLeistungsMonateWithPlanung(
      false,
      planungsergebnis,
    );
    if (listBruttoLMBasis != null && listBruttoLMBasis.length > 0) {
      brutto_LM_Basis = listBruttoLMBasis;
    }
    if (listBruttoLMPlus != null && listBruttoLMPlus.length > 0) {
      brutto_LM_Plus = listBruttoLMPlus;
    }
    finanzDatenBerechnet.bruttoLMBasis = listBruttoLMBasis;
    finanzDatenBerechnet.bruttoLMPlus = listBruttoLMPlus;
    if (!etVorGeburt) {
      // Das Array wird mit Index 1-32 benutzt.
      finanzDatenBerechnet.bruttoLMPlus = new Array<Big>(
        PLANUNG_ANZAHL_MONATE + 1,
      ).fill(MathUtil.BIG_ZERO);
    }
    const verlauf: ElternGeldKategorie[] = this.determineElternGeldKategorie(
      finanzDatenBerechnet,
      eg_verlauf,
      brutto_LM_Basis,
      brutto_LM_Plus,
      etVorGeburt,
    );
    ergebnis = this.validateEinkommenPartnerBonus(ergebnis);
    return this.createElterngeldAusgabe(
      persoenlicheDaten,
      finanzDaten,
      ergebnis,
      z,
      mischEkZwischenErgebnis,
      verlauf,
      planungsergebnis,
    );
  }

  private static getEKVor(
    finanzDaten: FinanzDaten,
    ek_vor: Big,
    mischEkZwischenErgebnis: MischEkZwischenErgebnis | null,
  ) {
    if (finanzDaten.isMischeinkommen()) {
      if (mischEkZwischenErgebnis === null) {
        throw errorOf("MischEinkommenEnabledButMissingMischEinkommen");
      }

      ek_vor = mischEkZwischenErgebnis.netto;
      if (mischEkZwischenErgebnis.status !== ErwerbsArt.JA_SELBSTSTAENDIG) {
        ek_vor = ek_vor.add(EgrBerechnungParamId.PAUSCH);
      }
    }
    return ek_vor;
  }

  private static ohneETVorGeburt(): ElternGeldPlusErgebnis {
    return {
      anfangEGPeriode: [],
      elternGeldAusgabe: [],
      endeEGPeriode: [],
      ersatzRate: MathUtil.BIG_ZERO,
      etVorGeburt: false,
      geschwisterBonus: MathUtil.BIG_ZERO,
      geschwisterBonusDeadLine: null,
      hasPartnerBonusError: false,
      mehrlingsZulage: MathUtil.BIG_ZERO,
      nettoNachGeburtDurch: MathUtil.BIG_ZERO,

      elternGeldBasis: EgrBerechnungParamId.MINDESTSATZ,
      elternGeldKeineEtPlus: EgrBerechnungParamId.MINDESTSATZ.div(Big(2)),
      message:
        "Sie erhalten 300 Euro Elterngeld sowie evtl. Geschwisterbonus und/oder Mehrlingszuschlag",
      bruttoBasis: MathUtil.BIG_ZERO,
      nettoBasis: MathUtil.BIG_ZERO,
      elternGeldErwBasis: MathUtil.BIG_ZERO,
      bruttoPlus: MathUtil.BIG_ZERO,
      nettoPlus: MathUtil.BIG_ZERO,
      elternGeldEtPlus: MathUtil.BIG_ZERO,
    };
  }

  private async mitETVorGeburt(
    planungsergebnis: PlanungsDaten,
    persoenlicheDaten: PersoenlicheDaten,
    finanzDaten: FinanzDaten,
    lohnSteuerJahr: number,
    mischEkZwischenErgebnis: MischEkZwischenErgebnis | null,
    z: ZwischenErgebnis,
  ): Promise<ElternGeldPlusErgebnis> {
    const nicht_erw: YesNo = persoenlicheDaten.etNachGeburt;
    let ek_nach_plus: Big;
    let elterngeld_erw_plus: Big;
    let brutto_basis: Big = MathUtil.BIG_ZERO;
    let netto_basis: Big = MathUtil.BIG_ZERO;
    let elterngeld_erw_basis: Big = MathUtil.BIG_ZERO;
    let brutto_plus: Big = MathUtil.BIG_ZERO;
    let netto_plus: Big = MathUtil.BIG_ZERO;
    let elterngeld_et_plus: Big = MathUtil.BIG_ZERO;
    let elterngeld_keine_et_plus: Big = MathUtil.BIG_ZERO;
    let elternGeldPerioden: ElternGeldPerioden = { anfang: [], ende: [] };
    if (nicht_erw === YesNo.YES) {
      // es liegt Erwerbstätigkeit nach der Geburt vor
      const pausch: Big = EgrBerechnungParamId.PAUSCH;
      // if (finanzDaten.erwerbsZeitraumLeistungsMonatList == null) {
      //   finanzDaten.erwerbsZeitraumLeistungsMonatList = [];
      // }
      if (persoenlicheDaten.wahrscheinlichesGeburtsDatum === undefined) {
        throw new Error("wahrscheinlichesGeburtsDatum === undefined");
      }
      const geburt: Date = persoenlicheDaten.wahrscheinlichesGeburtsDatum;
      const anzahl_monate: number = zaehleMonateErwerbsTaetigkeit(
        finanzDaten.erwerbsZeitraumLebensMonatList,
      );
      if (anzahl_monate != null && anzahl_monate !== 0) {
        elternGeldPerioden = PlusEgAlgorithmus.determineEGPerioden(
          finanzDaten,
          planungsergebnis,
        );
        let summe_brutto_basis: Big = MathUtil.BIG_ZERO;
        let summe_brutto_plus: Big = MathUtil.BIG_ZERO;
        this.fillLebensMonateList(geburt);
        persoenlicheDaten.anfangLM = this.anfang_LM;
        persoenlicheDaten.endeLM = this.ende_LM;
        const finanzDatenBerechnet = ElternGeldBruttoRechner.bruttoEGPlusNeu(
          planungsergebnis,
          finanzDaten,
        );
        const lm_mit_et_basis: number = finanzDatenBerechnet.lmMitETBasis;
        const lm_mit_et_plus: number = finanzDatenBerechnet.lmMitETPlus;
        const bruttoLMPlus: Array<Big> =
          finanzDaten.bruttoLeistungsMonateWithPlanung(true, planungsergebnis);
        const bruttoLMBasis: Array<Big> =
          finanzDaten.bruttoLeistungsMonateWithPlanung(false, planungsergebnis);
        const brutto_LM_Plus: Big[] = /* toArray */ bruttoLMPlus.slice(0);
        const brutto_LM_Basis: Big[] = /* toArray */ bruttoLMBasis.slice(0);
        let steuer_sozab_basis: Big = MathUtil.BIG_ZERO;
        let steuer_sozab_plus: Big = MathUtil.BIG_ZERO;
        brutto_basis = finanzDatenBerechnet.bruttoEinkommenDurch;
        brutto_plus = finanzDatenBerechnet.bruttoEinkommenPlusDurch;
        if (persoenlicheDaten.etVorGeburt === ErwerbsArt.JA_NICHT_SELBST_MINI) {
          netto_basis = brutto_basis;
          netto_plus = brutto_plus;
        } else {
          if (MathUtil.greater(brutto_basis, MathUtil.BIG_ZERO)) {
            steuer_sozab_basis = await this.bruttoNettoRechner.abzuege(
              brutto_basis,
              lohnSteuerJahr,
              finanzDaten,
              persoenlicheDaten.etVorGeburt,
            );
          }
          if (MathUtil.greater(brutto_plus, MathUtil.BIG_ZERO)) {
            steuer_sozab_plus = await this.bruttoNettoRechner.abzuege(
              brutto_plus,
              lohnSteuerJahr,
              finanzDaten,
              persoenlicheDaten.etVorGeburt,
            );
          }
        }
        let ek_vor: Big = z.nettoVorGeburt;
        ek_vor = PlusEgAlgorithmus.getEKVor(
          finanzDaten,
          ek_vor,
          mischEkZwischenErgebnis,
        );
        if (MathUtil.greater(brutto_basis, MathUtil.BIG_ZERO)) {
          switch (persoenlicheDaten.etVorGeburt) {
            case ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI:
            case ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI:
            case ErwerbsArt.JA_NICHT_SELBST_MINI:
              ek_vor = MathUtil.fMax(
                MathUtil.round(ek_vor.sub(EgrBerechnungParamId.PAUSCH)),
                MathUtil.BIG_ZERO,
              );
              summe_brutto_basis = MathUtil.BIG_ZERO;
              for (let i: number = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
                if (
                  !MathUtil.isEqual(brutto_LM_Basis[i], MathUtil.BIG_ZERO) &&
                  planungsergebnis.get(i) === ElternGeldArt.BASIS_ELTERNGELD
                ) {
                  summe_brutto_basis = summe_brutto_basis.add(
                    MathUtil.round(
                      MathUtil.fMax(
                        brutto_LM_Basis[i].sub(pausch),
                        MathUtil.BIG_ZERO,
                      ),
                      2,
                    ),
                  );
                }
              }
              if (lm_mit_et_basis > 0) {
                brutto_basis = MathUtil.round(
                  summe_brutto_basis.div(Big(lm_mit_et_basis)),
                  2,
                );
              }
              break;
            default:
          }
          netto_basis = MathUtil.fMax(
            brutto_basis.sub(steuer_sozab_basis),
            MathUtil.BIG_ZERO,
          );
          const ek_nach_basis: Big = netto_basis;
          elterngeld_erw_basis = MathUtil.round(
            this.elterngeld_et(ek_vor, ek_nach_basis),
            2,
          );
        }
        if (MathUtil.greater(brutto_plus, MathUtil.BIG_ZERO)) {
          let status: ErwerbsArt;
          if (finanzDaten.isMischeinkommen()) {
            if (mischEkZwischenErgebnis === null) {
              throw errorOf("MischEinkommenEnabledButMissingMischEinkommen");
            }
            status = mischEkZwischenErgebnis.status;
          } else {
            status = persoenlicheDaten.etVorGeburt;
          }
          ek_vor = z.nettoVorGeburt;
          ek_vor = PlusEgAlgorithmus.getEKVor(
            finanzDaten,
            ek_vor,
            mischEkZwischenErgebnis,
          );
          switch (status) {
            case ErwerbsArt.JA_NICHT_SELBST_MINI:
            case ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI:
            case ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI:
              ek_vor = MathUtil.fMax(
                ek_vor.sub(EgrBerechnungParamId.PAUSCH),
                MathUtil.BIG_ZERO,
              );
              summe_brutto_plus = MathUtil.BIG_ZERO;
              for (let i: number = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
                if (
                  !MathUtil.isEqual(brutto_LM_Plus[i], MathUtil.BIG_ZERO) &&
                  (planungsergebnis.get(i) === ElternGeldArt.ELTERNGELD_PLUS ||
                    planungsergebnis.get(i) ===
                      ElternGeldArt.PARTNERSCHAFTS_BONUS)
                ) {
                  summe_brutto_plus = summe_brutto_plus.add(
                    MathUtil.round(
                      MathUtil.fMax(
                        brutto_LM_Plus[i].sub(pausch),
                        MathUtil.BIG_ZERO,
                      ),
                      2,
                    ),
                  );
                }
              }
              if (lm_mit_et_plus > 0) {
                brutto_plus = MathUtil.round(
                  summe_brutto_plus.div(Big(lm_mit_et_plus)),
                  2,
                );
              }
              break;
            default:
          }
        }
        netto_plus = MathUtil.fMax(
          brutto_plus.sub(steuer_sozab_plus),
          MathUtil.BIG_ZERO,
        );
        ek_nach_plus = netto_plus;
        elterngeld_erw_plus = MathUtil.round(
          this.elterngeldplus_et(ek_vor, ek_nach_plus),
          2,
        );
        elterngeld_keine_et_plus = z.elternGeld;
        if (finanzDaten.isMischeinkommen()) {
          if (mischEkZwischenErgebnis === null) {
            throw errorOf("MischEinkommenEnabledButMissingMischEinkommen");
          }
          elterngeld_keine_et_plus = mischEkZwischenErgebnis.elterngeldbasis;
        }
        elterngeld_keine_et_plus = elterngeld_keine_et_plus.div(Big(2));
        elterngeld_et_plus = MathUtil.fMin(
          elterngeld_keine_et_plus,
          elterngeld_erw_plus,
        );
      }
    } else {
      // Sollten keine Perioden angegeben sein, so berechne nichts
      netto_plus = MathUtil.BIG_ZERO;
      elterngeld_keine_et_plus = MathUtil.BIG_ZERO;
      elterngeld_et_plus = MathUtil.BIG_ZERO;
    }
    return {
      anfangEGPeriode: elternGeldPerioden.anfang,
      endeEGPeriode: elternGeldPerioden.ende,
      elternGeldErwBasis: MathUtil.round(elterngeld_erw_basis, 2),
      bruttoBasis: MathUtil.round(brutto_basis, 2),
      nettoBasis: MathUtil.round(netto_basis, 2),
      bruttoPlus: MathUtil.round(brutto_plus, 2),
      nettoPlus: MathUtil.round(netto_plus, 2),
      elternGeldEtPlus: MathUtil.round(elterngeld_et_plus, 2),
      elternGeldKeineEtPlus: MathUtil.round(elterngeld_keine_et_plus, 2),
      elternGeldAusgabe: [],
      elternGeldBasis: MathUtil.BIG_ZERO,
      ersatzRate: MathUtil.BIG_ZERO,
      etVorGeburt: false,
      geschwisterBonus: MathUtil.BIG_ZERO,
      geschwisterBonusDeadLine: null,
      hasPartnerBonusError: false,
      mehrlingsZulage: MathUtil.BIG_ZERO,
      message: "",
      nettoNachGeburtDurch: MathUtil.BIG_ZERO,
    };
  }

  public fillLebensMonateList(geburt: Date) {
    // Die Arrays anfang_LM und ende_LM werden mit Index 1-32 benutzt.
    for (let i: number = 0; i < PLANUNG_ANZAHL_MONATE; i++) {
      const anfang: Date = DateUtil.plusMonths(geburt, i);
      const ende: Date = DateUtil.minusDays(
        DateUtil.plusMonths(geburt, i + 1),
        1,
      );
      this.anfang_LM[i + 1] = anfang;
      this.ende_LM[i + 1] = ende;
      if (
        geburt.getDay() > 28 &&
        anfang.getMonth() === 2 &&
        anfang.getDay() < 5
      ) {
        // this.anfang_LM[i] = new DateTime(new GregorianCalendar(calGeburt.get(YEAR), calGeburt.get(MONTH) + i + 1, 1).getTime());
        this.anfang_LM[i + 1] = DateUtil.setDayOfMonth(
          DateUtil.plusMonths(geburt, i + 1),
          1,
        );
      }
      if (geburt.getDay() > 28 && ende.getMonth() === 2 && ende.getDay() < 5) {
        // this.anfang_LM[i] = new DateTime(new GregorianCalendar(calGeburt.get(YEAR), calGeburt.get(MONTH) + i + 2, 0).getTime());
        this.anfang_LM[i + 1] = DateUtil.minusDays(
          DateUtil.setDayOfMonth(DateUtil.plusMonths(geburt, i + 2), 1),
          1,
        );
      }
    }
  }

  private determineElternGeldKategorie(
    finanzDatenBerechnet: FinanzDatenBerechnet,
    eg_verlauf: ElternGeldArt[], // Das Array wird mit Index 0-31 benutzt.
    brutto_LM_Basis: Big[], // Das Array wird mit Index 1-32 benutzt.
    brutto_LM_Plus: Big[], // Das Array wird mit Index 1-32 benutzt.
    etVorGeburt: boolean,
  ): ElternGeldKategorie[] {
    const verlauf = new Array<ElternGeldKategorie>(PLANUNG_ANZAHL_MONATE);

    this.partnerbonus = YesNo.NO;
    let pbMonatVon: number = 0;
    let pbMonatBis: number = 0;
    let counter: number = 0;
    for (let index = 0; index < eg_verlauf.length; index++) {
      const monat = eg_verlauf[index];
      counter++;
      if (monat === ElternGeldArt.PARTNERSCHAFTS_BONUS && pbMonatVon === 0) {
        pbMonatVon = counter;
        pbMonatBis = counter;
      } else if (monat === ElternGeldArt.PARTNERSCHAFTS_BONUS) {
        pbMonatBis = counter;
      }
    }
    if (!etVorGeburt) {
      // **************************************************************************************************
      // Abweichung vom FIT Algorithmus: an dieser Stelle noch berücksichtigen, ob ET nach Geburt angegeben
      // dies dient zur Validierung des PB-Fehlers im Schritt 4
      const brutto_LM_Plus_pb = finanzDatenBerechnet.bruttoLMPlus;
      for (let i: number = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
        if (eg_verlauf[i - 1] !== ElternGeldArt.BASIS_ELTERNGELD) {
          verlauf[i - 1] = ElternGeldKategorie.KEIN_ELTERN_GELD;
        }
        if (eg_verlauf[i - 1] === ElternGeldArt.BASIS_ELTERNGELD) {
          verlauf[i - 1] = ElternGeldKategorie.BASIS_ELTERN_GELD;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.ELTERNGELD_PLUS &&
          MathUtil.isEqual(brutto_LM_Plus_pb[i], MathUtil.BIG_ZERO)
        ) {
          verlauf[i - 1] =
            ElternGeldKategorie.ELTERN_GELD_PLUS_OHNE_ERWERBS_TAETIGKEIT;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.PARTNERSCHAFTS_BONUS &&
          MathUtil.isEqual(brutto_LM_Plus_pb[i], MathUtil.BIG_ZERO)
        ) {
          verlauf[i - 1] =
            ElternGeldKategorie.ELTERN_GELD_PLUS_OHNE_ERWERBS_TAETIGKEIT;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.PARTNERSCHAFTS_BONUS &&
          MathUtil.isEqual(brutto_LM_Plus[i], MathUtil.BIG_ZERO)
        ) {
          this.partnerbonus = YesNo.YES;
          break;
        }
      }
    } else {
      for (let i: number = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
        if (eg_verlauf[i - 1] === ElternGeldArt.KEIN_BEZUG) {
          verlauf[i - 1] = ElternGeldKategorie.KEIN_ELTERN_GELD;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.BASIS_ELTERNGELD &&
          MathUtil.isEqual(brutto_LM_Basis[i], MathUtil.BIG_ZERO)
        ) {
          verlauf[i - 1] = ElternGeldKategorie.BASIS_ELTERN_GELD;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.BASIS_ELTERNGELD &&
          MathUtil.greater(brutto_LM_Basis[i], MathUtil.BIG_ZERO)
        ) {
          verlauf[i - 1] =
            ElternGeldKategorie.BASIS_ELTERN_GELD_MIT_ERWERBS_TAETIGKEIT;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.ELTERNGELD_PLUS &&
          MathUtil.isEqual(brutto_LM_Plus[i], MathUtil.BIG_ZERO)
        ) {
          verlauf[i - 1] =
            ElternGeldKategorie.ELTERN_GELD_PLUS_OHNE_ERWERBS_TAETIGKEIT;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.PARTNERSCHAFTS_BONUS &&
          MathUtil.isEqual(brutto_LM_Plus[i], MathUtil.BIG_ZERO)
        ) {
          this.partnerbonus = YesNo.YES;
          break;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.ELTERNGELD_PLUS &&
          MathUtil.greater(brutto_LM_Plus[i], MathUtil.BIG_ZERO)
        ) {
          verlauf[i - 1] =
            ElternGeldKategorie.ELTERN_GELD_PLUS_MIT_ERWERBS_TAETIGKEIT;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.PARTNERSCHAFTS_BONUS &&
          MathUtil.greater(brutto_LM_Plus[i], MathUtil.BIG_ZERO)
        ) {
          verlauf[i - 1] =
            ElternGeldKategorie.ELTERN_GELD_PLUS_MIT_ERWERBS_TAETIGKEIT;
        }
      }
    }
    if (
      pbMonatVon !== 0 &&
      pbMonatBis !== 0 &&
      this.partnerbonus === YesNo.YES
    ) {
      if (
        this.anfang_LM[pbMonatVon - 1] != null &&
        this.ende_LM[pbMonatBis - 1] != null
      ) {
        this.pb_von = this.anfang_LM[pbMonatVon - 1];
        this.pb_bis = this.ende_LM[pbMonatBis - 1];
      }
    }
    return verlauf;
  }

  private createElterngeldAusgabe(
    persoenlicheDaten: PersoenlicheDaten,
    finanzDaten: FinanzDaten,
    ergebnis: ElternGeldPlusErgebnis,
    z: ZwischenErgebnis,
    misch: MischEkZwischenErgebnis | null,
    verlauf: ElternGeldKategorie[],
    planungsergebnis: PlanungsDaten,
  ): ElternGeldPlusErgebnis {
    if (persoenlicheDaten.wahrscheinlichesGeburtsDatum === undefined) {
      throw new Error("wahrscheinlichesGeburtsDatum === undefined");
    }
    const ende_geschwisterbonus: Date | null = z.zeitraumGeschwisterBonus;
    const geschw = new Array<number>(PLANUNG_ANZAHL_MONATE).fill(0);
    if (persoenlicheDaten.isGeschwisterVorhanden()) {
      // es sind Geschwister vorhanden
      const geburt = persoenlicheDaten.wahrscheinlichesGeburtsDatum;
      if (ende_geschwisterbonus != null && ende_geschwisterbonus >= geburt) {
        for (let i = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
          this.anfang_LM[i] = DateUtil.plusMonths(geburt, i - 1);
        }
        for (let i = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
          this.ende_LM[i] = DateUtil.minusDays(
            DateUtil.plusMonths(geburt, i),
            1,
          );
        }
      }
      for (let i = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
        if (
          ende_geschwisterbonus != null &&
          ende_geschwisterbonus >= this.ende_LM[i]
        ) {
          geschw[i - 1] = 1;
        }
      }
    }
    ergebnis.geschwisterBonusDeadLine = ende_geschwisterbonus;
    const ausgabeLebensmonate: ElternGeldAusgabe[] = [];
    let basiselterngeld: Big = z.elternGeld;
    if (finanzDaten.isMischeinkommen()) {
      if (misch === null) {
        throw errorOf("MischEinkommenEnabledButMissingMischEinkommen");
      }
      basiselterngeld = misch.elterngeldbasis;
    }
    const basiselterngeld_erw: Big = ergebnis.elternGeldErwBasis;
    const elterngeldplus: Big = MathUtil.round(basiselterngeld.div(Big(2)), 2);
    const elterngeldplus_erw: Big = ergebnis.elternGeldEtPlus;
    const betrag_mehrlingszuschlag: Big =
      EgrBerechnungParamId.BETRAG_MEHRLINGSZUSCHLAG;
    const min_geschwisterbonus: Big = EgrBerechnungParamId.MIN_GESCHWISTERBONUS;
    const rate_bonus: Big = EgrBerechnungParamId.RATE_BONUS;
    let mehrling: number = 0;
    if (persoenlicheDaten.anzahlKuenftigerKinder > 0) {
      mehrling = persoenlicheDaten.anzahlKuenftigerKinder - 1;
    }
    for (let i: number = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
      const ausgabe: ElternGeldAusgabe = {
        lebensMonat: i,
        elterngeldArt: planungsergebnis.get(i),
        elternGeld: MathUtil.BIG_ZERO,
        geschwisterBonus: MathUtil.BIG_ZERO,
        mehrlingsZulage: MathUtil.BIG_ZERO,
        mutterschaftsLeistungMonat: false,
      };
      if (
        PlusEgAlgorithmus.isMutterschaftsLeistungImMonat(i, planungsergebnis)
      ) {
        ausgabe.mutterschaftsLeistungMonat = true;
      } else if (this.partnerbonus === YesNo.YES) {
        // es ist schon alles auf 0 gesetzt
      } else {
        let geschwisterbonus: Big = MathUtil.BIG_ZERO;
        let mehrlingszuschlag: Big = MathUtil.BIG_ZERO;
        let elterngeld: Big = MathUtil.BIG_ZERO;
        if (verlauf[i - 1] === ElternGeldKategorie.KEIN_ELTERN_GELD) {
          geschwisterbonus = MathUtil.BIG_ZERO;
          mehrlingszuschlag = MathUtil.BIG_ZERO;
          elterngeld = MathUtil.BIG_ZERO;
        }
        if (verlauf[i - 1] === ElternGeldKategorie.BASIS_ELTERN_GELD) {
          geschwisterbonus = MathUtil.round(
            MathUtil.fMax(
              min_geschwisterbonus,
              basiselterngeld.mul(rate_bonus),
            ).mul(Big(geschw[i - 1])),
            2,
          );
          mehrlingszuschlag = betrag_mehrlingszuschlag.mul(Big(mehrling));
          elterngeld = basiselterngeld
            .add(geschwisterbonus)
            .add(mehrlingszuschlag);
        }
        if (
          verlauf[i - 1] ===
          ElternGeldKategorie.BASIS_ELTERN_GELD_MIT_ERWERBS_TAETIGKEIT
        ) {
          mehrlingszuschlag = betrag_mehrlingszuschlag.mul(Big(mehrling));
          geschwisterbonus = MathUtil.round(
            MathUtil.fMax(
              min_geschwisterbonus,
              basiselterngeld_erw.mul(rate_bonus),
            ).mul(Big(geschw[i - 1])),
            2,
          );
          elterngeld = basiselterngeld_erw
            .add(geschwisterbonus)
            .add(mehrlingszuschlag);
        }
        if (
          verlauf[i - 1] ===
          ElternGeldKategorie.ELTERN_GELD_PLUS_OHNE_ERWERBS_TAETIGKEIT
        ) {
          mehrlingszuschlag = betrag_mehrlingszuschlag
            .mul(Big(mehrling))
            .div(Big(2));
          geschwisterbonus = MathUtil.round(
            MathUtil.fMax(
              min_geschwisterbonus.div(Big(2)),
              elterngeldplus.mul(rate_bonus),
            ).mul(Big(geschw[i - 1])),
            2,
          );
          elterngeld = elterngeldplus
            .add(geschwisterbonus)
            .add(mehrlingszuschlag);
        }
        if (
          verlauf[i - 1] ===
          ElternGeldKategorie.ELTERN_GELD_PLUS_MIT_ERWERBS_TAETIGKEIT
        ) {
          mehrlingszuschlag = betrag_mehrlingszuschlag
            .mul(Big(mehrling))
            .div(Big(2));
          geschwisterbonus = MathUtil.round(
            MathUtil.fMax(
              min_geschwisterbonus.div(Big(2)),
              elterngeldplus_erw.mul(rate_bonus),
            ).mul(Big(geschw[i - 1])),
            2,
          );
          elterngeld = elterngeldplus_erw
            .add(geschwisterbonus)
            .add(mehrlingszuschlag);
        }
        ausgabe.elternGeld = MathUtil.round(elterngeld);
        ausgabe.mehrlingsZulage = MathUtil.round(mehrlingszuschlag);
        ausgabe.geschwisterBonus = MathUtil.round(geschwisterbonus);
      }
      ausgabeLebensmonate.push(ausgabe);
    }

    if (ergebnis.ersatzRate == null) {
      ergebnis.ersatzRate = MathUtil.round(z.ersatzRate);
    }
    ergebnis.elternGeldBasis = MathUtil.round(basiselterngeld);
    ergebnis.elternGeldErwBasis = MathUtil.round(basiselterngeld_erw);
    ergebnis.elternGeldKeineEtPlus = MathUtil.round(elterngeldplus);
    ergebnis.elternGeldEtPlus = MathUtil.round(elterngeldplus_erw);
    ergebnis.mehrlingsZulage = MathUtil.round(z.mehrlingsZulage);
    ergebnis.geschwisterBonus = MathUtil.round(z.geschwisterBonus);
    if (
      !persoenlicheDaten.etVorGeburt ||
      persoenlicheDaten.etVorGeburt === ErwerbsArt.NEIN
    ) {
      ergebnis.etVorGeburt = false;
    }
    ergebnis.elternGeldAusgabe = ausgabeLebensmonate;
    return ergebnis;
  }

  private static isMutterschaftsLeistungImMonat(
    monat: number,
    planungsergebnis: PlanungsDaten,
  ): boolean {
    return (
      planungsergebnis.mutterschaftsLeistung != null &&
      planungsergebnis.mutterschaftsLeistung !==
        MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN &&
      monat <=
        mutterschaftsLeistungInMonaten(planungsergebnis.mutterschaftsLeistung)
    );
  }

  private validateEinkommenPartnerBonus(
    ergebnis: ElternGeldPlusErgebnis,
  ): ElternGeldPlusErgebnis {
    ergebnis.hasPartnerBonusError = false;
    if (this.partnerbonus === YesNo.YES) {
      ergebnis.hasPartnerBonusError = true;
      // TODO TW message entfernen
      ergebnis.message =
        "Während des Bezugs des Partnerschaftsbonus muss Erwerbstätigkeit vorliegen.";
      ergebnis.bruttoBasis = MathUtil.BIG_ZERO;
      ergebnis.nettoBasis = MathUtil.BIG_ZERO;
      ergebnis.elternGeldErwBasis = MathUtil.BIG_ZERO;
      ergebnis.bruttoPlus = MathUtil.BIG_ZERO;
      ergebnis.nettoPlus = MathUtil.BIG_ZERO;
      ergebnis.elternGeldEtPlus = MathUtil.BIG_ZERO;
      ergebnis.elternGeldKeineEtPlus = MathUtil.BIG_ZERO;
    }
    return ergebnis;
  }

  /**
   * Methode zum Ermitteln der Elterngeldperioden (ausgedrückt in Lebensmonaten des Kindes) - abhängig von dem
   * Ergebnis der Elterngeldplanung
   *
   * @param {FinanzDaten} finanzDaten
   * @param {PlanungsDaten} planungsDaten
   * @return {ElternGeldPerioden}
   */
  private static determineEGPerioden(
    finanzDaten: FinanzDaten,
    planungsDaten: PlanungsDaten,
  ): ElternGeldPerioden {
    const anfang_eg_per: number[] = [];
    const ende_eg_per: number[] = [];
    let start: boolean = true;
    for (let i: number = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
      if (planungsDaten.get(i) !== ElternGeldArt.KEIN_BEZUG) {
        if (start) {
          anfang_eg_per.push(i);
          start = false;
        }
        if (anfang_eg_per.length === ende_eg_per.length) {
          ende_eg_per[anfang_eg_per.length - 1] = i;
        } else {
          ende_eg_per.push(i);
        }
      } else {
        start = true;
      }
    }
    if (ende_eg_per.length === anfang_eg_per.length - 1) {
      ende_eg_per.push(PLANUNG_ANZAHL_MONATE);
    }
    return {
      anfang: anfang_eg_per,
      ende: ende_eg_per,
    };
  }
}
